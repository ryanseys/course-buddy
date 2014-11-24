<?php
require_once 'db.php';
require_once 'sql.php';
require_once 'year_standing.php';
require_once 'prereqs.php';

$taken_courses = explode(',', $_POST['courses']);

$db = new database();

$course_options = array(
  "core" => array(),
  "electives" => array()
);

$year_standing = getYearStanding($db, $_POST['program'], $taken_courses);

// Find all core courses that we have not taken yet, but have the prereqs for.
foreach(get_remaining_core_courses_for_offpattern($db, $_POST['program'], $_POST['term'], $taken_courses) as $potential_course) {
  if (course_has_offerings_for_term($db, $_POST['term'], $potential_course->course) &&
      havePrereqsForCourse($db, $potential_course->course, $taken_courses, $year_standing)) {
    if ($course = get_course_by_id($db, $potential_course->course)) {
      array_push($course_options["core"], array(
        "id"   => $course->id,
        "dept" => $course->dept,
        "code" => $course->code,
        "name" => $course->name
      ));
    }
  }
}

// Find all the elective groups that we have not yet completed.
$taken_course_pool = $taken_courses;
$potential_elective_groups = get_program_electives($db, $_POST['program']);
$remaining_elective_groups = array();
foreach($potential_elective_groups as $potential_elective_group) {
  if ($applied_course = has_completed_course_in_elective_group($db, $potential_elective_group->req_group, $taken_course_pool)) {
    $taken_course_pool = array_diff($taken_course_pool, array($applied_course->course));
  } else {
    array_push($remaining_elective_groups, $potential_elective_group->req_group);
  }
}

// For each elective group, find all the courses that can satisfy the group which we have the prereqs for, and we haven't taken yet.
foreach($remaining_elective_groups as $elective_group) {
  $result_course_list = array();
  foreach(get_elective_options_for_group($db, $elective_group, $taken_courses) as $potential_course) {
    if (course_has_offerings_for_term($db, $_POST['term'], $potential_course->course) &&
      havePrereqsForCourse($db, $potential_course->course, $taken_courses, $year_standing)
    ) {
      if ($course = get_course_by_id($db, $potential_course->course)) {
        array_push($result_course_list, array(
          "id"   => $course->id,
          "dept" => $course->dept,
          "code" => $course->code,
          "name" => $course->name
        ));
      }
    }
  }

  array_push($course_options["electives"], array("req_group" => $elective_group, "electives" => $result_course_list));
}

echo(json_encode(array(
  "next_courses" => $course_options
)));

?>
