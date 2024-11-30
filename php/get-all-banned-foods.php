<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT foods.`Id` as FoodID, 
    foods.`Name`, foods.Price, restaurants.`Name` as ResName
    from foods
    INNER JOIN restaurants ON foods.`RestaurantID` = restaurants.`Id`
    WHERE foods.`Status` = 'Banned'
    LIMIT 100";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($res == null) {
        if (count($res) == 0) {
            echo json_encode(
                array(
                    "data" => $res,
                    "status" => false,
                    "message" => "Don't have banned foods",
                )
            );
            return;
        }
    } else {
        foreach ($res as $key => $food) {
            $query = "SELECT Id as Image FROM images WHERE OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($query);
            $stmt->bindParam(':id', $food['FoodID']);
            $stmt->execute();
            $image = $stmt->fetch(PDO::FETCH_ASSOC);

            // Add the image to the food item
            $res[$key]['Image'] = $image ? $image['Image'] : '';
        }
        echo json_encode(
            array(
                "data" => $res,
                "status" => true,
                "message" => "Success to get banned foods!",
            )
        );
    }
} catch (\Throwable $th) {
}
