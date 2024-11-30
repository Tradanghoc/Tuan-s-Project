<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {

    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $query = "SELECT * FROM restaurants WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT Id FROM images WHERE OwnerID = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $image = $stmt->fetch(PDO::FETCH_ASSOC);
    $result['Image'] = $image !== false ? $image : [];



    if ($result) {
        echo json_encode(array(
            "statusText" => "Data found",
            "status" => true,
            "data" => $result
        ));
    } else {
        echo json_encode(array(
            "statusText" => "Data not found",
            "status" => false
        ));
    }
} catch (Exception $e) {
    echo json_encode(array(
        "statusText" => $e,
        "status" => false
    ));
}
