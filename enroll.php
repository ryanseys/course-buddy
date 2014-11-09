<?php

require_once ("db.php");
require_once ("http_args.php");
require_once ("json_responses.php");

$db = new database();
$offering_ids = json_decode($_POST["enrollIn"]);
$results = array();

// Enroll in each course individually, and store results of each enrollment
foreach($offering_ids as $offering_id){
    $result = enroll($db, $offering_id);
    $results[$offering_id] = $result;
}

echoAsJson($results);

$db->close();

function enroll($db, $offering_id){
    // Get existing offering capacity
    $cap = $db->execute("SELECT capacity from offerings WHERE id=$offering_id;")->fetch_assoc()["capacity"];
    if ($cap > 0) {
        $db->execute("UPDATE offerings SET capacity=capacity - 1 WHERE id=$offering_id;");
        return true;
    } else {
        return false;
    }
}
?>
