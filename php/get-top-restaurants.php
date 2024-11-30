<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT 
    restaurants.Id
    ,restaurants.Name
    ,restaurants.Introduction
    ,restaurants.Address
    ,restaurants.City
    ,restaurants.Ward
    ,restaurants.District
    ,restaurants.Phone
    ,restaurants.Email
    ,restaurants.Status
    ,restaurants.ownerID,
     SUM(orderitems.Quantity) as Sold FROM restaurants 
    INNER JOIN foods ON restaurants.Id = foods.RestaurantId
    INNER JOIN orderitems ON foods.Id = orderitems.FoodId
    WHERE foods.Status != 'Banned' AND foods.Status != 'Removed' AND restaurants.Status != 'Banned' 
    AND restaurants.Status != 'Removed' GROUP BY restaurants.Id ORDER BY Sold DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $restaurants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($restaurants) {
        foreach ($restaurants as $key => $restauran){
            $resQuery = "SELECT Id as Image FROM images WHERE images.OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($resQuery);
            $stmt->bindParam(':id', $restauran['Id']);
            $stmt->execute();
            $image = $stmt->fetch(PDO::FETCH_ASSOC);
            $restaurants[$key]['Image'] = $image ? $image['Image'] : '';
        }

        foreach ($restaurants as $key => $restaurant) {
            $queryReview = "SELECT COUNT(Id) as TotalReview, AVG(Point) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmtReview = $dbConn->prepare($queryReview);
            $stmtReview->bindParam(':id', $restaurant['Id']);
            $stmtReview->execute();
            $review = $stmtReview->fetch(PDO::FETCH_ASSOC);
            $restaurants[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $restaurants[$key]['Point'] = $review ? $review['AverageRating'] : 0;
        }

        foreach ($restaurants as $key => $restaurant) {
            $queryFoods = "SELECT foods.Id from foods WHERE RestaurantID = :id";
            $stmtFoods = $dbConn->prepare($queryFoods);
            $stmtFoods->bindParam(':id', $restaurant['Id']);
            $stmtFoods->execute();
            $foods = $stmtFoods->fetchAll(PDO::FETCH_ASSOC);
            $restaurants[$key]['Foods'] = $foods ? $foods : [];
        }
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Lấy danh sách nhà hàng thành công!",
                "data" => $restaurants,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Không có nhà hàng trong hệ thống!",
                "data" => [],
            ),
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Lấy danh sách nhà hàng thất bại bởi vì $e!",
            "data" => [],
        ),
    );
}
