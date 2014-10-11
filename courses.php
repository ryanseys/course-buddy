<?php
  require_once("db.php");
  $db = new database();

  $courses_sql = "SELECT * FROM courses LIMIT 1000;";

  $program_id = $db->escape_str($_GET["program"]);

  if($program_id) {
    $courses_sql = "SELECT * FROM courses WHERE id in (SELECT course FROM program_reqs WHERE program =".$program_id.");";
  }

  echo $db->executeToJSONArray($courses_sql);

  $db->close();
?>
