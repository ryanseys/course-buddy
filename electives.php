<?php
  require_once("db.php");
  require_once("http_args.php");
  require_once("json_responses.php");
  $db = new database();

  $program_id = get_arg("program");
  $group_name = get_arg("group");

  if ($program_id !== null){
    $program_id = $db->escape_str($program_id);
    echo $db->executeToJsonArray("SELECT * FROM program_elective_groups WHERE program=$program_id");
  } elseif ($group_name !== null){
    $group_name = $db->escape_str($group_name);
    echo $db->executeToJsonArray(
      "SELECT c.id, c.dept, c.code, c.name
      FROM elective_group_courses g
      INNER JOIN courses c
      ON g.course=c.id
      WHERE g.elective_group=\"$group_name\";"
    );
  } else {
    echo error_json("program id or group name not specified");
  }
  $db->close();
?>
