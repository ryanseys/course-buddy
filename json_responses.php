<?php

// returns the json representation as {"key": value}
function to_json($key, $value) {
    return json_encode(array($key => $value));
}

function echoAsJSON($value) {
    header("Content-Type: application/json;");
    echo json_encode($value);
}

function error_json($message) {
    return to_json("error", $message);
}

?>
