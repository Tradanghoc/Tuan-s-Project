<?php 

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';
try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    
    $query = "SELECT * from reports WHERE reports.Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $report = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($report);
} catch (Exception $e) {
    echo json_encode(array("message" => "Lỗi tìm báo cáo bởi vì $e"));
}

?>