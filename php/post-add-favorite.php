<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header(('Access-Control-Allow-Origin: *'));
header(('Access-Control-Max-Age: 3600'));
header(('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'));

include_once 'connection.php';

function generateID($prefix)
{
    $chars = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    $id = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $id .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $id;
}

try {
    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('FAV');
    $target = $data->target;
    $user = $data->user;


    $query = "INSERT INTO favlist (Id, TargetID, UserID) VALUES ('$id', '$target', '$user')";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    echo json_encode(
        array(
            'status' => true,
            'statusText' => 'Favorite added'
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
