<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';


try {
    $data = json_decode(file_get_contents('php://input'));
    $id = $data -> id;
    $value = $data -> value;

    $query = "UPDATE orderitems SET Pick = $value WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Cập nhật trạng thái của item thành công",
        )
    );
    
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "TCập nhật trạng thái của item thất bại bởi vì $e!",
        )
    );
}
