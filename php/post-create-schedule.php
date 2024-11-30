<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('SCH');
    $userID = $data->userID;
    $foodID = $data->foodID;
    $interval = $data->interval;
    $addressID = $data->addressID;
    $time = $data->time;

    $query = "SELECT FoodID FROM schedules WHERE UserID = '$userID' AND Interval = '$interval' AND FoodID = '$foodID'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(array(
            "statusText" => "Món ăn đã có trong lịch trình",
            "status" => false
        ));
        return;
    }

    $query = "SELECT FoodID FROM schedules WHERE UserID = '$userID' AND Interval = '$interval'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($result) {
        $addressID = $result['AddressID'];
        $time = $result['Time'];
        $query = "INSERT INTO schedules (ID, UserID, FoodID, Interval, AddressID, Pick, Quantity, `Time`) 
    VALUES ('$id', '$userID', '$foodID', '$interval', '$addressID', 1, 1, '$time')";
    } else {
        $query = "INSERT INTO schedules (ID, UserID, FoodID, Interval, AddressID, Pick, Quantity, `Time`)
    VALUES ('$id', '$userID', '$foodID', '$interval', '$addressID', 1, 1, '$time')";
    }

    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array(
        "statusText" => "Thêm lịch trình thành công",
        "status" => true
    ));
} catch (Exception $e) {
    json_encode(array(
        "statusText" => "Thêm lịch trình thất bại! $e",
        "status" => false
    ));
}
