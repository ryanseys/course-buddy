<?php

require_once ("db.php");
require_once ("http_args.php");
require_once ("json_responses.php");

$post_body = file_get_contents('php://input');

if (!$post_body){
    echo error_json('please include array of offering ids in POST body');
}

$db = new database();
$offering_ids = json_decode($post_body);
$results = array();

// Enroll in each course individually, and store results of each enrollment
$db->conn->autoCommit(FALSE);
foreach($offering_ids as $offering_id){
    $result = enroll($db, $offering_id);
    $results[$offering_id] = $result;
}
$db->conn->commit();

echoAsJson($results);

$db->close();

function enroll($db, $offering_id){
    $offering_data = get_offering_data($db, $offering_id);

    // Get existing offering capacity
    $cap = $db->execute("SELECT capacity from offerings WHERE id=$offering_id;")->fetch_assoc()["capacity"];
    if ($cap > 0) {
        $db->execute("UPDATE offerings SET capacity=capacity - 1 WHERE id=$offering_id;");
        $offering_data['success'] = true;
    } else {
         $offering_data['success'] = false;
    }
    return json_encode($offering_data);
}

function get_offering_data($db, $offering_id){
    return $db->execute("SELECT c.dept, c.code, c.name, o.seq FROM offerings o INNER JOIN courses c ON c.id = o.course WHERE o.id=$offering_id;")->fetch_assoc();
}
?>
