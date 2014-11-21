<?php

require_once ("db.php");
require_once ("http_args.php");
require_once ("json_responses.php");
require_once ("sql.php");

$db = new database();

$program_id = get_arg("program");
$group_names = get_arg("groups");
$group_name = get_arg("group");
$display_all = get_arg("all");

if ($program_id){
    if ($display_all == "true") {
        echo json_encode(get_all_electives($db, $program_id));
    } else {
        echo json_encode(get_elective_groups($db, $program_id));
    }
} else if ($group_name){
    echo json_encode(get_electives($db, $group_name));
} else if ($group_names){
    $results = array();
    foreach(json_decode($group_names) as $group_name){
        array_push($results, ['req_group' => $group_name, 'electives' => get_electives($db, $group_name)]);
    }
    echo json_encode($results);
} else {
    echo error_json('must include a program, group, or groups param');
}

$db->close();

function get_elective_groups($db, $program_id){
    $program_id = $db->escape_str($program_id);
    $res = get_program_electives($db, $program_id);
    return $res;
}

function get_electives($db, $group_name){
    $group_name = $db->escape_str($group_name);
    $res = $db->executeToArray(
        "SELECT c.id, c.dept, c.code, c.name
        FROM elective_group_courses g
        INNER JOIN courses c
        ON g.course=c.id
        WHERE g.elective_group=\"$group_name\";"
    );
    return $res;
}

function get_all_electives($db, $program_id) {
    $program_id = $db->escape_str($program_id);
    return $db->executeToArray("
        SELECT DISTINCT(c.id), c.dept, c.code, c.name
        FROM elective_group_courses g
        INNER JOIN courses c
        ON g.course=c.id
        WHERE g.elective_group IN (
            SELECT DISTINCT(req_group) FROM program_elective_groups
            WHERE program='$program_id'
        );
    ");
}
?>
