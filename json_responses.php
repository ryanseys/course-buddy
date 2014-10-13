<?php

// returns the json representation as {"key": value}
function to_json($key, $value) {
    return json_encode(array($key => $value));
}

function error_json($message) {
    return to_json("error", $message);
}

?>
