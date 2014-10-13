<?php

require_once ("db.php");
require_once ("http_args.php");

$db = new database();

$program_id = get_arg("id");

if ($program_id !== null) {
    $program_id = $db->escape_str($program_id);
    $sql = "SELECT * FROM programs WHERE id=$program_id;";
} else {
    $sql = "SELECT * FROM programs;";
}

echo $db->executeToJSONArray($sql);

$db->close();

?>
