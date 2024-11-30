<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once 'connection.php';

function generateID($prefix) {
    $characters = 'qưertyuiopasdfghjklzxcvbnmABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randomString = $prefix;

    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $randomString;
}

try {
    $data = json_decode(file_get_contents('php://input'));
    $email = $data->email;
    $token = $data->token;
    $password = $data->password;

    $query = "SELECT * FROM confirmations WHERE Email = '$email' AND Token = '$token' AND ExpireAt > NOW() AND Status = 1";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $tokens = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$tokens) {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Mã xác nhận không hợp lệ!",
            )
        );
        return;
    }
    
    $query = "UPDATE users
    INNER JOIN confirmations ON users.Email = confirmations.Email
    SET users.Password = '$password'
    WHERE confirmations.Email = '$email' AND confirmations.Token = '$token' 
    AND confirmations.ExpireAt > NOW() AND confirmations.Status = 1";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    $query = "UPDATE confirmations SET Status = 0 WHERE Email = '$email' AND Token = '$token'
    AND ExpireAt > NOW() AND Status = 1";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(
        array(
            "status" => true,
            "statusText" => "Đổi mật khẩu thành công!",
        )
    );


} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Đổi mật khẩu không thành công bởi vì $e!",
        )
    );
}

