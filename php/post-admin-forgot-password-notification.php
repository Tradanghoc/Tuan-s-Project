<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {

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

    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('NTF');
    $email = $data->email;
    $ex = $data->ex;

    $query = "INSERT INTO notifications (Id, Title, Content, IsRead, CreateAt, TargetID, Creator)
    SELECT '$id', 'Employee want to retrieve password', 'With reason: $ex',0, NOW(), admin.Id, admin.Id
    FROM admin WHERE admin.Email = '$email'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();

    echo json_encode(array(
        "statusText" => "Success!",
        "status" => true
    ));
} catch (Exception $e) {
    echo json_encode(array(
        "statusText" => $e,
        "status" => false
    ));
}
