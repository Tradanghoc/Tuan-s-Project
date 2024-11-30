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
    restaurants.Name as RestaurantName,
    orderitems.Quantity,
    orders.CreateAt,
    orders.UpdateAt,
    orders.Status,
    orders.TotalValue
    FROM foods
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    INNER JOIN orderitems ON foods.Id = orderitems.FoodID
    INNER JOIN orders ON orders.Id = orderitems.OrderID
    WHERE orders.Status != 'Cancel' AND orders.Status != 'Denied'
    ORDER BY orders.CreateAt ASC,
    orders.UpdateAt ASC";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($res == null) {
        echo json_encode(
            array(
                "data" => [],
                "status" => false,
                "message" => "Can't find any orders",
            ),
        );
    } else {
        echo json_encode(
            array(
                "data" => $res,
                "status" => true,
                "message" => "Success to get recent selling items!",
            )
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "data" => [],
            "status" => false,
            "message" => "Fail to get recent selling items because of $e!",
        ),
    );
}
