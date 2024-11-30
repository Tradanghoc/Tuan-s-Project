<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once 'connection.php';

$data = json_decode(file_get_contents("php://input"));
$name = $data->name;
$email = $data->email;
$newEmail = $data->newEmail;
$password = $data->password;
$confirm = $data->confirm;

try {

    $query = "SELECT * FROM confirmations WHERE Email = '$email' 
    AND Token = '$confirm' AND Type = 'Đổi Thông Tin' AND Status = 1 AND ExpireAt > NOW()";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $count = $stmt->rowCount();
    if ($count == 0) {
        echo json_encode(array(
            'statusText' => 'Token không hợp lệ', 
            "status" => false, "count" => $count));
        return;
    }

    $query = "UPDATE users 
    INNER JOIN confirmations ON users.Email = confirmations.Email AND confirmations.Type = 'Đổi Thông Tin'
    SET Name = '$name', users.Email = '$newEmail', Password = '$password', UpdateAt = NOW() 
    WHERE users.Email = '$email' AND confirmations.Token = '$confirm' AND confirmations.Status = 1 AND confirmations.ExpireAt > NOW()";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(array('statusText' => 'Cập nhật thông tin thành công', "status" => true));
} catch (Exception $e) {
    echo json_encode(array('statusText' => "Cập nhật thông tin thất bại bởi vì $e", "status" => false));
}
