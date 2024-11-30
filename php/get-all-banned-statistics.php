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

    $query = "SELECT 
    COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as TODAY, 
    COUNT(CASE WHEN DATE(UpdateAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as PRE_DAY,
    COUNT(CASE WHEN MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as THIS_MONTH,
    COUNT(CASE WHEN MONTH(UpdateAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as PRE_MONTH,
    COUNT(CASE WHEN YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as THIS_YEAR,
    COUNT(CASE WHEN YEAR(UpdateAt) = YEAR(DATE_SUB(CURDATE(),INTERVAL 1 YEAR)) AND Status = 'Banned' THEN 1 END) as PRE_YEAR
    FROM foods
    ORDER BY `UpdateAt` DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $banned_foods = $stmt->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT 
    COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as TODAY, 
    COUNT(CASE WHEN DATE(UpdateAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as PRE_DAY,
    COUNT(CASE WHEN MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as THIS_MONTH,
    COUNT(CASE WHEN MONTH(UpdateAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as PRE_MONTH,
    COUNT(CASE WHEN YEAR(UpdateAt) = YEAR(CURDATE()) AND Status = 'Banned' THEN 1 END) as THIS_YEAR,
    COUNT(CASE WHEN YEAR(UpdateAt) = YEAR(DATE_SUB(CURDATE(),INTERVAL 1 YEAR)) AND Status = 'Banned' THEN 1 END) as PRE_YEAR
    FROM restaurants
    ORDER BY `UpdateAt` DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $banned_restaurants = $stmt->fetch(PDO::FETCH_ASSOC);

    $banned['TODAY'] = $banned_users['TODAY'] + $banned_foods['TODAY'] + $banned_restaurants['TODAY'];
    $banned['PRE_DAY'] = $banned_users['PRE_DAY'] + $banned_foods['PRE_DAY'] + $banned_restaurants['PRE_DAY'];
    $banned['THIS_MONTH'] = $banned_users['THIS_MONTH'] + $banned_foods['THIS_MONTH'] + $banned_restaurants['THIS_MONTH'];
    $banned['PRE_MONTH'] = $banned_users['PRE_MONTH'] + $banned_foods['PRE_MONTH'] + $banned_restaurants['PRE_MONTH'];
    $banned['THIS_YEAR'] = $banned_users['THIS_YEAR'] + $banned_foods['THIS_YEAR'] + $banned_restaurants['THIS_YEAR'];
    $banned['PRE_YEAR'] = $banned_users['PRE_YEAR'] + $banned_foods['PRE_YEAR'] + $banned_restaurants['PRE_YEAR'];

    echo json_encode(
        array(
            "status" => true,
            "banned" => $banned,
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
