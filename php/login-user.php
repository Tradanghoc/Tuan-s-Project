<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents('php://input'));
    $email = $data->email;
    $password = $data->password;

    $sql = "SELECT Id, Name, `Rank` FROM users WHERE Email ='$email' AND Password='$password' AND Status = 'Active'";
    $stmt = $dbConn->prepare($sql);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Người dùng tồn tại trong bảng user, đăng nhập thành công
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Đăng nhập thành công!",
                "data" => $user,
            )
        );
    } else {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Đăng nhập không thành công!",
                "data" => $user,
            )
        );
    }
} catch ( Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Đăng nhập không thành công bởi vì $e!",
            "data" => null,
        )
    );
}
?>
