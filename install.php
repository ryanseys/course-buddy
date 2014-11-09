<?php

error_reporting(E_ALL & ~E_NOTICE);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Save the provided credentials permanently to the config file.
    $host = addslashes($_POST['host']);
    $port = addslashes($_POST['port']);
    $username = addslashes($_POST['username']);
    $password = addslashes($_POST['password']);

    $new_config = "<?php
      define('MYSQL_HOST', '$host');
      define('MYSQL_PORT', '$port');
      define('MYSQL_USER', '$username');
      define('MYSQL_PASSWORD', '$password');
      define('MYSQL_DATABASE', 'coursebuddy');
    ?>";

    $config_file = fopen("config.php", "w");
    ftruncate($config_file, 0);
    fwrite($config_file, $new_config);
    fclose($config_file);

    // Only load the db (and by extension config) after it has been created.
    require_once ("db.php");

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
    $installfile = fopen("csv_to_sql/install.sql", "r") or die("Error: Could not open install.sql");
    $install_sql = fread($installfile, filesize("csv_to_sql/install.sql"));
    if (!$db->execute_multi($install_sql)) {
        echo "Multi query failed: (" . $db->getError() . ") ";
    }
    fclose($installfile);
    $db->close();

    echo "Done! You will be redirected shortly...";
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    header("Location: install.html");
    die();
}

?>
