<?php

require_once ("db.php");
require_once ("http_args.php");
require_once ("json_responses.php");
require_once ("year_standing.php");

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

function havePrereqsForCourse($db, $course, $taken_courses, $year_standing) {
  $course = $db->escape_str($course);

  // Check that we have all mandantory rereqs...
  $prereqs = $db->executeToArray("
    SELECT prereq FORM prereqs
    WHERE course='$course' AND equiv_group IS NULL;
  ");
  foreach($prereqs as $prereq)
    if (!in_array($prereq->prereq, $taken_courses))
      return false;

  // Check that we have at least one of each grouped prereqs...
  $prereq_groups = $db->executeToArray("
    SELECT DISTINCT(equiv_group)
    FROM prereqs
    WHERE course='$course' and equiv_group IS NOT NULL;
  ");

  foreach($prereq_groups as $prereq_group) {
    $prereq_group = $db->escape_str($prereq_group->equiv_group);
    $prereqs_for_group = $db->executeToArray("
      SELECT prereq
      FROM prereqs
      WHERE course='$course' AND equiv_group='$prereq_group';
    ");

    $found = false;
    foreach($prereqs_for_group as $prereq) {
      if (in_array($prereq->prereq, $taken_courses)) {
        $found = true;
        break;
      }
    }

    if (!$found) { return false; }
  }

  // Check that student has sufficient year-standing
  if (getCourseYearStanding($db, $_POST['program'], $course) > $year_standing){
    return false;
  }

  return true;
}

?>
