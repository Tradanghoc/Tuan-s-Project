<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header(('Access-Control-Allow-Origin: *'));
header(('Access-Control-Max-Age: 3600'));
header(('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'));

include_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $target = $data->target;
    $user = $data->user;


    $query = "DELETE FROM favlist WHERE TargetID = '$target' AND UserID = '$user'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(
        array(
            'status' => true,
            'statusText' => 'Favorite removed'
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            'status' => false,
            'statusText' => $e
        )
    );
    return;
}
