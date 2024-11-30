<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';
$data = json_decode(file_get_contents("php://input"));
try {
    $id = $data->id;
    $query = "SELECT orderitems.Id, orderitems.Quantity, orderitems.Value, 
    orderitems.Status, orders.CreateAt, orders.UserID,
    foods.Name AS FoodName,
    users.Name AS UserName, users.Email AS UserEmail,
    users.Rank AS UserRank, 
    (SELECT Id FROM images WHERE OwnerID = users.Id LIMIT 1) AS UserImage,
    address.Phone AS UserPhone, CONCAT_WS(', ',address.Address, address.City,
    address.District, address.Ward) AS UserAddress
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodId = foods.Id
    INNER JOIN orders ON orderitems.OrderID = orders.Id
    INNER JOIN users ON orders.UserID = users.Id
    INNER JOIN address ON address.OwnerID = users.Id
    WHERE orderitems.Id = '$id'";
    $stmt = $dbConn->query($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $user = $result['UserID'];

    $query = "SELECT (SELECT COUNT(orders.Id) FROM orders 
    WHERE orders.UserID = '$user') AS TotalOrders,
    (SELECT COUNT(orders.Id) FROM orders 
    WHERE orders.UserID = '$user' AND orderitems.Status = 'Denied' 
    OR orderitems.Status = 'Cancled') AS CancelOrders,
    (SELECT COUNT(orders.Id) FROM orders 
    WHERE orders.UserID = '$user'AND orderitems.Status = 'Done') AS CompleteOrders,
    (SELECT COUNT(orders.Id) FROM orders 
    WHERE orders.UserID = '$user'AND orderitems.Status != 'Denied' 
    AND orderitems.Status != 'Cancled' AND orderitems.Status != 'Done') AS InProgressOrders
    FROM users 
    INNER JOIN orders ON orders.UserID = '$user'
    INNER JOIN orderitems ON orders.Id = orderitems.OrderID
    WHERE users.Id = '$user'";

    $stmt = $dbConn->query($query);
    $stmt->execute();
    $result['UserStatistics'] = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(array(
        "data" => $result,
        "status" => true,
        "statusText" => "Lấy thông tin chi tiết đơn hàng thành công!"
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Lấy thông tin chi tiết đơn hàng thất bại! $e"
    ));
}
