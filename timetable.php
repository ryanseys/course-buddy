<?php

require_once ('db.php');
require_once ('http_args.php');
require_once ("json_responses.php");
require_once ("sql.php");

$db = new database();

$pattern = get_arg('pattern');
$pattern = $db->escape_str($pattern);
$program = get_arg('program');
$program = $db->escape_str($program);

if ($pattern == 'on') {
    $courses = get_program_courses_for_term($db, $program, get_arg('term'), get_arg('year'));
    $elective_offerings = get_offerings_of_courses($db, get_arg('term'), explode(",", get_arg('chosen_electives')));
    echoAsJSON(array_merge($courses, $elective_offerings));
} else if ($pattern == 'off') {
    echoAsJSON(get_offerings_of_courses($db, get_arg('term'), explode(",", get_arg('courses'))));
} else {
    echo error_json('Specify on or off pattern.');
}

$db->close();

?>
