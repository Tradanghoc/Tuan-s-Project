<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

include_once 'connection.php';


try {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data -> id;
    $userID = $data->userID;
    $point = $data->point;
    $content = $data->content;


    $query = "UPDATE reviews SET Point = $point, Comment = '$content' WHERE Id = '$id'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array("message" => "Sửa bình luận thành công", "status" => true));
} catch (Exception $e) {
    echo json_encode(array("message" => "Sửa bình luận thất bại $e", "status" => false));
}
