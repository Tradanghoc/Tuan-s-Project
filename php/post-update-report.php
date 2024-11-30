<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';



try {
    $data = json_decode(file_get_contents('php://input'));

    function generateID($prefix)
    {
        $char = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charLength = strlen($char);
        $randomString = $prefix;
        for ($i = 0; $i < 17; $i++) {
            $randomString .= $char[rand(0, $charLength - 1)];
        }
        return $randomString;
    }

    // Id Title Content CreateAt Author TargetID ImageID Status

    $id = $data-> id;
    $ownerID = $data->ownerID;

    $query = "UPDATE reports SET ImageID = :id WHERE Id = :ownerID";
    $stmt = $dbConn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':ownerID', $ownerID);
    $stmt->execute();

    echo json_encode(array(
        "status" => true,
        "statusText" => "Cập nhật báo cáo thành công!",
        "data"=> "$id"
    ));
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Cập nhật báo cáo thất bại bởi vì $e!",
        )
    );
}
