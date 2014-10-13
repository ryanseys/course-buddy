<?php

require_once ("db.php");
require_once ("http_args.php");
require_once ("json_responses.php");

$db = new database();

$course_id = get_arg("course");

if ($course_id !== null) {
    $course_id = $db->escape_str($course_id);
    echo $db->executeToJsonArray(
        "SELECT c.id, c.dept, c.code, c.name, p.allow_concur, p.equiv_group
        FROM prereqs p
        INNER JOIN courses c
        ON p.prereq=c.id
        WHERE p.course=$course_id;"
    );
} else {
    echo error_json("Course id not specified");
}

$db->close();

?>
