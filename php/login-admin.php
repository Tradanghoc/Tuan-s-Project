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

    $sql = "SELECT * FROM admin WHERE Email='$email' AND Password='$password'";
    $stmt = $dbConn->prepare($sql);
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        // Người dùng tồn tại trong bảng admin, đăng nhập thành công
        echo json_encode(
            array(
                "status" => true,
                "message" => "Đăng nhập thành công!",
                "admin" => $admin,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "message" => "Đăng nhập không thành công!",
                "admin" => null,
            )
        );
    }
} catch ( Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "message" => "Đăng nhập không thành công bởi vì $e!",
            "user" => null,
        )
    );
}
?>
