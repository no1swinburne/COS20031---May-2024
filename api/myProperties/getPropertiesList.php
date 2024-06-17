<?php
    require_once("../settings.php");
    require_once("../authentication/checkSessionforAPI.php");

    $partyId = $_SESSION['partyId'];

    $offset = $_GET['offset'];
    $limit = 3;

    $mode = $_GET['mode'];

    mysqli_begin_transaction($conn);

    if($mode == "owning") {
        $firstSql = "SET @row_number := 0;";
        $secondSql = "SET @current_property := '';";
        $sql = "SELECT property_id, name, description, image_url, row_num FROM ( SELECT properties.property_id, properties.name, properties.description, images.image_url, (@row_number := CASE WHEN @current_property = properties.property_id THEN @row_number + 1 ELSE 1 END) AS row_num, (@current_property := properties.property_id) FROM properties JOIN images ON images.property_id = properties.property_id WHERE owner_id = $partyId ORDER BY properties.property_id, images.image_url ) AS ranked WHERE row_num = 1 LIMIT $limit OFFSET $offset;";
    
        $firstQuery = $conn->query($firstSql);
        $secondQuery = $conn->query($secondSql);
    
        $getProperties = $conn->query($sql);
    } 
    else {
        $firstSql = "SET @row_number := 0;";
        $secondSql = "SET @current_property := '';";
        $sql = "SELECT property_id, name, description, image_url, row_num FROM ( SELECT properties.property_id, properties.name, properties.description, images.image_url, (@row_number := CASE WHEN @current_property = properties.property_id THEN @row_number + 1 ELSE 1 END) AS row_num, (@current_property := properties.property_id) FROM properties JOIN images ON images.property_id = properties.property_id WHERE owner_id = 0 ORDER BY properties.property_id, images.image_url ) AS ranked WHERE row_num = 1 LIMIT $limit OFFSET $offset;";
    
        $firstQuery = $conn->query($firstSql);
        $secondQuery = $conn->query($secondSql);
    
        $getProperties = $conn->query($sql);
    }
   

    $propertiesList = array();

    if ($getProperties) {
        $numberOfProperties = mysqli_num_rows($getProperties);
        while($record = mysqli_fetch_assoc($getProperties)) {
            $propertiesList[] = array(
                'id' => $record['property_id'],
                'name' => $record['name'],
                'description' => substr($record['description'], 0, 100) . "...",
                'imageURL' => $record['image_url']
            );
        }
        if($numberOfProperties == $limit) {
            $responseData = array(
                'code' => 200,
                'propertiesCount' => $numberOfProperties,
                'limit' => $limit,
                'propertiesList' => $propertiesList,
                'nextOffset' => $offset + $limit
            );
        }
        else {
            $responseData = array(
                'code' => 200,
                'propertiesCount' => $numberOfProperties,
                'limit' => $limit,
                'propertiesList' => $propertiesList,
            );
        }
        
        http_response_code(200);

        
    }
    else {
        $responseData = array(
            'code' => 500,
            'description' => 'Something went wrong'
        );
        http_response_code(500);
    }

    mysqli_commit($conn);

    echo json_encode($responseData);
?>