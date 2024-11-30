<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data -> id;

    $query = "SELECT * FROM address WHERE OwnerID = '$id' AND Priority = 1 AND Status != 'Removed'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $adr = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(
        array(
            "data" => $adr,
            "status" => true,
            "statusText" => "Lấy địa chỉ chính thành công cho người dùng $id!",
        )
    );

} catch (Exception $e) {
    echo json_encode(
        array(
            "id" => null,
            "status" => false,
            "statusText" => "Lấy địa chỉ chính không thành công cho người dùng $id!",
            "error" => $e->getMessage(),
        )
    );
}
