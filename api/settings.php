<?php
    require 'constants.php';

    $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PWD, DB_NAME);

    if ($conn->connect_errno){
        echo "<p>Database connection failure.</p>";
        exit();
    }
?>  