<?php

require_once ('db.php');
require_once ('http_args.php');
require_once ("json_responses.php");

$db = new database();

$pattern = get_arg('pattern');
$pattern = $db->escape_str($pattern);
$program = get_arg('program');
$program = $db->escape_str($program);

if ($pattern == 'on') {
    $term = get_arg('term');
    $term = $db->escape_str($term);
    $year = get_arg('year');
    $year = $db->escape_str($year);
    $sql = (
        "SELECT o.id, c.id AS course, type, term, time_start, time_end, capacity, days, dept, code, name
        FROM offerings o
        INNER JOIN courses c
        ON c.id=o.course
        WHERE o.course
        IN (SELECT course
            FROM program_reqs
            WHERE program=$program AND term=\"$term\" AND year=$year
        );");// select courses by program id
    echo $db->executeToJSONArray($sql);
    // echo 'Term: ' . $term . '<br>';
} else if ($pattern == 'off') {
    $courses = get_arg('courses');
    // echo 'Courses: ' . $courses . '<br>';
} else {
    echo error_json('Specify on or off pattern.');
}

$db->close();

?>
