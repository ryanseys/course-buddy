<?php

require_once "db.php";
require_once "http_args.php";

$db = new database();

$course_id = get_arg("id");
$program_id = get_arg("program");
$dept_name = get_arg("dept");

if ($course_id !== null) {
    $course_id = $db->escape_str($course_id);
    $courses_sql = "SELECT * FROM courses WHERE id=$course_id LIMIT 1;";// select course by id
} elseif ($program_id !== null) {
    $program_id = $db->escape_str($program_id);
    $courses_sql = "SELECT * FROM courses WHERE id in (SELECT course FROM program_reqs WHERE program =$program_id);";// select courses by program id
} elseif ($dept_name !== null) {
    $dept_name = $db->escape_str($dept_name);
    $courses_sql = "SELECT * FROM courses WHERE dept=\"$dept_name\";";// select courses by department name
} else {
    $courses_sql = "SELECT * FROM courses LIMIT 1000;";// by default, select first 1000 programs in db
}

echo $db->executeToJSONArray($courses_sql);

$db->close();

?>
