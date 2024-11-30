<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $name = $data->name;
    $description = $data->description;
    $price = $data->price;
    $discount = $data->discount;
    $feature = $data->feature;
    $status = $data->status;
    $timeMade = $data->timeMade;

    $query = "UPDATE foods SET Name = '$name', Price = '$price', 
    Description = '$description', Discount = '$discount', FeatureItem = '$feature', 
    Status = '$status', TimeMade = '$timeMade', UpdateAt = NOW() WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array(
        'status' => true,
        'statusText' => 'Cập nhật thông tin món ăn thành công!',
    ));
} catch (Exception $e) {
    echo json_encode(array(
        'status' => false,
        'statusText' => "Cập nhật thông tin món ăn thất bại! $e"
    ));
}
