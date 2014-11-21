<?php

require_once 'config.php';

class database {
    function __construct($host = MYSQL_HOST, $user = MYSQL_USER, $pass = MYSQL_PASSWORD, $dbname = MYSQL_DATABASE, $port = MYSQL_PORT) {

        // Hide warnings just for initial connection
        // If the database doesn't exist yet, a warning will be thrown,
        // but we are actually okay with this and will create it later.
        error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

        // first attempt to connect directly to mysql + database
        $this->conn = new mysqli($host, $user, $pass, $dbname, $port);
        if (mysqli_connect_error()) {
            // then try to connect to just mysql server
            $this->conn = new mysqli($host, $user, $pass, NULL, $port);
            if (mysqli_connect_error()) {
                die('Connection Error: ' . mysqli_connect_error());
            }
        }

        error_reporting(E_ALL & ~E_NOTICE);
    }

    function execute($sql) {
        return $this->conn->query($sql);
    }

    function get_name() {
        return MYSQL_DATABASE;
    }

    function escape_str($str) {
        return $this->conn->real_escape_string($str);
    }

    function create_and_select_db($dbname = MYSQL_DATABASE) {
        $this->conn->query("DROP DATABASE IF EXISTS " . $dbname . ";");
        $this->conn->query("CREATE DATABASE " . $dbname . ";");
        return $this->conn->select_db($dbname);
    }

    // This sets the global size of import the db will accept
    // I have increased it here because our install.sql is larger than
    // 1MB which is the default max packets.
    //
    // Note: This will likely not work on a shared DB system, but should
    // be fine for our uses locally.
    //
    // See: http://stackoverflow.com/questions/8062496/how-to-change-max-allowed-packet-size
    function set_max_packets() {
        $this->conn->query('SET @@global.max_allowed_packet = ' . (64 * 1024 * 1024));
    }

    function drop_db($dbname = MYSQL_DATABASE) {
        $this->conn->query("DROP DATABASE IF EXISTS " . $dbname . ";");
    }

    function execute_multi($sql) {
        if ($this->conn->multi_query($sql))
        {
            do {
                if ($result = $this->conn->store_result())
                    $result->free();
            } while ($this->conn->more_results() && $this->conn->next_result());
            return true;
        }
        else
            return false;
    }

    function executeToArray($sql) {
        $results = array();
        if ($result = $this->conn->query($sql)) {
            while ($row = $result->fetch_object()) {
                array_push($results, $row);
            }
        }
        return $results;
    }

    function executeToJSONArray($sql) {
        $results = array();
        if ($result = $this->conn->query($sql)) {
            while ($row = $result->fetch_object()) {
                array_push($results, $row);
            }
        }
        return json_encode($results);
    }

    function executeToSingleResult($sql) {
        if ($result = $this->conn->query($sql)) {
            return $result->fetch_object();
        }
        return null;
    }

    function getError() {
        return mysqli_error($this->conn);
    }

    function close() {
        mysqli_close($this->conn);
    }
}

?>
