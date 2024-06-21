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

    $allowedMimeTypes = ['image/jpeg', 'image/png'];

    function validateUploadedFile($file, $allowedTypes) {
        $fileErrors = [];
    
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $fileErrors[] = 'Error uploading the file.';
        } else {
            $fileMimeType = mime_content_type($file['tmp_name']);
            if (!in_array($fileMimeType, $allowedTypes)) {
                $fileErrors[] = 'Only JPEG and PNG files are allowed.';
            }
        }
    
        return $fileErrors;
    }

    $detailErrors = array();

    if ($conn) {
        $name = sanitizeInput("name", $conn);
        $street = sanitizeInput("street", $conn);
        $city = sanitizeInput("city", $conn);
        $state = sanitizeInput("state", $conn);
        $area = sanitizeInput("area", $conn);
        $numberOfFloors = sanitizeInput("number-floors", $conn);
        $numberOfBedrooms = sanitizeInput("number-bedrooms", $conn);
        $numberOfBathrooms = sanitizeInput("number-bathrooms", $conn);
        $description = sanitizeInput("description", $conn);
        $hasYard = isset($_POST['has-yard']) ? 1 : 0;
        $amenities = isset($_POST['amenities']) ? $_POST['amenities'] : array();
    }
    else {
        $responseData = array(
            'code' => 500,
            'description' => 'Something went wrong, please try again later.',
        );

        http_response_code(500);
        echo json_encode($responseData);
        exit();
    }

    if (isset($_FILES['image'])) {
        $fileErrors = validateUploadedFile($_FILES['image'], $allowedMimeTypes);
        if (!empty($fileErrors)) {
            $detailErrors[] = array('input' => 'image', 'errorDescription' => $fileErrors[0]);
        }
    } else {
        $detailErrors[] = array('input' => 'image', 'errorDescription' => 'No file uploaded.');
    }

    if ($name && $street && $city && $state && $area && $numberOfFloors && $numberOfBedrooms && $numberOfBathrooms && $description) {
        if(!preg_match("/^[a-zA-Z\s]+$/", $name)) {
            $detailErrors[] = array('input' => 'name', 'errorDescription' => 'Invalid name format.');
        }

        if(!is_numeric($area) || $area <= 0) {
            $detailErrors[] = array('input' => 'area', 'errorDescription' => 'Invalid area.');
        }

        if(!is_numeric($numberOfFloors) || $numberOfFloors <= 0) {
            $detailErrors[] = array('input' => 'number-floors', 'errorDescription' => 'Invalid number of floors.');
        }

        if(!is_numeric($numberOfBedrooms) || $numberOfBedrooms <= 0) {
            $detailErrors[] = array('input' => 'number-bedrooms', 'errorDescription' => 'Invalid number of bedrooms.');
        }

        if(!is_numeric($numberOfBathrooms) || $numberOfBathrooms <= 0) {
            $detailErrors[] = array('input' => 'number-bathrooms', 'errorDescription' => 'Invalid number of bathrooms.');
        }

        if(empty($detailErrors)) {
            $query = "INSERT INTO properties (name, street, city, state, area, number_of_floors, number_of_bedrooms, number_of_bathrooms, description, has_yard, amenities) VALUES ('$name', '$street', '$city', '$state', '$area', '$numberOfFloors', '$numberOfBedrooms', '$numberOfBathrooms', '$description', '$hasYard', '" . json_encode($amenities) . "')";
            
            $addProperty = $conn->query($query);

            if($addProperty) {
                $responseData = array(
                    'code' => 200,
                    'description' => 'Property details have been submitted successfully.'
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
        } else {
            $responseData = array(
                'code' => 400,
                'description' => 'There are validation errors.',
                'detailErrors' => $detailErrors
            );
            http_response_code(400);
        }
    } else {
        if(empty($name)) {
            $detailErrors[] = array('input' => 'name', 'errorDescription' => 'Please enter the name.');
        }
        if(empty($street)) {
            $detailErrors[] = array('input' => 'street', 'errorDescription' => 'Please enter the street.');
        }
        if(empty($city)) {
            $detailErrors[] = array('input' => 'city', 'errorDescription' => 'Please enter the city.');
        }
        if(empty($state)) {
            $detailErrors[] = array('input' => 'state', 'errorDescription' => 'Please enter the state.');
        }
        if(empty($area)) {
            $detailErrors[] = array('input' => 'area', 'errorDescription' => 'Please enter the area.');
        }
        if(empty($numberOfFloors)) {
            $detailErrors[] = array('input' => 'number-floors', 'errorDescription' => 'Please enter the number of floors.');
        }
        if(empty($numberOfBedrooms)) {
            $detailErrors[] = array('input' => 'number-bedrooms', 'errorDescription' => 'Please enter the number of bedrooms.');
        }
        if(empty($numberOfBathrooms)) {
            $detailErrors[] = array('input' => 'number-bathrooms', 'errorDescription' => 'Please enter the number of bathrooms.');
        }
        if(empty($description)) {
            $detailErrors[] = array('input' => 'description', 'errorDescription' => 'Please enter the description.');
        }

        $responseData = array(
            'code' => 400,
            'description' => 'There are validation errors.',
            'detailErrors' => $detailErrors
        );
        http_response_code(400);
    }
    
    echo json_encode($responseData);
?>