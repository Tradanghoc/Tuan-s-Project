<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
include_once 'connection.php';

try {

    $data = json_decode(file_get_contents('php://input'));
    $email = $data->email;
    $password = $data->password;

    $query = "SELECT * FROM admin WHERE Email = '$email' AND Password = '$password'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($admin) {
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Đăng nhập thành công!",
                "data" => $admin,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Sai tên đăng nhập hoặc mật khẩu!",
                "data" => null,
            )
        );
    };
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "$e",
            "data" => null,
        )
    );
}
