<?php
    include("../settings.php");
    session_start();

    header('Content-Type: application/json');

    $responseData = array(
        'code' => 200,
        'description' => 'User are logged in',
    );

    http_response_code(200);


    if(!isset($_SESSION['partyId']) || !isset($_SESSION['name']) || !isset($_SESSION['username'])) {
        $responseData = array(
            'code' => 401,
            'description' => 'Unauthorized access',
        );
        http_response_code(401);
    }

    echo json_encode($responseData);
    exit();
?>