<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';
/*
SELECT foods.*, restaurants.Name as ResName
    FROM foods INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE foods.Status != 'Remove' AND foods.Status != 'Banned' 
    AND restaurants.Status != 'Remove' AND restaurants.Status != 'Banned'
*/

try {
    $query = "SELECT foods.*, restaurants.Name as ResName
    FROM foods
    INNER JOIN restaurants
    ON foods.RestaurantID = restaurants.Id AND restaurants.Status != 'Removed' AND restaurants.Status != 'Banned'
    WHERE foods.FeatureItem = 1 AND foods.Status != 'Banned' AND restaurants.Status != 'Removed'
    GROUP BY foods.Id limit 20";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($foods) {
        foreach ($foods as $key => $food) {
            $query = "SELECT Id as Image FROM images WHERE OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($query);
            $stmt->bindParam(':id', $food['Id']);
            $stmt->execute();
            $image = $stmt->fetch(PDO::FETCH_ASSOC);

            // Add the image to the food item
            $foods[$key]['Image'] = $image ? $image['Image'] : '';
        }

        foreach ($foods as $key => $food) {
            $queryReview = "SELECT COUNT(Id) as TotalReview, AVG(Point) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmtReview = $dbConn->prepare($queryReview);
            $stmtReview->bindParam(':id', $food['Id']);
            $stmtReview->execute();
            $review = $stmtReview->fetch(PDO::FETCH_ASSOC);
            $foods[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $foods[$key]['Point'] = $review ? $review['AverageRating'] : 0;}

        echo json_encode(
            array(
                "status" => true,
                "statusText" => `Lấy danh sách món ăn đặc biệt thành công!`,
                "data" => $foods,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Không có món ăn đặc biệt trong hệ thống!",
                "data" => [],
            ),
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Lấy danh sách món ăn đặc biệt thất bại bởi vì $e!",
            "data" => [],
        ),
    );
}
