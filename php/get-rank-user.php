<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
require_once 'connection.php';

try {

    $query = "SELECT users.`Id`, users.`Name`, users.`Rank`, images.Id as Image FROM users 
    LEFT JOIN images ON users.`Id` = images.`OwnerID` 
    ORDER BY `Rank` DESC, `CreateAt` ASC LIMIT 100";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(array(
        "status" => true,
        "statusText" => "Lấy danh sách người dùng thành công!",
        "data" => $users
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "statusText" => "Lấy danh sách người dùng không thành công bởi vì $e!"
    ));
}

?>