<?php

require_once "db.php";
require_once "http_args.php";
require_once "json_responses.php";
require_once "sql.php";

$db = new database();

$program_id = get_arg("id");

if ($program_id !== null) {
    echoAsJSON(get_program_by_id($db, $program_id));
} else {
    echoAsJSON(get_all_programs($db));
}

$db->close();

?>
