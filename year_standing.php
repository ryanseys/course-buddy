<?php

/*
 * Get the student's year-standing based on the courses already taken
 */
function getYearStanding($db, $program_id, $course_ids){
  // for each year, check if the student has the required courses in order to check the next one
  for ($year_standing=1; $year_standing<5; $year_standing++){

    // Get required courses for the current year being checked
    $required_courses = $db->executeToArray("SELECT course FROM program_reqs WHERE program=$program_id AND year=$year_standing;");

    // Check if student has all of the returned courses.  return year-standing if they don't
    foreach ($required_courses as $required_course){
      if (!in_array($required_course->course, $course_ids)){
        return $year_standing;
      }
    }
  }
}

/*
 * Get the year standing required to take the given course
 */
function getCourseYearStanding($db, $program_id, $course_id){
  //echo "check year standing for ".$course_id.": ";
  $courses = $db->executeToArray("SELECT course, year FROM course_program_reqs WHERE course=$course_id AND program=$program_id;");
  //echo json_encode($courses);
  $course = $courses[0];
  if ($course == NULL){
    return 1;
  } else {
    return $course->year;
  }
}

?>
