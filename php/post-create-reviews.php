<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once 'connection.php';

function generateID($prefix)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
try {
    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('REV');
    $targetID = $data->targetID;
    $userID = $data->userID;
    $point = $data->point;
    $content = $data->content;


    $query = "INSERT INTO reviews(Id, Point, TargetID, UserID, Comment, CreateAt, Status) 
    VALUES('$id', $point, '$targetID', '$userID', '$content', NOW(), 'Active')";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array("message" => "Tạo bình luận thành công", "status" => true));
} catch (Exception $e) {
    echo json_encode(array(
        "message" => "Tạo bình luận thất bại $e", 
        "status" => false));
}
