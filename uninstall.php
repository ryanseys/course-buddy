<?php

require_once ("db.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header("refresh:3;url=install.html");
    echo "Uninstalling... ";

    // connect, regardless of whether database exists created or not
    $db = new database();
    $db->drop_db();

    echo "Done! You will be redirected shortly...";
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    header("Location: install.html");
    die();
}

?>
