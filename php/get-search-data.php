<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

$data = json_decode(file_get_contents("php://input"));
$result = array();
try {
    $keyword = $data->keyword;
    $userID = $data->userID;

    $query = "SELECT foods.*, ROUND(COALESCE(AVG(reviews.Point),0),1) AS Rate,
    Count(reviews.Id) AS TotalReview,
    (SELECT Id FROM images WHERE OwnerID = foods.Id LIMIT 1) AS Image,
    CASE WHEN favlist.TargetID IS NOT NULL THEN 1
    ELSE 0 END AS IsFav
    FROM foods
    LEFT JOIN reviews ON foods.Id = reviews.TargetId
    INNER JOIN restaurants ON foods.RestaurantId = restaurants.Id
    LEFT JOIN favlist ON foods.Id = favlist.TargetID AND favlist.UserId = '$userID'
    WHERE foods.Name COLLATE utf8mb4_general_ci LIKE '%$keyword%'
    OR foods.Description COLLATE utf8mb4_general_ci LIKE '%$keyword%' OR foods.Price LIKE '%$keyword%'
    OR foods.Discount LIKE '%$keyword%'
    OR restaurants.Name COLLATE utf8mb4_general_ci LIKE '%$keyword%' OR restaurants.Address COLLATE utf8mb4_general_ci LIKE '%$keyword%'
    OR restaurants.Email LIKE '%$keyword%' OR restaurants.City COLLATE utf8mb4_general_ci LIKE '%$keyword%'
    OR restaurants.District COLLATE utf8mb4_general_ci LIKE '%$keyword%' OR restaurants.Ward COLLATE utf8mb4_general_ci LIKE '%$keyword%'
    GROUP BY foods.Id";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result['Foods'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $query = "SELECT restaurants.Id,  restaurants.Name, restaurants.Introduction, 
    ROUND(COALESCE(AVG(reviews.Point),0),1) AS Rate,
    Count(reviews.Id) AS TotalReview,
    CASE WHEN favlist.TargetID IS NOT NULL THEN 1
    ELSE 0 END AS IsFav,
    (SELECT Id FROM images WHERE OwnerID = restaurants.Id LIMIT 1) AS Image
    FROM restaurants
    LEFT JOIN reviews ON restaurants.Id = reviews.TargetId
    LEFT JOIN favlist ON restaurants.Id = favlist.TargetID AND favlist.UserId = '$userID'
    WHERE restaurants.Name LIKE '%$keyword%'
    OR restaurants.Address LIKE '%$keyword%' OR restaurants.Email LIKE '%$keyword%'
    OR restaurants.City LIKE '%$keyword%' OR restaurants.District LIKE '%$keyword%'
    OR restaurants.Ward LIKE '%$keyword%'
    GROUP BY restaurants.Id";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result['Restaurants'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array(
        "status" => true,
        "data" => $result,
        "statusText" => "Tìm thấy dữ liệu người dùng yêu cầu"
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "data" => $result,
        "statusText" => "Không tìm thấy dữ liệu người dùng yêu cầu! $e"
    ));
}
