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
    $query = "SELECT notifications.*, images.Id as AdminImage, 
    admin.Name AS AdminName, coupons.Code AS CouponCode
    FROM notifications
    LEFT JOIN images ON notifications.Creator = images.OwnerID
    LEFT JOIN admin ON notifications.Creator = admin.Id
    LEFT JOIN coupons ON notifications.GiftID = coupons.Id
    WHERE TargetID = :user_id";
    $stmt = $dbConn->prepare($query);
    $stmt->bindParam(':user_id', $id);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(array(
            "status" => true,
            "data" => $result,
            "statusText"=> "Lấy thông báo thành công!"
        ));
    } else {
        echo json_encode(array(
            "status" => false,
            "data" => [],
            "statusText"=> "Không có thông báo nào!"
        ));
    }
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "data" => [],
        "statusText"=> "Lỗi: $e"
    ));
}
