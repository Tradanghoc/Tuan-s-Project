<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT * FROM users WHERE Status = 'Banned'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($users == null) {
        if (count($users) == 0) {
            echo json_encode(
                array(
                    "data" => [],
                    "status" => false,
                    "message" => "Don't have banned users",
                )
            );
            return;
        }
    } else {
        echo json_encode(
            array(
                "data" => $users,
                "status" => true,
                "message" => "Success to get banned foods!",
            )
        );
    }
} catch (Exception $e) {
}
