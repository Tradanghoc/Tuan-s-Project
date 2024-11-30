<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

use PHPMailer\PHPMailer\PHPMailer;

include_once $_SERVER['DOCUMENT_ROOT'] . '/helpers/PHPMailer-master/src/PHPMailer.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/helpers/PHPMailer-master/src/SMTP.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/helpers/PHPMailer-master/src/Exception.php';


$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$type = $data->type;
$token = $data->token;
$attempt = 0;

do {
    $query = "SELECT Token FROM confirmations WHERE Token = '$token' AND ExpireAt > NOW() AND Status = 1";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $tokens = $stmt->fetch(PDO::FETCH_ASSOC);
    if($tokens) {
        $token = rand(100000, 999999);
        $attempt++;
    }else {
        break;
    }
} while ($attempt <= 10);

if($attempt > 10) {
    echo json_encode(
        array(
            "statusText" => "Xin lỗi vui lòng thử lại sau 5 phút",
            "status" => false,
        )
    );
    return;
}

$query = "SELECT Id FROM users WHERE Email = '$email'";
$stmt = $dbConn->prepare($query);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {

    $dbConn->query("INSERT INTO confirmations (Email, Token, Type, CreateAt, ExpireAt, Status) 
    VALUES ('$email', '$token', '$type', NOW(), NOW() + INTERVAL 5 MINUTE, 1)");

    // link email gan port reactJS
    $link = "Mã bảo vệ của bạn là $token. Lưu ý mã này chỉ tồn tại trong 5 phút. Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.";

    $mail = new PHPMailer();
    $mail->CharSet = "utf-8";
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Username = "anhtuan03.mdev";
    $mail->Password = "fpvdpoydhaxjhzsr";
    $mail->SMTPSecure = "ssl";
    $mail->Host = "ssl://smtp.gmail.com";
    $mail->Port = "465";
    $mail->From = "anhtuan03.mdev@gmail.com";
    $mail->FromName = "Online Orangic Application";
    $mail->AddAddress($email, "Hello");
    $mail->Subject = "$type";
    $mail->isHTML(true);
    $mail->Body = "Mã bảo vệ của bạn đã tới. " . $link . "";

    $res = $mail->Send();

    if ($res) {
        echo json_encode(
            array(
                "message" => "Email has been sent",
                "status" => true
            )
        );
    } else {
        echo json_encode(
            array(
                "message" => "Error email",
                "status" => false,
            )
        );
    }
} else {
    echo json_encode(
        array(
            "message" => "Email not exist",
            "user" => $user,
        )
    );
}
