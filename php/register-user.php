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
    $id = generateRandomString("USR");
    $name = $data->name;
    $email = $data->email;
    $token = $data->token;
    $password = $data->password;
    $rank = 0;
    
    $query = "SELECT * FROM users WHERE Email = '$email' OR Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Email đã tồn tại!",
                "data" => null,
            )
        );
    } else {
        $query = "SELECT * FROM confirmations WHERE Email = '$email' AND Token = '$token' AND ExpireAt > NOW() AND Status = 1";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $tokens = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$tokens) {
            echo json_encode(
                array(
                    "status" => false,
                    "statusText" => "Mã xác nhận không hợp lệ!",
                    "data" => null,
                )
            );
            return;
        }else {
            $query = "UPDATE confirmations SET Status = 0 WHERE Email = '$email' AND Token = '$token' AND ExpireAt > NOW() AND Status = 1";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();
        }

        $query = "INSERT INTO users(Id, Name, Email, Password, `Rank`, CreateAt, Status)
        VALUES('$id', '$name', '$email', '$password', $rank, now(), 'Active')";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Đăng kí thành công!",
                "data" => $id,
            )
        );


    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Đăng kí không thành công bởi vì $e!",
            "data" => null,
        )
    );
}

