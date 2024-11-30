<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

$data = json_decode(file_get_contents("php://input"));
$id = $data->id;
$name = $data->name;
$phone = $data->phone;
$email = $data->email;
$intro = $data->intro;

try {
    $query = "UPDATE restaurants SET Name = '$name', Phone = '$phone', Email = '$email', 
    Introduction = '$intro', UpdateAt = NOW() WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(array(
        "status" => true,
        "statusText" => "Cập nhật thành công"
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Cập nhật thất bại $e"
    ));
}
