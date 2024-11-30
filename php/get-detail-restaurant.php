<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $user = $data->user;

    $query = "SELECT restaurants.Id, restaurants.Name, restaurants.Introduction, restaurants.Status, 
    restaurants.Address, restaurants.City, restaurants.District, restaurants.Ward,  restaurants.Phone, restaurants.Email, COUNT(DISTINCT reviews.`Id`) as ReviewCount,
    COALESCE(ROUND(AVG(reviews.Point),1),0) as Rating,
    CASE WHEN COUNT(favlist.Id) > 0 THEN 1 ELSE 0 END as userFavorite,
    CASE WHEN COUNT(orders.`Id`) > 0 THEN 1 ELSE 0 END as hasUseService
    FROM restaurants
    LEFT JOIN reviews ON restaurants.Id = reviews.TargetID 
    LEFT JOIN favlist ON restaurants.Id = favlist.`TargetID` AND favlist.`UserID` = '$user'
    LEFT JOIN orderitems ON orderitems.`FoodID` = restaurants.`Id`
    LEFT JOIN orders ON orders.UserID = '$user' 
    AND orders.Id = orderitems.OrderID AND orders.`Status` != 'Denied'
    AND orders.`Status` != 'Cancel'
    WHERE restaurants.Id = '$id'
    GROUP BY restaurants.Id LIMIT 100";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $restaurant = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($restaurant) {

        $queryDetail = "SELECT Id from images WHERE OwnerID = :id";
        $stmtDetail = $dbConn->prepare($queryDetail);
        $stmtDetail->bindParam(':id', $restaurant['Id']);
        $stmtDetail->execute();
        $images = $stmtDetail->fetchAll(PDO::FETCH_ASSOC);
        $restaurant['Images'] = array_map(function($image) {
            return $image['Id'];
        }, $images);


        // Get feature and other items of restaurant
        $queryFeature = "SELECT foods.Id, foods.Name, foods.Description, foods.TimeMade,
        foods.FeatureItem, foods.Price, foods.Discount, COUNT(favlist.Id) as userFavorite
        from foods LEFT JOIN favlist ON foods.Id = favlist.TargetID 
        AND favlist.UserID = '$user' AND favlist.TargetID = foods.Id
        WHERE foods.RestaurantID = :id 
        AND foods.Id != '$id' AND foods.FeatureItem = 1 AND foods.Status = 'Sale' 
        GROUP BY foods.Id
        LIMIT 5";
        $stmtFeature = $dbConn->prepare($queryFeature);
        $stmtFeature->bindParam(':id', $restaurant['Id']);
        $stmtFeature->execute();
        $feature = $stmtFeature->fetchAll(PDO::FETCH_ASSOC);
        $restaurant['FeatureList'] = $feature;

        $queryOther = "SELECT foods.Id, foods.Name, foods.Description, foods.TimeMade,
        foods.FeatureItem, foods.Price, foods.Discount, COUNT(favlist.Id) as userFavorite
        from foods LEFT JOIN favlist ON foods.Id = favlist.TargetID 
        AND favlist.UserID = '$user' AND favlist.TargetID = foods.Id
        WHERE foods.RestaurantID = :id 
        AND foods.Id != '$id' AND foods.FeatureItem = 0 AND foods.Status = 'Sale' 
        GROUP BY foods.Id
        LIMIT 5";
        $stmtOther = $dbConn->prepare($queryOther);
        $stmtOther->bindParam(':id', $restaurant['Id']);
        $stmtOther->execute();
        $other = $stmtOther->fetchAll(PDO::FETCH_ASSOC);
        $restaurant['OtherList'] = $other;

        // Get rate of feature and other items
        foreach ($feature as $key => $value) {
            $queryFeatureRate = "SELECT COUNT(Id) as ReviewCount, COALESCE(ROUND(AVG(Point),1),0) as Rating FROM reviews WHERE TargetID = :id";
            $stmtFeatureRate = $dbConn->prepare($queryFeatureRate);
            $stmtFeatureRate->bindParam(':id', $value['Id']);
            $stmtFeatureRate->execute();
            $rate = $stmtFeatureRate->fetch(PDO::FETCH_ASSOC);
            $restaurant['FeatureList'][$key]['ReviewCount'] = $rate ? $rate['ReviewCount'] : 0;
            $restaurant['FeatureList'][$key]['Ratinng'] = $rate ? $rate['Rating'] : 0;
        }

        foreach ($other as $key => $value) {
            $queryOtherRate = "SELECT COUNT(Id) as ReviewCount, COALESCE(ROUND(AVG(Point),1),0) as Rating FROM reviews WHERE TargetID = :id";
            $stmtOtherRate = $dbConn->prepare($queryOtherRate);
            $stmtOtherRate->bindParam(':id', $value['Id']);
            $stmtOtherRate->execute();
            $rate = $stmtOtherRate->fetch(PDO::FETCH_ASSOC);
            $restaurant['OtherList'][$key]['ReviewCount'] = $rate ? $rate['ReviewCount'] : 0;
            $restaurant['OtherList'][$key]['Rating'] = $rate ? $rate['Rating'] : 0;
        }

        // Get images of feature and other items
        foreach ($feature as $key => $value) {
            $queryFeatureImg = "SELECT Id from images WHERE OwnerID = :id";
            $stmtFeatureImg = $dbConn->prepare($queryFeatureImg);
            $stmtFeatureImg->bindParam(':id', $value['Id']);
            $stmtFeatureImg->execute();
            $images = $stmtFeatureImg->fetchAll(PDO::FETCH_ASSOC);
            $restaurant['FeatureList'][$key]['Images'] = array_map(function($image) {
        return $image['Id'];
    }, $images);
        }

        foreach ($other as $key => $value) {
            $queryFeatureImg = "SELECT Id from images WHERE OwnerID = :id";
            $stmtFeatureImg = $dbConn->prepare($queryFeatureImg);
            $stmtFeatureImg->bindParam(':id', $value['Id']);
            $stmtFeatureImg->execute();
            $images = $stmtFeatureImg->fetchAll(PDO::FETCH_ASSOC);
            $restaurant['OtherList'][$key]['Images'] = array_map(function($image) {
        return $image['Id'];
    }, $images);
        }


        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Lấy thông tin món ăn thành công!",
                "data" => $restaurant,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Không có thông tin của món ăn $id trong hệ thống!",
                "data" => $restaurant,
            ),
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Lấy thông tin của $id thất bại bởi vì $e!",
            "data" => [],
        ),
    );
}
