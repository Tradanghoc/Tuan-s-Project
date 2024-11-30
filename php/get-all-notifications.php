<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include_once 'connection.php';

try {
    $query = "SELECT notifications.*, admin.Name, users.Name as UserName FROM notifications 
    LEFT JOIN users ON notifications.TargetID = users.Id
    LEFT JOIN admin ON notifications.Creator = admin.Id WHERE TargetID LIKE 'USR%' ORDER BY notifications.`CreateAt` DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if($notifications == null) {
        echo json_encode(
            array(
                "status" => false,
                "data" => [],
            )
        );
        return;
    }
    
    echo json_encode(
        array(
            "status" => true,
            "data" => $notifications,
        )
        );
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "data" => [],
            "statusText" => $e
        ));
}


?>