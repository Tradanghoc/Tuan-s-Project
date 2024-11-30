<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

function generateID($prefix) {
    $characters = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
    $charactersLength = strlen($characters);
    $randomString = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;
    $reply = $data->reply;
    $replyBy = $data->replyBy;
    $notifyID = generateID('NOT');
    $query = "UPDATE reports SET Reply = '$reply', ReplyAt = Now(), ReplyBy = '$replyBy' WHERE reports.Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(array(
        "status" => true,
        "message" => "Đã cập nhật báo cáo $id thành công!"));
    
    $query = "INSERT INTO notifications (Id, Title, Content, IsRead, CreateAt, UserID, Creator)
    VALUES ('$notifyID', 'Báo cáo của bạn đã được trả lời', '$reply', 0, Now(), 
    (SELECT reports.Author FROM reports WHERE reports.Id = '$id'), '$replyBy')";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(array(
        "status" => true,
        "message" => "Đã gửi thông báo đến người báo cáo!"));
} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "message" => "Lỗi cập nhật báo cáo bởi vì $e"));
}

?>