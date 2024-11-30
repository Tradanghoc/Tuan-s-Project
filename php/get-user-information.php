<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Max-Age: 3600");
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
require_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $query = "SELECT users.*, COALESCE(images.Id,'') as Image,
    COALESCE(restaurants.Name, 'Không có nhà hàng') as RestaurantName
     FROM users 
    LEFT JOIN images ON users.id = images.OwnerID
    LEFT JOIN restaurants ON users.id = restaurants.OwnerID
    WHERE users.Id = :id";
    $stmt = $dbConn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT * FROM address WHERE OwnerID = :id AND Priority = 1 limit 1";
    $stmt = $dbConn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $address = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($address) {
        $result['Address'] = $address['Address'] . ', ' . $address['District'] . ', ' . $address['Ward'] . ', ' . $address['City'] . '.';
        $result['Phone'] = $address['Phone'];
    } else {
        $query = "SELECT * FROM address WHERE OwnerID = :id limit 1";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $address = $stmt->fetch(PDO::FETCH_ASSOC);

        if($address) {
            $result['Address'] = $address['Address'] . ', ' . $address['District'] . ', ' . $address['Ward'] . ', ' . $address['City'] . '.';
            $result['Phone'] = $address['Phone'];
        } else {
            $result['Address'] = 'Chưa cập nhật';
            $result['Phone'] = 'Chưa cập nhật';
        }
    }

    if ($result) {
        echo json_encode(array(
            "status" => true,
            "statusText" => "Lấy thông tin người dùng thành công",
            "data" => $result
        ));
    } else {
        echo json_encode(array(
            "status" => false,
            "statusText" => "Lấy thông tin người dùng thất bại",
            "data" => null
        ));
    }
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Lỗi: " . $e->getMessage(),
        "data" => null
    ));
}
