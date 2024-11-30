<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {

    $query = "SELECT *
    FROM users WHERE Status = 'Active'";

    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($users) == 0) {
        echo json_encode(
            array(
                "users" => $users,
                "status" => false,
                "message" => "There is no user in the database!",
            )
        );
        return;
    }

    foreach($users as $key => $user){
        $query = "SELECT Id from images WHERE Id = :id LIMIT 1";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(":id", $user['Image']);
        $stmt->execute();
        $image = $stmt->fetch(PDO::FETCH_ASSOC);
        if($image == null){
            $users[$key]['Image'] = null;
        }else {
            $users[$key]['Image'] = $image['Id'];
        }

    }
    echo json_encode(
        array(
            "users" => $users,
            "status" => true,
            "message" => "Success to get your foods!",
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "users" => [],
            "status" => false,
            "message" => "Fail to get user list because of $e!",
        )
    );
}
