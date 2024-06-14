<?php

    include("../settings.php");
    session_start();

    header('Content-Type: application/json');

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

    $detailErrors = array();

    $inputPatterns = [
        "name_signup_pattern" => "/^[a-zA-Z\s]{1,25}$/",
        "username_signup_pattern" => "/^[a-zA-Z0-9]{1,20}$/",
        "password_signup_pattern" => "/^.{8,}$/"
    ];

    if(!isset($_POST['name-signup']) || !isset($_POST['nature-signup']) || !isset($_POST['username-signup']) || !isset($_POST['password-signup'])) {
        $responseData = array(
            'code' => 401,
            'description' => 'Unauthorized access',
        );

        http_response_code(401);
        echo json_encode($responseData);
        exit();
    }

    if ($conn) {
        $name = sanitizeInput("name-signup", $conn);
        $nature = sanitizeInput("nature-signup", $conn);
        $username = sanitizeInput("username-signup", $conn);
        $password = sanitizeInput("password-signup", $conn);
        $confirmPassword = sanitizeInput("password-confirm-signup", $conn);
    }
    else {
        $responseData = array(
            'code' => 500,
            'description' => 'Something went wrong, please try again later.',
        );

        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode($responseData);
        exit();
    }

    if (preg_match($inputPatterns["name_signup_pattern"], $name) &&
        preg_match($inputPatterns["username_signup_pattern"], $username) &&
        preg_match($inputPatterns["password_signup_pattern"], $password) &&
        $password === $confirmPassword && ($nature == "individual" || $nature == "organization" || $nature == "government")) {

        $userQuery = "SELECT username FROM parties WHERE username='$username'";
        $usernames = $conn->query($userQuery);
        
        $usernameExist = false;

        if(mysqli_num_rows($usernames) > 0) {
            $detailErrors[] = array('input' => 'username-signup', 'errorDescription' => 'This username has already been taken.');
            $usernameExist = true;
        }
       
        // only create account and insert into database if username do not already exist
        if (!$usernameExist) {

            // Hash the password using Blowfish algorithm with the generated salt
            $hashedPassword = crypt($password, '$5$rounds=1000$salttest$');

            $query = "INSERT INTO parties (
                name, 
                username, 
                password, 
                nature
                ) 
                VALUES ('$name', 
                    '$username', 
                    '$hashedPassword', 
                    '$nature'
                )";
            

            $addAccount = $conn->query($query);

            if($addAccount) {
                $responseData = array(
                    'code' => 200,
                    'description' => 'Congratulations! Your account has been created. You can now use this account to sign in.'
                );
                http_response_code(200);
            }
            else {
                $responseData = array(
                    'code' => 500,
                    'description' => 'Something went wrong. Please try again later.'
                );
                http_response_code(500);
            }
        }
        else {
            $responseData = array(
                'code' => 400,
                'description' => 'We cannot create new account for you. Please check if there is any errors on the fields.',
                'detailErrors' => $detailErrors
            );
            http_response_code(400);
        }
    } else {


        if($name == "") {
            $detailErrors[] = array('input' => 'name-signup', 'errorDescription' => 'Please enter your full name.');
        }
        elseif(!preg_match($inputPatterns["name_signup_pattern"], $name)) {
            $detailErrors[] = array('input' => 'name-signup', 'errorDescription' => 'Max 25 characters (a-z, A-Z, spaces) are allowed.');
        }

        if($username == "") {
            $detailErrors[] = array('input' => 'name-signup', 'errorDescription' => 'Please enter the username.');
        }
        elseif(!preg_match($inputPatterns["username_signup_pattern"], $password)) {
            $detailErrors[] = array('input' => 'username-signup', 'errorDescription' => 'Max 20 characters (a-z, A-Z, 0-9) are allowed. No whitespace.');
        }

        if(strlen($password) < 8) {
            $detailErrors[] = array('input' => 'name-signup', 'errorDescription' => 'The password must have at least 8 characters.');
        }

        if($nature != "individual" && $nature != "organization" && $nature != "government") {
            $detailErrors[] = array('input' => 'nature-signup', 'errorDescription' => 'Nature is invalid.');
        }

        if($password !== $confirmPassword) {
            $detailErrors[] = array('input' => 'password-confirm-signup', 'errorDescription' => 'The confirm password does not match.');
        }

        $responseData = array(
            'code' => 400,
            'description' => 'We cannot create new account for you. Please check if there is any errors on the fields.',
            'detailErrors' => $detailErrors
        );

        http_response_code(400);
    }
    
    echo json_encode($responseData);
?>