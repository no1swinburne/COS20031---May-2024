<?php
    session_start();

    header('Content-Type: application/json');

    $responseData = array(
        'code' => 200,
        'description' => 'User is logged in',
        'user' => array(
            'id' => $_SESSION['partyId'],
            'name' => $_SESSION['name'],
            'username' => $_SESSION['username'],
        ),
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