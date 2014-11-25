<?php

require_once "db.php";
require_once "http_args.php";
require_once "json_responses.php";

if (!isset($_POST['enroll_in'])) {
    echo error_json('expected enroll_in argument');
}

$db = new database();
$offering_ids = json_decode($_POST['enroll_in']);
$results = array();

// Enroll in each course individually, and store results of each enrollment
$db->conn->autoCommit(FALSE);

foreach ($offering_ids as $offering_id) {
    $result = enroll($db, $offering_id);
    $results[$offering_id] = $result;
}

$db->conn->commit();

echoAsJson($results);

$db->close();

function enroll($db, $offering_id) {
    $offering_data = get_offering_data($db, $offering_id);

    // Aquire the enrollment lock, to remove the possibility for over-enrollment
    $lockfile = fopen("enroll.lock", "r+");
    while (true) {
        if (flock($lockfile, LOCK_EX)) {
            // Get existing offering capacity
            $cap = $db->execute("SELECT capacity from offerings WHERE id=$offering_id;")->fetch_assoc()["capacity"];
            if ($cap > 0) {
                $db->execute("UPDATE offerings SET capacity=capacity - 1 WHERE id=$offering_id;");
                $offering_data['success'] = true;
            } else {
                $offering_data['success'] = false;
            }

            flock($lockfile, LOCK_UN);
            fclose($lockfile);
            break;
        }
        usleep(100);
    }
    return json_encode($offering_data);
}

function get_offering_data($db, $offering_id) {
    return $db->execute("SELECT c.dept, c.code, c.name, o.seq FROM offerings o INNER JOIN courses c ON c.id = o.course WHERE o.id=$offering_id;")->fetch_assoc();
}
?>
