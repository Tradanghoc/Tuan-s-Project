<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once 'connection.php';

function generateRandomString($prefix) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randomString = $prefix;

    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $randomString;
}

try {
    $data = json_decode(file_get_contents('php://input'));
    $id = generateRandomString("ADD");
    $address = $data->address;
    $phone = $data->phone;
    $city = $data->city;
    $district = $data->district;
    $ward = $data->ward;
    
    $query = "INSERT INTO address (Id, OwnerID, Phone, Address, City, District, Ward) VALUE('$id', '$ownerID', '$phone', '$address', '$city', '$district', '$ward')";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Thêm địa chỉ thành công cho người dùng $id",
            )
        );
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Thêm địa chỉ không thành công bởi vì $e!",
        )
    );
}

