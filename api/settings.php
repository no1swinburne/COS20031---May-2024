<?php
    require 'constants.php';

    use Aws\S3\S3Client;
    use Aws\Exception\AwsException;

    $conn = new mysqli(DB_HOST, DB_USERNAME, DB_PWD, DB_NAME);

    if ($conn->connect_error){
        echo "<p>Database connection failure.</p>";
        exit();
    }
?>  