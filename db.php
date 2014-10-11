<?php
  require_once 'config.php';
  class database {
    function __construct($host = MYSQL_HOST, $user = MYSQL_USER, $pass = MYSQL_PASSWORD, $dbname = MYSQL_DATABASE, $port = MYSQL_PORT) {

      // first attempt to connect directly to mysql + database
      $this->conn = new mysqli($host, $user, $pass, $dbname, $port);
      if (mysqli_connect_error()) {
        // then try to connect to just mysql server
        $this->conn = new mysqli($host, $user, $pass, NULL, $port);
        if (mysqli_connect_error()) {
          die('Connection Error: ' . mysqli_connect_error());
        }
      }
    }

    function execute($sql) {
      return $this->conn->query($sql);
    }

    function get_name() {
      return MYSQL_DATABASE;
    }

    function create_and_select_db($dbname = MYSQL_DATABASE) {
      $this->conn->query("DROP DATABASE IF EXISTS ".$dbname.";");
      $this->conn->query("CREATE DATABASE ".$dbname.";");
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
      $this->conn->query('SET @@global.max_allowed_packet = '. 64*1024*1024);
    }

    function drop_db($dbname = MYSQL_DATABASE) {
      $this->conn->query("DROP DATABASE IF EXISTS ".$dbname.";");
    }

    function execute_multi($sql) {
      return $this->conn->multi_query($sql);
    }

    function executeToJSONArray($sql) {
      $results = array();
      if ($result = $this->conn->query($sql)) {
        while($row = $result->fetch_object()) {
          array_push($results, $row);
        }
      }
      return json_encode($results);
    }

    function getError() {
      return mysqli_error($this->conn);
    }

    function close() {
      mysqli_close($this->conn);
    }
  }
?>
