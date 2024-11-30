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

try {

    $data = json_decode(file_get_contents("php://input"));
    $email = $data->email;
    $type = $data->type;
    $token = $data->token;
    $attempt = 0;

    $query = "SELECT * FROM users WHERE Email = '$email'";
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
        return;
    }



    do {
        $query = "SELECT Token FROM confirmations WHERE Token = '$token' AND ExpireAt > NOW() AND Status = 1";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $tokens = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($tokens) {
            $token = rand(100000, 999999);
            $attempt++;
        } else {
            break;
        }
    } while ($attempt <= 10);

    if ($attempt > 10) {
        echo json_encode(
            array(
                "statusText" => "Xin lỗi vui lòng thử lại sau 5 phút",
                "status" => false,
            )
        );
        return;
    }

    $layout = "
<!DOCTYPE html>
<html>
<head>
    <title>Registration Confirmation</title>
    <style>
        body {
            background-color: #FFA500;
            color: #ffffff;
            font-family: Arial, sans-serif;
        }
        .container {
            margin: 0 auto;
            width: 80%;
            padding: 20px;
            background-color: #ffffff;
            color: #FFA500;
            border-radius: 5px;
            box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.2);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-top: 20px;
            padding-bottom: 10px;
            background-color: #ee4d2d;
        }
        .content {
            margin-bottom: 20px;
            color: #000000;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='color: #ffffff'>Mã xác thực email của bạn đã tới!</h1>
        </div>
        <div class='content'>
            <p>Mã bảo vệ của bạn là $token</p>
            <p>Lưu ý mã này chỉ tồn tại trong 5 phút. Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
        <div class='footer'>
            <p>Nếu bạn có thắc mắc có thể liên hệ chúng tôi qua <a href='mailto:info@example.com' style='color: #ffffff;'>info@example.com</a></p>
        </div>
    </div>
</body>
</html>
";


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
    $mail->Body = $layout;

    $res = $mail->Send();

    if ($res) {
        echo json_encode(
            array(
                "statusText" => "Email has been sent",
                "status" => true
            )
        );
    } else {
        echo json_encode(
            array(
                "statusText" => "Error email $res",
                "status" => false,
            )
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "message" => "Error: $e",
            "status" => false
        )
    );
    return;
}
