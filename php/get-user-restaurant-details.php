<?php 

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {

    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $query = "SELECT restaurants.Name, restaurants.Introduction, restaurants.Address, restaurants.City, restaurants.District, 
    restaurants.Ward, restaurants.Phone, restaurants.Email, 
    CONCAT(restaurants.Address,' ', restaurants.District, ' ', restaurants.Ward, ' ', restaurants.City) as Address,
    CAST(ROUND(COALESCE(AVG(reviews.Point), 0), 1) AS DECIMAL(2,1)) as Rating, 
    COUNT(orderitems.Id) AS Orders
    FROM restaurants
    LEFT JOIN reviews ON restaurants.Id = reviews.TargetID
    LEFT JOIN foods ON restaurants.Id = foods.RestaurantID
    LEFT JOIN orderitems ON foods.Id = orderitems.FoodID
    WHERE restaurants.Id = '$id' AND restaurants.Status = 'Open' GROUP BY restaurants.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT Id FROM images WHERE OwnerID = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $result['Images'] = $images;

    // Get reviews of restaurant

    $query = "SELECT reviews.*, images.Id as ImageID, users.Name as UserName, 
    users.Rank as UserRank, users.Id as UserID
    FROM reviews 
    LEFT JOIN images ON reviews.UserID = images.OwnerID
    LEFT JOIN users ON reviews.UserID = users.Id
    WHERE TargetID = '$id' AND reviews.Status = 'Active'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $result['Reviews'] = $reviews;

    $query = "SELECT Id, Name, Price, TimeMade, Discount, FeatureItem
    FROM foods WHERE RestaurantID = '$id' AND Status = 'Sale' OR Status = 'InActive'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $result['Foods'] = $foods;

    foreach ($foods as $key => $value) {
        $query = "SELECT Id FROM images WHERE OwnerID = '".$value['Id']."'";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $result['Foods'][$key]['Image'] = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($result) {
        echo json_encode(array(
            "statusText" => "Data found",
            "status" => true,
            "data" => $result
        ));
    } else {
        echo json_encode(array(
            "statusText" => "Data not found",
            "status" => false
        ));
    }
    
} catch (Exception $e) {
    echo json_encode(array(
        "statusText" => $e,
        "status" => false
    ));
}

?>