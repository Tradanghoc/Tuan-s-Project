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

    $query = "SELECT foods.Id, foods.Name, foods.Description, foods.TimeMade,
    foods.FeatureItem, foods.Price, foods.Discount, foods.RestaurantID, restaurants.Status as RestaurantStatus, restaurants.Name 
    as RestaurantName, COUNT(DISTINCT reviews.`Id`) as ReviewCount, 
    COALESCE(ROUND(AVG(reviews.Point),1),0) as Rating,
    CASE WHEN COUNT(favlist.Id) > 0 THEN 1 ELSE 0 END as userFavorite,
    CASE WHEN COUNT(orders.`Id`) > 0 THEN 1 ELSE 0 END as hasUseService
    from foods 
    LEFT JOIN restaurants ON foods.RestaurantID = restaurants.Id 
    LEFT JOIN reviews ON foods.Id = reviews.TargetID AND reviews.Status = 'Active'
    LEFT JOIN favlist ON foods.Id = favlist.`TargetID` AND favlist.`UserID` = '$user'
    LEFT JOIN orderitems ON orderitems.`FoodID` = foods.`Id`
    AND orderitems.`Status` = 'Done'
    LEFT JOIN orders ON orders.UserID = '$user' 
    AND orders.Id = orderitems.OrderID
    WHERE foods.Id = '$id' AND foods.Status = 'Sale'
    GROUP BY foods.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $food = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get reviews of food

    $query = "SELECT reviews.*, images.Id as ImageID, users.Name as UserName,
    users.Rank as UserRank, users.Id as UserID
    FROM reviews
    LEFT JOIN images ON reviews.UserID = images.OwnerID
    LEFT JOIN users ON reviews.UserID = users.Id
    WHERE TargetID = '$id' AND reviews.Status = 'Active' AND UserID = '$user'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $opinion = $stmt->fetch(PDO::FETCH_ASSOC);
    $food['Opinion'] = $opinion;

    $query = "SELECT reviews.*, images.Id as ImageID, users.Name as UserName, 
    users.Rank as UserRank, users.Id as UserID
    FROM reviews 
    LEFT JOIN images ON reviews.UserID = images.OwnerID
    LEFT JOIN users ON reviews.UserID = users.Id
    WHERE TargetID = '$id' AND reviews.Status = 'Active' AND UserID != '$user'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $food['Reviews'] = $reviews;

    if ($food) {

        // Get images of food
        $queryDetail = "SELECT Id from images WHERE OwnerID = :id";
        $stmtDetail = $dbConn->prepare($queryDetail);
        $stmtDetail->bindParam(':id', $food['Id']);
        $stmtDetail->execute();
        $images = $stmtDetail->fetchAll(PDO::FETCH_ASSOC);
        
        $food['Images'] = array_map(function($image) {
            return $image['Id'];
        }, [...$images]);

        // Get images of restaurant
        $queryRes = "SELECT Id from images WHERE OwnerID = :id";
        $stmtRes = $dbConn->prepare($queryRes);
        $stmtRes->bindParam(':id', $food['RestaurantID']);
        $stmtRes->execute();
        $res = $stmtDetail->fetchAll(PDO::FETCH_ASSOC);
        $food['RestaurantImages'] = $res;

        // Get feature and other items of restaurant
        $queryFeature = "SELECT foods.Id, foods.Name, foods.Description, foods.TimeMade,
        foods.FeatureItem, foods.Price, foods.Discount, COUNT(favlist.Id) as userFavorite
        from foods LEFT JOIN favlist ON foods.Id = favlist.TargetID 
        AND favlist.UserID = '$user' AND favlist.TargetID = foods.Id
        WHERE foods.RestaurantID = :id 
        AND foods.Id != '$id' AND foods.FeatureItem = 1 AND foods.Status != 'Banned' 
        AND foods.Status != 'Cancel' GROUP BY foods.Id
        LIMIT 5";
        $stmtFeature = $dbConn->prepare($queryFeature);
        $stmtFeature->bindParam(':id', $food['RestaurantID']);
        $stmtFeature->execute();
        $feature = $stmtFeature->fetchAll(PDO::FETCH_ASSOC);
        $food['FeatureList'] = $feature;

        $queryOther = "SELECT foods.Id, foods.Name, foods.Description, foods.TimeMade,
        foods.FeatureItem, foods.Price, foods.Discount, COUNT(favlist.Id) as userFavorite
        from foods LEFT JOIN favlist ON foods.Id = favlist.TargetID 
        AND favlist.UserID = '$user' AND favlist.TargetID = foods.Id
        WHERE foods.RestaurantID = :id 
        AND foods.Id != '$id' AND foods.FeatureItem = 0 AND foods.Status != 'Banned' 
        AND foods.Status != 'Cancel' GROUP BY foods.Id
        LIMIT 5";
        $stmtOther = $dbConn->prepare($queryOther);
        $stmtOther->bindParam(':id', $food['RestaurantID']);
        $stmtOther->execute();
        $other = $stmtOther->fetchAll(PDO::FETCH_ASSOC);
        $food['OtherList'] = $other;

        // Get rate of feature and other items
        foreach ($feature as $key => $value) {
            $queryFeatureRate = "SELECT COUNT(Id) as ReviewCount, COALESCE(ROUND(AVG(Point),1),0) as Rating FROM reviews WHERE TargetID = :id";
            $stmtFeatureRate = $dbConn->prepare($queryFeatureRate);
            $stmtFeatureRate->bindParam(':id', $value['Id']);
            $stmtFeatureRate->execute();
            $rate = $stmtFeatureRate->fetch(PDO::FETCH_ASSOC);
            $food['FeatureList'][$key]['ReviewCount'] = $rate ? $rate['ReviewCount'] : 0;
            $food['FeatureList'][$key]['Ratinng'] = $rate ? $rate['Rating'] : 0;
        }

        foreach ($other as $key => $value) {
            $queryOtherRate = "SELECT COUNT(Id) as ReviewCount, COALESCE(ROUND(AVG(Point),1),0) as Rating FROM reviews WHERE TargetID = :id";
            $stmtOtherRate = $dbConn->prepare($queryOtherRate);
            $stmtOtherRate->bindParam(':id', $value['Id']);
            $stmtOtherRate->execute();
            $rate = $stmtOtherRate->fetch(PDO::FETCH_ASSOC);
            $food['OtherList'][$key]['ReviewCount'] = $rate ? $rate['ReviewCount'] : 0;
            $food['OtherList'][$key]['Rating'] = $rate ? $rate['Rating'] : 0;
        }

        // Get images of feature and other items
        foreach ($feature as $key => $value) {
            $queryFeatureImg = "SELECT Id from images WHERE OwnerID = :id";
            $stmtFeatureImg = $dbConn->prepare($queryFeatureImg);
            $stmtFeatureImg->bindParam(':id', $value['Id']);
            $stmtFeatureImg->execute();
            $images = $stmtFeatureImg->fetchAll(PDO::FETCH_ASSOC);
            $food['FeatureList'][$key]['Images'] = array_map(function($image) {
                return $image['Id'];
            }, $images);
        }

        foreach ($other as $key => $value) {
            $queryFeatureImg = "SELECT Id from images WHERE OwnerID = :id";
            $stmtFeatureImg = $dbConn->prepare($queryFeatureImg);
            $stmtFeatureImg->bindParam(':id', $value['Id']);
            $stmtFeatureImg->execute();
            $images = $stmtFeatureImg->fetchAll(PDO::FETCH_ASSOC);
            $food['OtherList'][$key]['Images'] = array_map(function($image) {
                return $image['Id'];
            }, $images);
        }


        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Lấy thông tin món ăn thành công!",
                "data" => $food,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Không có thông tin của món ăn $id trong hệ thống!",
                "data" => [],
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
