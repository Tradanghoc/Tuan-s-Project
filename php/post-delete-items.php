<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';



try {
    $data = json_decode(file_get_contents('php://input'));
    $foodID = $data->foodID;
    $orderItemID = $data->orderItemID;

    // Get address

    $query = "DELETE FROM orderitems WHERE `Id` = '$orderItemID'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(
        array(
            "status" => true,
            "statusText" => "Xóa món ăn thành công!",
        )
    );
    
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Xóa đơn hàng thất bại bởi vì $e!",
            "data" => null,
        )
    );
}
