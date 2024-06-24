<?php
    include("../settings.php");
    include("../authentication/checkSessionforAPI.php");
    include("../s3Constants.php");
    header('Content-Type: application/json');
    require '../../vendor/autoload.php';

    use Aws\S3\S3Client;
    use Aws\Exception\AwsException;

    // Create an S3 client
    $s3 = new S3Client([
        'version' => S3_VERSION,
        'region'  => S3_REGION,
        'credentials' => [
            'key' => IAM_ACCESS_KEY_ID,
            'secret' => IAM_SECRET_ACCESS_KEY_ID,
        ]
    ]);

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

    // EXAMPLE FUNCTION FOR VALIDATION OF FILES, ADD CODE TO CHECK FOR FILE SIZE
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

            // Check for file size (limit to 5MB)
            $maxFileSize = 5 * 1024 * 1024;
            if ($file['size'] > $maxFileSize) {
                $fileErrors[] = 'File size should not exceed 5MB.';
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

    if (isset($_FILES['images'])) {
        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $file = array(
                'name' => $_FILES['images']['name'][$key],
                'type' => $_FILES['images']['type'][$key],
                'tmp_name' => $tmpName,
                'error' => $_FILES['images']['error'][$key],
                'size' => $_FILES['images']['size'][$key]
            );

            $fileErrors = validateUploadedFile($file, $allowedMimeTypes);
            if (!empty($fileErrors)) {
                $detailErrors[] = array('input' => 'images', 'errorDescription' => $fileErrors[0]);
            }
        }
    } else {
        $detailErrors[] = array('input' => 'images', 'errorDescription' => 'No files uploaded.');
    }
    
    error_log("Received form data: Name - $name, Street - $street, City - $city, State - $state, Area - $area, Floors - $numberOfFloors, Bedrooms - $numberOfBedrooms, Bathrooms - $numberOfBathrooms, Description - $description");

    // DONT FORGET ABOUT FILE UPLOAD
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

        if (empty($detailErrors) && !empty($_FILES['images']['tmp_name'])) {
            $queryErrors = "";
            mysqli_begin_transaction($conn);

            try {
                $firstQuery = "INSERT INTO addresses (street, city, state) VALUES ('$street', '$city', '$state')";
                $addAddress = $conn->query($firstQuery);

                if (!$addAddress) {
                    throw new Exception("Cannot add address");
                }

                $address_id = mysqli_insert_id($conn);
                $owner_id = $_SESSION["partyId"];
                $amenitiesJson = mysqli_real_escape_string($conn, json_encode($amenities));
                $secondQuery = "INSERT INTO properties (name, area, number_floors, number_bedrooms, number_bathrooms, has_yard, description, amenities, owner_id, address_id) VALUES ('$name', '$area', '$numberOfFloors', '$numberOfBedrooms', '$numberOfBathrooms', '$hasYard', '$description', '$amenitiesJson', '$owner_id', '$address_id')";
                $addProperty = $conn->query($secondQuery);

                if (!$addProperty) {
                    throw new Exception("Cannot add property");
                }


                $property_id = mysqli_insert_id($conn);
                foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                    try {
                        $result = $s3->putObject([
                            'Bucket' => S3_BUCKET,
                            'Key'    => basename($_FILES['images']['name'][$key]),
                            'SourceFile' => $tmpName,
                            'ACL'    => 'public-read'
                        ]);

                        $imageUrl = $result['ObjectURL'];
                        $imgQuery = "INSERT INTO images (property_id, image_url) VALUES ('$property_id', '$imageUrl')";
                        $addImg = $conn->query($imgQuery);
                        
                        if (!$addImg) {
                            throw new Exception("Cannot add image to database");
                        }
                    } catch (AwsException $e) {
                        throw new Exception("Cannot upload image to S3: " . $e->getMessage());
                    }
                }
                mysqli_commit($conn);
                $responseData = array(
                    'code' => 200,
                    'description' => 'Property added successfully.'
                );

                http_response_code(200);
            } catch (Exception $e) {
                mysqli_rollback($conn);
                error_log($e->getMessage());

                $responseData = array(
                    'code' => 500,
                    'description' => 'Something went wrong. Please try again later.' . $e
                );

                http_response_code(500);
            }
        } else {
            if (empty($_FILES['images']['tmp_name'])) {
                $detailErrors[] = array('input' => 'images', 'errorDescription' => 'Please upload at least one file.');
            }
            $responseData = array(
                'code' => 400,
                'description' => 'There are validation errors.',
                'detailErrors' => $detailErrors
            );
            http_response_code(400);
        }
    } else {
        // PLEASE UPLOAD AT LEAST 1 FILE
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

        if (empty($_FILES['images']['tmp_name'])) {
            $detailErrors[] = array('input' => 'images', 'errorDescription' => 'Please upload at least one file.');
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