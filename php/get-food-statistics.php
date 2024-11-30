<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $result = array();

    $query = "SELECT *
    FROM foods WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result['Infor'] = $stmt->fetch(PDO::FETCH_ASSOC);
    $resID = $result['Infor']['RestaurantID'];

    $query = "SELECT Id FROM images WHERE OwnerID = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $image = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $imageIds = array_map(function($item) {
        return $item['Id'];
    }, $image);
    $result['Infor']['Image'] = $imageIds;

    $query = "SELECT COUNT(orderitems.Id) AS TotalOrders, 
    (SELECT COUNT(Id) FROM orderitems WHERE orderitems.Status = 'Canceled' 
    OR orderitems.Status = 'Denied') AS CancelOrders,
    (SELECT COUNT(Id) FROM orderitems WHERE orderitems.Status = 'Done') 
    AS CompletedOrders,
    (SELECT COUNT(Id) FROM orderitems WHERE orderitems.Status != 'Canceled' 
    AND orderitems.Status != 'Denied' AND orderitems.Status != 'Done') AS
    PendingOrders 
    FROM orderitems 
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    WHERE orderitems.FoodID = '$id'";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['OrderStatistic'] = $row;

    // Get revenue on month

    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    WHERE foods.Id = '$id' AND MONTH(ArriveAt) = MONTH(CURDATE())
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['MonthRevenue'] = $row ? $row['TotalRevenue']: 0;

    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    WHERE foods.Id = '$id' AND MONTH(ArriveAt) = MONTH(CURDATE()) - 1
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['PreMonthRevenue'] = $row ? $row['TotalRevenue']: 0;

    // Get revenue on year


    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    WHERE foods.Id = '$id' AND YEAR(ArriveAt) = YEAR(CURDATE())
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['YearRevenue'] = $row ? $row['TotalRevenue']: 0;

    $query = "SELECT SUM(`Value`) AS TotalRevenue 
    FROM orderitems
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    WHERE foods.Id = '$id' AND YEAR(ArriveAt) = YEAR(CURDATE()) - 1
    GROUP BY orderitems.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $result['PreYearRevenue'] = $row ? $row['TotalRevenue']: 0;

    echo json_encode(array(
        "status" => true,
        "statusText" => "Lấy dữ liệu thành công!",
        "data" => $result
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Lấy dữ liệu thất bại! $e"
    ));
}
