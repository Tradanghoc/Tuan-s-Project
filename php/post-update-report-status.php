<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $targetID = $data->targetID;
    $status = $data->status;

    $query = "UPDATE reports SET Status = '$status' WHERE TargetID = '$targetID'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array("message" => "Cập nhật trạng thái báo cáo thành công", "status" => true));
} catch (Exception $e) {
    echo json_encode(array("message" => "Cập nhật trạng thái báo cáo thất bại bởi vị $e", "status" => false));
}
