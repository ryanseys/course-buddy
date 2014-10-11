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
