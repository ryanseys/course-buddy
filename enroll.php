<?php
  require_once("db.php");
  require_once("http_args.php");
  require_once("json_responses.php");
  $db = new database();

  $offering_id = get_arg("offering");

  if ($offering_id !== null){
  	$offering_id = $db->escape_str($offering_id);

  	// Get existing offering capacity
  	$cap = $db->execute("SELECT capacity from offerings WHERE id=$offering_id;")->fetch_assoc()["capacity"];
  	if ($cap > 0){
  		$db->execute("UPDATE offerings SET capacity=capacity - 1 WHERE id=$offering_id;");
      echo to_json("result", true);
  	} else {
  		echo to_json("result", false);
  	}
  } else {
    echo error_json("Please specify an offering id");
  }

  $db->close();
?>
