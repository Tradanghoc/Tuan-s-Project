<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Max-Age: 3600');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $resID = $data->resID;
    $query = "SELECT orderitems.*, foods.Name AS FoodName, users.Id AS UserID, 
    users.Name AS UserName, users.Rank AS UserRank, orders.CreateAt,
    (SELECT `Id` FROM images WHERE images.OwnerID = foods.Id LIMIT 1) AS FoodImageID,
    (SELECT `Id` FROM images WHERE images.OwnerID = orders.`UserID` LIMIT 1) AS UserImage
    FROM orderitems 
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN orders ON orderitems.OrderID = orders.Id
    INNER JOIN users ON orders.UserID = users.Id
    WHERE foods.RestaurantID ='$resID' AND orders.Status != 'Waiting'";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(array(
            "status" => true,
            "statusText" => "Lấy đơn hàng thành công.",
            "data" => $result,

        ));
    } else {
        echo json_encode(array(
            "status" => true,
            "statusText" => "Không tìm thấy đơn hàng.",
            "data" => []
        ));
    }
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Không tìm được đơn hàng vì $e.",
        "data" => []

    ));
}
