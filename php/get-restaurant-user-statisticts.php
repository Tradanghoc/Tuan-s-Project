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
    $result = array();
    $query = "SELECT COUNT(orderitems.Id) AS TotalOrders, 
    (SELECT COUNT(Id) FROM orderitems WHERE orderitems.Status = 'Canceled' 
    OR orderitems.Status = 'Denied') AS CancelOrders,
    (SELECT COUNT(Id) FROM orderitems WHERE orderitems.Status = 'Done') 
    AS CompletedOrders,
    (SELECT COUNT(Id) FROM orderitems WHERE orderitems.Status = 'Canceled' 
    AND orderitems.Status = 'Denied' AND orderitems.Status != 'Done') AS
    PendingOrders 
    FROM orderitems 
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id'";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['OrderStatistic'] = $row;

    $query = "SELECT foods.Name, SUM(Quantity) AS TotalQuantity
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id'
    GROUP BY FoodID
    ORDER BY TotalQuantity DESC
    LIMIT 1";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['BestSeller'] = $row;

    $totalQuery = "SELECT SUM(Quantity) AS TotalSell
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id'";
    $stmt = $dbConn->prepare($totalQuery);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['TotalSell'] = $row['TotalSell'];

    // Get revenue on month

    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id' AND MONTH(ArriveAt) = MONTH(CURDATE())
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['MonthRevenue'] = $row ? $row['TotalRevenue']: 0;

    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id' AND MONTH(ArriveAt) = MONTH(CURDATE()) - 1
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['PreMonthRevenue'] = $row ? $row['TotalRevenue']: 0;

    // Get revenue on year


    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id' AND YEAR(ArriveAt) = YEAR(CURDATE())
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['YearRevenue'] = $row ? $row['TotalRevenue']: 0;

    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE restaurants.Id = '$id' AND YEAR(ArriveAt) = YEAR(CURDATE()) - 1
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['PreYearRevenue'] = $row ? $row['TotalRevenue']: 0;

    echo json_encode(array(
        "message" => "Lấy dữ liệu thành công",
        "status" => true,
        "data" => $result
    ));

} catch (Exception $e) {
    echo json_encode(array(
        "message" => "Lấy dữ liệu thất bại $e",
        "status" => false
    ));
}
