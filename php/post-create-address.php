<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

function validatePhone($phone)
{
    return preg_match('/^[0-9]{10}+$/', $phone);
}

function generateID($prefix)
{
    $char = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charLength = strlen($char);
    $randomString = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $randomString .= $char[rand(0, $charLength - 1)];
    }
    return $randomString;
}
try {
    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('ADD');
    $userID = $data->userID;
    $phone = $data->phone;
    $address = $data->address;
    $city = $data->city;
    $district = $data->district;
    $ward = $data->ward;
    $priority = $data->priority;

    // if (!validatePhone($phone)) {
    //     echo json_encode(
    //         array(
    //             "status" => false,
    //             "statusText" => "Số điện thoại không hợp lệ!",
    //         )
    //     );
    //     return;
    // }

    $query = "INSERT INTO address (Id, OwnerID, Phone, Address, City, District, Ward, Priority, Status) 
        VALUES ('$id', '$userID', '$phone', '$address', '$city', '$district', '$ward', '$priority', 'Active')";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(
        array(
            "status" => true,
            "statusText" => "Thêm địa chỉ mới thành công!",
            "data" => [],
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Thêm địa chỉ mới thất bại $e!",
        )
    );
}
