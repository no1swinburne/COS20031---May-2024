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

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

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

        // $query = "SELECT * FROM properties";
        // $result = mysqli_query($conn, $query);
    
        // if ($result) {
        //     $properties = array();
        //     while ($row = mysqli_fetch_assoc($result)) {
        //         $properties[] = $row;
        //     }
        // }
        // QUERY TREN QUERY HET DATA TU DB :)

        $sql1 = "INSERT INTO properties (
            property_id, name, number_floors, number_bedrooms,
            number_bathrooms, has_yard, description, amenities, address_id, owner_id, area)
            VALUES (
                NULL, '$name', '$numberOfFloors', '$numberOfBedrooms', '$numberOfBathrooms',
                '$description', '$hasYard', '$amenities'
            )";

        $sql2 = "SELECT name FROM properties WHERE name Like '%$name%"; // Base query

        $firstQuery = $conn->query($sql1);
        $secondQuery = $conn->query($sql2);
        // sua query
        
        $result = mysqli_query($conn, $sql2);
    
        if ($result) {
            $properties = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $properties[] = $row;
            }
    
            echo json_encode(array('code' => 200, 'properties' => $properties));
        } else {
            echo json_encode(array('code' => 500, 'description' => 'Failed to retrieve properties.'));
        }
    } else {
        echo json_encode(array('code' => 500, 'description' => 'Database connection failed.'));
    }

    mysqli_close($conn);
    
?>