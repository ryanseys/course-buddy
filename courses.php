<?php
  $db = new mysqli("localhost", "root", "root", "coursebuddy");

  if (mysqli_connect_error()) {
    die('Connect Error: '.mysqli_connect_error());
  }

  $all_courses = "SELECT * FROM courses LIMIT 1000";

  $courses = array();
  if ($result = $db->query($all_courses)) {
    while($row = $result->fetch_object()) {
      array_push($courses, $row);
    }
  }

  header('Content-Type: application/json;');
  echo json_encode($courses);

  $result->close();
  mysqli_close($db);
?>
