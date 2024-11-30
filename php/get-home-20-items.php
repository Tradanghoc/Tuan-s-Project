<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $home = array();
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $query = "SELECT foods.Id, foods.TimeMade, foods.Price, foods.Name, foods.FeatureItem, 
    foods.Discount, COUNT(favlist.Id) as UserFavorite FROM foods LEFT JOIN favlist
    ON foods.Id = favlist.TargetID AND favlist.UserID = '$id'
    WHERE foods.FeatureItem = 1 AND foods.Status = 'Sale'
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
            $queryReview = "SELECT COUNT(Id) as TotalReview, ROUND(AVG(Point),1) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmtReview = $dbConn->prepare($queryReview);
            $stmtReview->bindParam(':id', $food['Id']);
            $stmtReview->execute();
            $review = $stmtReview->fetch(PDO::FETCH_ASSOC);
            $foods[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $foods[$key]['Point'] = $review ? $review['AverageRating'] : 0;
        }

        $home['featureArray'] = $foods;

    } else {
        $home['featureArray'] = [];
    }

    $query = "SELECT foods.*, COUNT(favlist.Id) as UserFavorite  
    FROM foods 
    LEFT JOIN favlist ON foods.Id = favlist.TargetID AND favlist.UserID = '$id'
    WHERE foods.Status = 'Sale' 
    GROUP BY foods.Id 
    ORDER BY CreateAt DESC, TimeMade DESC 
    LIMIT 20";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($foods) {
        foreach($foods as $key => $food) {
        $queryImage = "SELECT Id as Image FROM images WHERE images.OwnerID = :id LIMIT 1";
        $stmt = $dbConn->prepare($queryImage);
        $stmt->bindParam(':id', $food['Id']);
        $stmt->execute();
        $image = $stmt->fetch(PDO::FETCH_ASSOC);

        $foods[$key]['Image'] = $image ? $image['Image'] : '';
        }

        foreach ($foods as $key => $food) {
            $queryReview = "SELECT COUNT(Id) as TotalReview, ROUND(AVG(Point),1) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmtReview = $dbConn->prepare($queryReview);
            $stmtReview->bindParam(':id', $food['Id']);
            $stmtReview->execute();
            $review = $stmtReview->fetch(PDO::FETCH_ASSOC);
            $foods[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $foods[$key]['Point'] = $review ? $review['AverageRating'] : 0;}

        $home['newItemsArray'] = $foods;
    } else {
        $home['newItemsArray'] = [];
    }

    $query = "SELECT foods.*, SUM(orderitems.Quantity) as Sold, COUNT(favlist.Id) as UserFavorite
    FROM foods 
    INNER JOIN orderitems ON foods.Id = orderitems.FoodID AND orderitems.Status = 'Done'
    LEFT JOIN favlist ON foods.Id = favlist.TargetID AND favlist.UserID = '$id'
    WHERE foods.Status = 'Sale' 
    GROUP BY foods.Id 
    ORDER BY Sold DESC, TimeMade DESC, Price ASC 
    LIMIT 20";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($foods) {
        foreach($foods as $key => $food) {
        $queryImage = "SELECT Id as Image FROM images WHERE images.OwnerID = :id LIMIT 1";
        $stmt = $dbConn->prepare($queryImage);
        $stmt->bindParam(':id', $food['Id']);
        $stmt->execute();
        $image = $stmt->fetch(PDO::FETCH_ASSOC);

        $foods[$key]['Image'] = $image ? $image['Image'] : '';
        }

        foreach ($foods as $key => $food) {
            $queryReview = "SELECT COUNT(Id) as TotalReview, ROUND(AVG(Point),1) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmtReview = $dbConn->prepare($queryReview);
            $stmtReview->bindParam(':id', $food['Id']);
            $stmtReview->execute();
            $review = $stmtReview->fetch(PDO::FETCH_ASSOC);
            $foods[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $foods[$key]['Point'] = $review ? $review['AverageRating'] : 0;}

        $home['popularItemsArray'] = $foods;
    } else {
        $home['popularItemsArray'] = [];
    }

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
    ,restaurants.ownerID
    ,COALESCE(SUM(orderitems.Quantity),0) as Sold
    ,(CASE WHEN favlist.Id IS NULL THEN 0 ELSE 1 END) AS UserFavorite 
    FROM restaurants    
    LEFT JOIN foods ON restaurants.Id = foods.RestaurantId
    LEFT JOIN orderitems ON foods.Id = orderitems.FoodId
    LEFT JOIN favlist ON restaurants.Id = favlist.TargetID AND favlist.UserID = '$id'
    WHERE foods.Status != 'Banned' AND foods.Status != 'Removed' AND restaurants.Status != 'Banned' 
    AND restaurants.Status != 'Removed' GROUP BY restaurants.Id, favlist.Id ORDER BY Sold DESC LIMIT 20";
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

        foreach($restaurants as $key => $restaurant) {
            $resQuery = "SELECT COUNT(Id) as TotalReview, ROUND(AVG(Point),1) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmt = $dbConn->prepare($resQuery);
            $stmt->bindParam(':id', $restaurant['Id']);
            $stmt->execute();
            $review = $stmt->fetch(PDO::FETCH_ASSOC);
            $restaurants[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $restaurants[$key]['Point'] = $review ? $review['AverageRating'] : 0;
        }
        $home['restaurantsArray'] = $restaurants;
    } else {
        $home['restaurantsArray'] = [];
    }

    echo json_encode(
        array(
            "status" => true,
            "statusText" => "Lấy danh sách món ăn thành công!",
            "data" => $home,
        ),
    );

} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Không thể lấy danh sách món ăn $e!",
            "data" => [],
        ),
    );
}


 ?>