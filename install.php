<?php

require_once ("db.php");

error_reporting(E_ALL & ~E_NOTICE);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // connect, regardless of whether database exists created or not
    $db = new database();
    $db->create_and_select_db();

    // This sets the global size of import the db will accept
    // I have increased it here because our install.sql is larger than
    // 1MB which is the default max packets.
    //
    // Note: This will likely not work on a shared DB system, but should
    // be fine for our uses.
    //
    // See: http://stackoverflow.com/questions/8062496/how-to-change-max-allowed-packet-size
    $db->set_max_packets();

    // install all tables
    $installfile = fopen("install.sql", "r") or die("Error: Could not open install.sql");
    $install_sql = fread($installfile, filesize("install.sql"));
    if (!$db->execute_multi($install_sql)) {
        echo "Install failed: (" . $db->getError() . ") ";
    } else {
        echo "Done! You will be redirected shortly...";
    }
    fclose($installfile);
    $db->close();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    header("Location: install.html");
    die();
}

?>
