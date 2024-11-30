<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $result = array();

    $query = "SELECT schedules.*, foods.Name, foods.Price, foods.Discount, 
    ROUND(COALESCE(AVG(reviews.Point), 0), 1) as Rate,
    restaurants.Name as RestaurantName, restaurants.Id as RestaurantID, images.Id as FoodImage
    FROM schedules 
    INNER JOIN foods ON schedules.FoodID = foods.Id AND foods.Status = 'Sale'
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id AND restaurants.Status = 'Open'
    LEFT JOIN images ON foods.Id = images.OwnerID
    LEFT JOIN reviews ON foods.Id = reviews.TargetID
    WHERE schedules.UserID = '$id' AND schedules.Interval = 'Breakfast' 
    GROUP BY schedules.Id, schedules.UserID, schedules.FoodID, schedules.Interval, images.Id";



    $stmt = $dbConn->query($query);
    $stmt->execute();
    $breakfast = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($breakfast) {
        foreach ($breakfast as $key => $value) {
            $query = "SELECT Id FROM images WHERE OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($query);
            $stmt->bindParam(':id', $value['RestaurantID']);
            $stmt->execute();
            $imageResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $breakfast[$key]['RestaurantImageID'] = $imageResult ? $imageResult['Id'] : null;
        }
    }

    $query = "SELECT schedules.*, foods.Name, foods.Price, foods.Discount, 
    ROUND(COALESCE(AVG(reviews.Point), 0), 2) as Rate,
    restaurants.Name as RestaurantName, restaurants.Id as RestaurantID, images.Id as FoodImage
    FROM schedules     
    INNER JOIN foods ON schedules.FoodID = foods.Id AND foods.Status = 'Sale'
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id AND restaurants.Status = 'Open'
    LEFT JOIN images ON foods.Id = images.OwnerID
    LEFT JOIN reviews ON foods.Id = reviews.TargetID
    WHERE schedules.UserID = '$id' AND schedules.Interval = 'Lunch'
    GROUP BY schedules.Id, schedules.UserID, schedules.FoodID, schedules.Interval, images.Id";

    $stmt = $dbConn->query($query);
    $stmt->execute();
    $lunch = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($lunch) {
        foreach ($lunch as $key => $value) {
            $query = "SELECT Id FROM images WHERE OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($query);
            $stmt->bindParam(':id', $value['RestaurantID']);
            $stmt->execute();
            $imageResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $lunch[$key]['RestaurantImageID'] = $imageResult ? $imageResult['Id'] : null;
        }
    }

    $query = "SELECT schedules.*, foods.Name, foods.Price, foods.Discount, 
    ROUND(COALESCE(AVG(reviews.Point), 0), 2) as Rate,
    restaurants.Name as RestaurantName, restaurants.Id as RestaurantID, images.Id as FoodImage
    FROM schedules 
    INNER JOIN foods ON schedules.FoodID = foods.Id AND foods.Status = 'Sale'
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id AND restaurants.Status = 'Open'
    LEFT JOIN images ON foods.Id = images.OwnerID
    LEFT JOIN reviews ON foods.Id = reviews.TargetID
    WHERE schedules.UserID = '$id' AND schedules.Interval = 'Dinner'
    GROUP BY schedules.Id, schedules.UserID, schedules.FoodID, schedules.Interval, images.Id";

    $stmt = $dbConn->query($query);
    $stmt->execute();
    $dinner = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($dinner) {
        foreach ($dinner as $key => $value) {
            $query = "SELECT Id FROM images WHERE OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($query);
            $stmt->bindParam(':id', $value['RestaurantID']);
            $stmt->execute();
            $imageResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $dinner[$key]['RestaurantImageID'] = $imageResult ? $imageResult['Id'] : null;
        }
    }

    $query = "SELECT schedules.*, foods.Name, foods.Price, foods.Discount, 
    ROUND(COALESCE(AVG(reviews.Point), 0), 2) as Rate,
    restaurants.Name as RestaurantName, restaurants.Id as RestaurantID, images.Id as FoodImage
    FROM schedules 
    INNER JOIN foods ON schedules.FoodID = foods.Id AND foods.Status = 'Sale'
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id AND restaurants.Status = 'Open'
    LEFT JOIN images ON foods.Id = images.OwnerID
    LEFT JOIN reviews ON foods.Id = reviews.TargetID
    WHERE schedules.UserID = '$id' AND schedules.Interval = 'Snack'
    GROUP BY schedules.Id, schedules.UserID, schedules.FoodID, schedules.Interval, images.Id";

    $stmt = $dbConn->query($query);
    $stmt->execute();
    $snack = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($snack) {
        foreach ($snack as $key => $value) {
            $query = "SELECT Id FROM images WHERE OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($query);
            $stmt->bindParam(':id', $value['RestaurantID']);
            $stmt->execute();
            $imageResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $snack[$key]['RestaurantImageID'] = $imageResult ? $imageResult['Id'] : null;
        }
    }

    $result['Breakfast'] = $breakfast;
    $result['Lunch'] = $lunch;
    $result['Dinner'] = $dinner;
    $result['Snack'] = $snack;

    echo json_encode(array(
        "status" => true,
        "statusText" => "Lấy lịch trình mua hàng thành công",
        "data" => $result
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Không tìm thấy lịch trình mua hàng bởi vì $e",
        "data" => []
    ));
}
