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

function get_program_courses_for_term($db, $program, $term, $year) {
    $program = $db->escape_str($program);
    $term = $db->escape_str($term);
    $year = $db->escape_str($year);
    $sql = (
        "SELECT o.id, c.id AS course, type, term, time_start, time_end, capacity, days, dept, code, name
      FROM offerings o
      INNER JOIN courses c
      ON c.id=o.course
      WHERE o.term=\"$term\" AND o.course
      IN (SELECT course
          FROM program_reqs
          WHERE program=$program AND term=\"$term\" AND year=$year
      );");// select courses by program id
    return $db->executeToArray($sql);
}

?>
