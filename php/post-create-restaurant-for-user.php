<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';



try {
    $data = json_decode(file_get_contents('php://input'));

    function generateID($prefix){
        $char = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charLength = strlen($char);
        $randomString = $prefix;
        for ($i = 0; $i < 17; $i++) {
            $randomString .= $char[rand(0, $charLength - 1)];
        }
        return $randomString;
    }

    $id = generateID('RES');
    $userID = $data->userID;
    $name = $data->name;
    $intro = $data->intro;
    $email = $data->email;

    $query = "INSERT INTO restaurants (Id, Name, Email, Introduction, Status, ownerID, CreateAt)
    VALUES('$id', '$name', '$email', '$intro', 'OPEN', '$userID', NOW())";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(
        array(
            "data" => $id,
            "status" => true,
            "statusText" => "Tạo nhà hàng thành công!",
        )
    );
    
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Thêm dơn hàng thất bại bởi vì $e!",
            "data" => null,
        )
    );
}
