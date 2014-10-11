<?php
require_once("db.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  header("refresh:3;url=index.html");
  echo "Installing... ";

  // connect, regardless of whether database exists created or not
  $db = new database();
  $db->execute("DROP DATABASE IF EXISTS coursebuddy;");
  $db->execute("CREATE DATABASE coursebuddy;");
  $db->close();

  // reconnect to newly created database
  $db = new database();

  // install all tables
  $installfile = fopen("csv_to_sql/install.sql", "r");
  $install_sql = fread($installfile, filesize("csv_to_sql/install.sql"));
  if (!$db->execute_multi($install_sql)) {
    echo "Multi query failed: (" . $db->getError() . ") ";
  }
  fclose($installfile);
  $db->close();

  echo "Done! You will be redirected shortly...";
}

if($_SERVER['REQUEST_METHOD'] == 'GET') {
  header("Location: install.html");
  die();
}

?>
