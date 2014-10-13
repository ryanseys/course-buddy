<?php

// Returns the value of the GET argument with the given name.  Or null if nto specified
function get_arg($name) {
    if (isset($_GET[$name]) == true) {
        $value = $_GET[$name];
        if (trim($value) !== null) {
            return $value;
        }
    }
    return null;
}

?>
