<?php

require_once ("year_standing.php");

function _satisfies_prereq($prereq, $taken_course_ids, $proposed_course_ids){
  // Check if prereq is already taken
  if(in_array($prereq->prereq, $taken_course_ids)){
    return true;
  }

  // Check if prereq can be taken concurrently
  else if ($prereq->allow_concur){
    foreach($proposed_courses as $proposed_course){
      if ($prereq->prereq == $proposed_course_ids){
        return true;
      }
    }
  }

  // Otherwise, prereq not satisfied
  return false;
}

function havePrereqsForCourse($db, $course, $taken_course_ids, $proposed_course_ids, $year_standing) {
  $course = $db->escape_str($course);

  // Check that student has sufficient year-standing
  if (getCourseYearStanding($db, $_POST['program'], $course) > $year_standing){
    return false;
  }

  // Check that we have all mandantory rereqs...
  $prereqs = $db->executeToArray("
    SELECT prereq FORM prereqs
    WHERE course='$course' AND equiv_group IS NULL;
  ");
  foreach($prereqs as $prereq)
    if (!_satisfies_prereq($prereq, $taken_course_ids, $proposed_course_ids)){
      return false;
    }

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
      if (!_satisfies_prereq($prereq, $taken_course_ids, $proposed_course_ids)){
        $found = true;
        break;
      }
    }

    if (!$found) { return false; }
  }

  return true;
}

?>
