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

    $query = "SELECT restaurants.Id, restaurants.Name, restaurants.Introduction, 
    restaurants.OwnerID FROM restaurants INNER JOIN favlist ON 
    restaurants.Id = favlist.TargetID WHERE favlist.UserID =  '$id' 
    AND restaurants.Status != 'Sale' AND restaurants.Status != 'Removed'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($res) {

        foreach ($res as $key => $ress) {
            $queryImage = "SELECT Id as Image FROM images WHERE images.OwnerID = :id LIMIT 1";
            $stmt = $dbConn->prepare($queryImage);
            $stmt->bindParam(':id', $ress['Id']);
            $stmt->execute();
            $image = $stmt->fetch(PDO::FETCH_ASSOC);

            $res[$key]['Image'] = $image ? $image['Image'] : '';
        }

        foreach ($res as $key => $ress) {
            $queryReview = "SELECT COUNT(Id) as TotalReview, AVG(Point) as AverageRating FROM reviews WHERE TargetID = :id";
            $stmtReview = $dbConn->prepare($queryReview);
            $stmtReview->bindParam(':id', $ress['Id']);
            $stmtReview->execute();
            $review = $stmtReview->fetch(PDO::FETCH_ASSOC);
            $res[$key]['TotalReview'] = $review ? $review['TotalReview'] : 0;
            $res[$key]['Point'] = $review ? $review['AverageRating'] : 0;}
        
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Lấy danh sách nhà hàng thành công!",
                "data" => $res,
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
