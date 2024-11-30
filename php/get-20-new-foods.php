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

    $query = "SELECT foods.*, SUM(orderitems.Quantity) as Sold, COUNT(favlist.Id) as UserFavorite  
    FROM foods 
    INNER JOIN orderitems ON foods.Id = orderitems.FoodID 
    LEFT JOIN favlist ON foods.Id = favlist.TargetID AND favlist.UserID = '$id'
    WHERE foods.Status = 'Sale' 
    GROUP BY foods.Id 
    ORDER BY CreateAt DESC, Sold DESC, TimeMade DESC 
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
                "statusText" => `Lấy danh sách món ăn mới thành công!`,
                "data" => $foods,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Không có món ăn mới trong hệ thống!",
                "data" => [],
            )
        );
    }
} catch ( Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Lấy danh sách món ăn mới thất bại bởi vì $e!",
            "data" => [],
        )
    );
}
?>
