<?php
  require_once("db.php");
  $db = new database();

  $all_courses = "SELECT * FROM courses LIMIT 1000";

  $result = $db->executeToJSONArray($all_courses);
  echo $result;

  $db->close();
?>
