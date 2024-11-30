<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $status = $data->status;

    $query = "UPDATE restaurants SET Status =  '$status' WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array("message" => "Cập nhật trạng thái nhà hàng thành công", "status" => true));
} catch (Exception $e) {
    echo json_encode(array("message" => "Cập nhật trạng thái nhà hàng thất bại bởi vị $e", "status" => false));
}
