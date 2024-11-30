<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT
    foods.Id,
    foods.Name as FoodName,
    foods.Price,
    restaurants.Name as RestaurantName,
    SUM(orderitems.Quantity) as Sold,
    COUNT(orderitems.Id) as Orders,
    SUM(orders.TotalValue) as Revenue
FROM foods
INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
INNER JOIN orderitems ON foods.Id = orderitems.FoodID
INNER JOIN orders ON orders.Id = orderitems.OrderID
WHERE orders.Status != 'Cancel' AND orders.Status != 'Denied'
GROUP BY foods.Id,restaurants.Name
ORDER BY Sold DESC ";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($res == null) {
        echo json_encode(
            array(
                "data" => [],
                "status" => false,
                "message" => "Can't find any orders",
            )
        );
    } else {
        echo json_encode(
            array(
                "data" => $res,
                "status" => true,
                "message" => "Success to get top selling items!",
            )
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "data" => [],
            "status" => false,
            "message" => "Fail to get top selling items because of $e!",
        )
    );
}
