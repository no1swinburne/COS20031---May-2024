<?php

    include("../settings.php");

    header('Content-Type: application/json');

    session_start();

    // Sanitise input from users
    function sanitizeInput($input, $conn) {
        if (isset($_POST[$input])) {
            $input = $_POST[$input];
            if (is_string($input)&& trim($input) !== '') {
                $input = stripslashes($input);
                $input = htmlspecialchars($input);
                $input = mysqli_real_escape_string($conn, $input);
                return $input;
            }
        }
        return null;
    }

    // Validate login credentials
    function validateLogin($conn) {

        $username = sanitizeInput("username", $conn);
        $password = sanitizeInput("password", $conn);

        $query = "SELECT * FROM parties WHERE username = '$username'";
        $result = $conn->query($query);

        if ($result && mysqli_num_rows($result) > 0) {
            $record = mysqli_fetch_assoc($result);
            // Check that login password matches hashed password in database
            if ($record["password"] === crypt($password,'$5$rounds=1000$salttest$')) {
                $_SESSION['partyId'] = $record['party_id'];
                $_SESSION['name'] = $record['name'];
                $_SESSION['username'] = $record['username'];
                return true;
            } else {
                return [];
            }
        } else {
            return false;
        }
    }

    // Check if there is actual data submitted
    if(isset($_POST['username']) && isset($_POST['password'])) {
        if (validateLogin($conn)) {
            $responseData = array(
                'code' => 200,
                'description' => 'Login successfully!'
            );
            http_response_code(200);
        } else {
            $responseData = array(
                'code' => 400,
                'description' => 'These credentials do not match our records. Please try again later.',
                'detailsError' => []
            );
            http_response_code(400);
        }
    }
    else {
        $responseData = array(
            'code' => 401,
            'description' => 'Unauthorized access',
            'detailsError' => []
        );
        http_response_code(401);
    }
    
    echo json_encode($responseData);
?>