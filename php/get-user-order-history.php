<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents('php://input'));
    $id = $data->id;

    $query = "SELECT orders.TotalValue, orders.Id, orders.Delivery, orders.CreateAt,
    address.Address, address.Phone, address.City, address.District, address.Ward
    FROM orders
    INNER JOIN address ON orders.AddressID = address.Id
    WHERE orders.UserID = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $query = "SELECT orderitems.Id, orderitems.Quantity, orderitems.Value,
    orderitems.ArriveAt, orderitems.Status, 
    (SELECT Name FROM foods WHERE orderitems.FoodID = foods.Id) AS FoodName,
    (SELECT Id FROM images WHERE orderitems.FoodID = images.OwnerID) AS Image
    FROM orderitems";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $orderItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($orders as $key => $order) {
        $orders[$key]['Items'] = $orderItems;
    }

    echo json_encode(
        array(
            'data' => $orders,
            'status' => true,
            'statusText' => "Lấy lịch sử đơn hàng thành công cho người dùng $id!",
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            'id' => null,
            'status' => false,
            'statusText' => "Lấy lịch sử đơn hàng không thành công cho người dùng $id! $e",
        )
    );
} catch (\Throwable $th) {
}
