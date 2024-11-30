<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT 
    COUNT(CASE WHEN DATE(CreateAt) = CURDATE() AND MONTH(CreateAt) = MONTH(CURDATE()) AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as TODAY, 
    COUNT(CASE WHEN DATE(CreateAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND MONTH(CreateAt) = MONTH(CURDATE()) AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as PRE_DAY,
    COUNT(CASE WHEN MONTH(CreateAt) = MONTH(CURDATE()) AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as THIS_MONTH,
    COUNT(CASE WHEN MONTH(CreateAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as PRE_MONTH,
    COUNT(CASE WHEN YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as THIS_YEAR,
    COUNT(CASE WHEN YEAR(CreateAt) = YEAR(DATE_SUB(CURDATE(),INTERVAL 1 YEAR)) THEN 1 END) as PRE_YEAR
    FROM foods
    ORDER BY `CreateAt` DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $date = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(
        array(
            "status" => true,
            "statistics" => $date,
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statistics" => 0,
            "statusText" => $e
        )
    );
}
