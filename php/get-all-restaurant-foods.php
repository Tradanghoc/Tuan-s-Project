<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    try {
        $query = "SELECT foods.Id, foods.Name, foods.TimeMade, ROUND(COALESCE(AVG(reviews.Point),0), 1)
        AS Point, COUNT(reviews.Id) AS TotalReview, (SELECT Id FROM images WHERE OwnerID = foods.Id LIMIT 1) AS Image
        FROM foods
        LEFT JOIN reviews ON foods.Id = reviews.TargetID
        WHERE foods.RestaurantID = '$id' AND foods.Status != 'Banned'
        GROUP BY foods.Id
        ORDER BY foods.CreateAt Desc, foods.Name ASC";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Lấy danh sách món ăn thành công!",
                "data" => $foods,
            )
        );
    } catch (Exception $e) {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Lấy danh sách món ăn thất bại! $e",
                "data" => [],
            )
        );
    }