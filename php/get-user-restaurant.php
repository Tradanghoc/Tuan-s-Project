<?php 

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {

    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id;

    $query = "SELECT Id from restaurants WHERE restaurants.ownerID = '$id' LIMIT 1";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $rest = $stmt->fetch(PDO::FETCH_ASSOC);

    if($rest == null){
        echo json_encode(array(
            "statusText" => "Bạn không có nhà hàng",
            "status" => false
        ));
    } else {
        echo json_encode(array(
            "data" => $rest,
            "statusText" => "Đã tìm thấy nhà hàng của bạn" ,
            "status" => true
        ));
    }
    
} catch (Exception $e) {
    echo json_encode(array(
        "statusText" => $e,
        "status" => false
    ));
}

?>