<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents('php://input'));
    $id = $data->id;
    $currentDirectory = getcwd();
    $uploadDirectory = "/uploads/";
    $folder_path = $currentDirectory . $uploadDirectory;
    $files = glob($folder_path . '/*');

    // foreach ($files as $key => $value) {
    //     if($value )
    // }

    if (is_file("$folder_path/" . "$id" . ".jpg")) {
        unlink("$folder_path/" . "$id" . ".jpg");

        $query = "DELETE FROM images WHERE Id = '$id'";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        $query = "DELETE FROM images WHERE Id = '$id'";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        echo json_encode(array(
            "status" => true,
            "statusText" => "Ảnh đã được xóa"
        ));
    } else {
        echo json_encode(array(
            "status" => false,
            "statusText" => "Không có ảnh với id $id trong thư mục lưu trữ"
        ));
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "message" => $e->getMessage()
        )
    );
}
