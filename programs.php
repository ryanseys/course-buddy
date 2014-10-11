<?php
  require_once("db.php");

  $db = new database();

  $programs = "SELECT * FROM programs;";

  echo $db->executeToJSONArray($programs);

  $db->close();
?>
