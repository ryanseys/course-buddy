<?php

require_once ("db.php");
require_once ("http_args.php");

$program = get_arg("program");
$courses = get_arg("courses");

echo "Program: " . $program . "<br>";
echo "Courses: " . $courses . "<br>";

?>
