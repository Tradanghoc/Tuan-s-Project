<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $userID = $data->userID;
    $phone = $data->phone;
    $address = $data->address;
    $city = $data->city;
    $district = $data->district;
    $ward = $data->ward;
    $priority = $data->priority;


    $query = "UPDATE address SET Phone = '$phone', Address = '$address', 
    City = '$city', District = '$district', Ward = '$ward', 
    Priority = '$priority' WHERE OwnerID = '$userID' AND Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $adr = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(
        array(
            "data" => $adr,
            "status" => true,
            "statusText" => "Thay đổi địa chỉ thành công cho người dùng $id!",
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "id" => null,
            "status" => false,
            "statusText" => "Thay đổi địa chỉ không thành công cho người dùng $id!",
            "error" => $e->getMessage(),
        )
    );
}
