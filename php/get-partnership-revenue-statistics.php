<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3600');
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    
    $query = "SELECT 
    SUM(CASE 
        WHEN PaymentMethod = 'Up Front' AND DATE(ArriveAt) = CURDATE() 
        AND MONTH(ArriveAt) = MONTH(CURDATE()) AND YEAR(ArriveAt) = YEAR(CURDATE()) 
        AND Status = 'Done' THEN TotalValue
        WHEN PaymentMethod = 'Later' AND DATE(ArriveAt) = CURDATE() 
        AND Status = 'Done' AND MONTH(ArriveAt) = MONTH(CURDATE()) 
        AND YEAR(ArriveAt) = YEAR(CURDATE()) THEN TotalValue
        ELSE 0
    END) AS TODAY,
    SUM(CASE 
        WHEN PaymentMethod = 'Up Front' AND MONTH(ArriveAt) = MONTH(CURDATE()) 
        AND Status = 'Done' THEN TotalValue
        WHEN PaymentMethod = 'Later' AND MONTH(ArriveAt) = MONTH(CURDATE()) AND Status = 'Done' THEN TotalValue
        ELSE 0
    END) AS THIS_MONTH,
    SUM(CASE 
        WHEN PaymentMethod = 'Up Front' AND YEAR(ArriveAt) = YEAR(CURDATE()) 
        AND Status = 'Done' THEN TotalValue
        WHEN PaymentMethod = 'Later' AND YEAR(ArriveAt) = YEAR(CURDATE()) AND Status = 'Done' THEN TotalValue
        ELSE 0
    END) AS THIS_YEAR,

    SUM(CASE 
        WHEN PaymentMethod = 'Up Front' AND DATE(ArriveAt) = CURDATE()
        AND Status = 'Done' THEN TotalValue
        WHEN PaymentMethod = 'Later' AND DATE(ArriveAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND Status = 'Done' THEN TotalValue
        ELSE 0
    END) AS PRE_DAY,
    SUM(CASE 
        WHEN PaymentMethod = 'Up Front' AND MONTH(ArriveAt) = MONTH(CURDATE()) AND YEAR(ArriveAt) = YEAR(CURDATE())
        AND Status = 'Done' THEN TotalValue
        WHEN PaymentMethod = 'Later' AND MONTH(ArriveAt) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND Status = 'Done' THEN TotalValue
        ELSE 0
    END) AS PRE_MONTH,
    SUM(CASE 
        WHEN PaymentMethod = 'Up Front' AND YEAR(ArriveAt) = YEAR(CURDATE())
        AND Status = 'Done' THEN TotalValue
        WHEN PaymentMethod = 'Later' AND YEAR(ArriveAt) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR)) AND Status = 'Done' THEN TotalValue
        ELSE 0
    END) AS PRE_YEAR
    FROM orders";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(
        array(
            "status" => true,
            "revenue" => $revenue,
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "revenue" => null,
            "statusText" => $e
        )
    );
}
