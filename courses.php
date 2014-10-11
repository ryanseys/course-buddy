<?php
  require_once("db.php");
  $db = new database();

  $courses_sql = "SELECT * FROM courses LIMIT 1000;";

  $program_id = $db->escape_str($_GET["program"]);

  if($program_id) {
    $courses_sql = "SELECT * FROM courses WHERE id in (SELECT course FROM program_reqs WHERE program =".$program_id.");";
  }

  $result = $db->executeToJSONArray($courses_sql);
  echo $result;

  $db->close();
?>
