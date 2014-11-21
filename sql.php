<?php

function get_program_electives($db, $program_id) {
    return $db->executeToArray("SELECT * FROM program_elective_groups WHERE program=$program_id");
}

function get_all_programs($db) {
    $sql = "SELECT * FROM programs;";
    return $db->executeToArray($sql);
}

function get_program_by_id($db, $program_id) {
    $program_id = $db->escape_str($program_id);
    $sql = "SELECT * FROM programs WHERE id=$program_id;";
    return $db->executeToArray($sql);
}

function get_course_by_id($db, $course_id) {
  $course_id = $db->escape_str($course_id);
  $sql = "SELECT * FROM courses WHERE id='$course_id';";
  return $db->executeToSingleResult($sql);
}

function get_program_courses_for_term($db, $program, $term, $year) {
    $program = $db->escape_str($program);
    $term = $db->escape_str($term);
    $year = $db->escape_str($year);
    $sql = (
        "SELECT o.id, c.id AS course, type, seq, term, time_start, time_end, capacity, days, dept, code, name
      FROM offerings o
      INNER JOIN courses c
      ON c.id=o.course
      WHERE o.term=\"$term\" AND capacity > 0 AND o.course
      IN (SELECT course
          FROM program_reqs
          WHERE program=$program AND term=\"$term\" AND year=$year
      );");// select courses by program id
    return $db->executeToArray($sql);
}

function get_offerings_of_courses($db, $term, $courses) {
  $term = $db->escape_str($term);
  $sql_course_list = gen_sql_list($courses);

  $sql = ("
    SELECT o.id, c.id AS course, type, seq, term, time_start, time_end, capacity, days, dept, code, name
    FROM offerings o
    INNER JOIN courses c
    ON c.id=o.course
    WHERE o.course IN ($sql_course_list) AND term='$term';
  ");
  return $db->executeToArray($sql);
}

function get_remaining_core_courses_for_offpattern($db, $program, $next_term, $taken_courses) {
  $program = $db->escape_str($program);
  $term = $db->escape_str($next_term);
  $sql_course_list = gen_sql_list($taken_courses);
  return $db->executeToArray("
    SELECT course
    FROM program_reqs
    WHERE program='$program' AND term='$term' AND course NOT IN ($sql_course_list);
  ");
}

function has_completed_course_in_elective_group($db, $elective_group, $taken_courses) {
  $elective_group = $db->escape_str($elective_group);
  $sql_course_list = gen_sql_list($taken_courses);
  return $db->executeToSingleResult("
    SELECT course FROM elective_group_courses
    WHERE elective_group='$elective_group'
    AND course IN ($sql_course_list)
    LIMIT 1;
  ");
}

function get_elective_options_for_group($db, $elective_group, $taken_courses) {
  $elective_group = $db->escape_str($elective_group);
  $sql_course_list = gen_sql_list($taken_courses);
  return $db->executeToArray("
    SELECT course FROM elective_group_courses
    WHERE elective_group='$elective_group'
    AND course NOT IN ($sql_course_list);
  ");
}

function course_has_offerings_for_term($db, $term, $course) {
  $course = $db->escape_str($course);
  $term = $db->escape_str($term);
  return $db->executeToSingleResult("
    SELECT id FROM offerings
    WHERE course='$course' AND term='$term' AND capacity > 0
    LIMIT 1;
  ") != null;
}

function gen_sql_list($array) {
  return implode(", ", array_map("intval", $array));
}

?>
