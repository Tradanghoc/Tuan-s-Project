<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents('php://input'));
    $id = $data->id;

    $query = "SELECT orderitems.*, orders.UserID, orders.PaymentMethod,
    foods.Name AS FoodName, restaurants.Name AS RestaurantName, restaurants.Id AS RestaurantID
    FROM orderitems 
    INNER JOIN orders ON orderitems.OrderID = orders.Id
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    INNER JOIN restaurants ON foods.RestaurantID = restaurants.Id
    WHERE orders.UserID = '$id' AND orders.Status = 'Done'
    AND orderitems.Status != 'Canceled' AND orderitems.Status != 'Done' 
    OR orderitems.Status = 'Denied'
    ORDER BY orders.CreateAt DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($orders as $key => $value) {
        $query = "SELECT Id from images WHERE OwnerID = :id";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(':id', $orders[0]['RestaurantID']);
        $stmt->execute();
        $image = $stmt->fetchColumn();

        if ($image !== false) {
            $orders[$key]['ResImage'] = $image;
        } else {
            $orders[$key]['ResImage'] = null; // or some default value
        }

        $query = "SELECT COALESCE(CAST(AVG(Point) AS DECIMAL(3,1)), 0) AS Rating FROM reviews WHERE TargetID = :id";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(':id', $orders[0]['RestaurantID']);
        $stmt->execute();
        $point = $stmt->fetchColumn();


        $orders[$key]['ResRating'] = $point;
    }

    foreach ($orders as $key => $value) {
        $query = "SELECT Id from images WHERE OwnerID = :id";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(':id', $orders[0]['FoodID']);
        $stmt->execute();
        $image = $stmt->fetchColumn();

        if ($image !== false) {
            $orders[$key]['FoodImage'] = $image;
        } else {
            $orders[$key]['FoodImage'] = null; // or some default value
        }

        $query = "SELECT COALESCE(CAST(AVG(Point) AS DECIMAL(3,1)), 0) AS Rating FROM reviews WHERE TargetID = :id";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(':id', $orders[0]['FoodID']);
        $stmt->execute();
        $point = $stmt->fetchColumn();
        $orders[$key]['FoodRating'] = $point;
    }


    echo json_encode(
        array(
            'data' => $orders,
            'status' => true,
            'statusText' => "Lấy lịch sử đơn hàng thành công cho người dùng $id!",
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            'id' => null,
            'status' => false,
            'statusText' => "Lấy lịch sử đơn hàng không thành công cho người dùng $id!",
            'error' => $e->getMessage(),
        )
    );
} catch (\Throwable $th) {
}
