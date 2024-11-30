<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';
try {
    $result = array();

    $query = "SELECT orderitems.*, foods.Name as FoodName,
    users.Name AS UserName, (SELECT Id FROM images WHERE OwnerID = users.Id LIMIT 1) AS UserImage,
    (SELECT Id FROM images WHERE OwnerID = foods.Id LIMIT 1) AS FoodImage 
    FROM orderitems
    INNER JOIN orders ON orders.Id = orderitems.OrderID
    INNER JOIN users ON orders.UserID = users.Id
    INNER JOIN foods ON orderitems.FoodID = foods.Id 
    WHERE orderitems.Status = 'Waiting'";
    $stmt = $dbConn->query($query);
    $stmt->execute();

    $pending = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array(
        "data" => $pending,
        "status" => true,
        "statusText" => "Lấy thông tin đơn hàng thành công!"
    ));
    
} catch (\Throwable $th) {
}
 ?>