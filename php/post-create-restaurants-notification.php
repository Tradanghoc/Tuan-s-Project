<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

function generateID($prefix)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function generateCode()
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 6; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

try {

    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('NOT');
    $adminID = $data->id;
    $title = $data->title;
    $content = $data->content;
    $restaurantIDs = $data->restaurantIDs;

    // Begin transaction
    // $dbConn->beginTransaction();


    foreach ($restaurantIDs as $restaurantID) {
        // error_log($user);
        $query = "INSERT INTO notifications (Id, Title, Content, IsRead, CreateAt, GiftID, TargetID, Creator) VALUES 
        ('$id', '$title', '$content',0, NOW(), NULL, '$restaurantID', '$adminID')";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $id = generateID('NOT');

    }

    // Commit the transaction
    // $dbConn->commit();

    echo json_encode(
        array(
            "statusText" => "Success!",
            "status" => true
        )
    );
} catch (Exception $e) {
    // Rollback the transaction if an exception occurs
    // $dbConn->rollback();

    echo json_encode(
        array(
            "statusText" => "lối ".$e,
            "status" => false
        )
    );
}
