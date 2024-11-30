<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT 
    COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as TODAY, 
    COUNT(CASE WHEN DATE(UpdateAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as PRE_DAY,
    COUNT(CASE WHEN MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as THIS_MONTH,
    COUNT(CASE WHEN MONTH(UpdateAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as PRE_MONTH,
    COUNT(CASE WHEN YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as THIS_YEAR,
    COUNT(CASE WHEN YEAR(UpdateAt) = YEAR(DATE_SUB(CURDATE(),INTERVAL 1 YEAR)) AND Status = 'Banned' THEN 1 END) as PRE_YEAR
    FROM users
    ORDER BY `UpdateAt` DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(
        array(
            "status" => true,
            "banned" => $banned_users,
        )
    );
    
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "banned" => 0,
            "statusText" => $e
        )
    );
}
