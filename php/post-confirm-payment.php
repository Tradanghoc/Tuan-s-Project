<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

function generateID($prefix) {
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
    $orderID = $data -> orderID;
    $item = $data -> item;

    foreach($item as $key => $i){
    $id = $i->id;
    
    $quantity = $i->quantity;
    $query = "UPDATE orderitems 
    INNER JOIN foods ON foods.Id = orderitems.FoodID
    SET Pick = 1, Quantity = $quantity, 
    orderitems.Status = 'Waiting', Value = (foods.Price * (1 - foods.Discount / 100) * orderitems.Quantity)
     WHERE orderitems.Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt -> execute();
    }

    $query = "SELECT orderitems.`OrderID`,
    SUM(orderitems.`Quantity` * ROUND(foods.Price * (1 - foods.`Discount` / 100))) AS Total
    from orderitems 
    INNER JOIN foods ON foods.Id = orderitems.`FoodID` AND orderitems.`Pick` = 1
    WHERE orderitems.`OrderID` = '$orderID' GROUP BY orderitems.`OrderID` LIMIT 100";
    $stmt = $dbConn -> prepare($query);
    $stmt -> execute();
    $order = $stmt -> fetchColumn(1);

    if($order === false) {
        echo json_encode(array(
            "status" => false,
            "statusText" => "Không thể thanh toán đơn hàng không có món ăn"
        ));
        return;
    }
    

    $query = "UPDATE `orders` SET TotalValue = $order WHERE `Id` = '$orderID'";
    $stmt = $dbConn -> prepare($query);
    $stmt -> execute();

    echo json_encode(array(
        "status" => true,
        "statusText" => "Đã xác nhận đơn hàng"
    ),JSON_UNESCAPED_UNICODE);

    
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Lỗi cập xác nhận thanh toán bởi vì $e"));
}

?>