<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

function generateID($prefix)
{
    $characters = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
    $charactersLength = strlen($characters);
    $randomString = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

try {
    $data = json_decode(file_get_contents("php://input"));
    $orderID = $data->orderID;
    $userID = $data->userID;
    $addressID = $data->addressID;
    $query = "SELECT * FROM orderitems WHERE OrderID = '$orderID' AND Pick = 0";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($orders) == 0) {

        echo json_encode(array(
            'status' => true,
            'statusText' => "Không còn món ăn trong giỏ hàng"
        ));
    } else {
        $id = generateID('ORD');
        $query = "INSERT INTO orders(Id,Status, UserID, AddressID) 
        VALUES('$id','Waiting','$userID','$addressID')";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        $query = "UPDATE orderitems SET OrderID = '$id' WHERE OrderID = '$orderID' AND Pick = 0";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        echo json_encode(array(
            'status' => true,
            'statusText' => "Đã thanh toán những món ăn đã chọn"
        ));
    }

    $query = "UPDATE orders SET Status = 'Done', CreateAt = Now() WHERE Id = '$orderID'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "message" => "Lỗi cập xác nhận thanh toán bởi vì $e"
    ));
}
