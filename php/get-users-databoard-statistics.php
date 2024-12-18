<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
include_once 'connection.php';


try {
    $data = json_decode(file_get_contents('php://input'));
    $timePoints = $data->timePoints;
    $timeLine = $data->timeLine;
    $users = array();
    $banneds = array();
    $revenues = array();
    $output = array();

    switch ($timeLine) {
        case "Today":
            foreach ($timePoints as $key => $value) {
                $query = "SELECT 
                COUNT(CASE WHEN HOUR(CreateAt) <= HOUR('$value') 
                AND DATE(CreateAt) = CURDATE() 
                AND MONTH(CreateAt) = MONTH(CURDATE())
                AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as NewUsers
                FROM users 
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                $users[] = $user['NewUsers'];

                $query = "SELECT
                SUM(CASE 
                WHEN orders.PaymentMethod = 'Up Front' AND HOUR(orderitems.ArriveAt) <= HOUR('$value') 
                AND DATE(orderitems.ArriveAt) = CURDATE() AND MONTH(orderitems.ArriveAt) = MONTH(CURDATE()) 
                AND YEAR(orderitems.ArriveAt) = YEAR(CURDATE()) AND orderitems.Status = 'Done' THEN 1
                WHEN orders.PaymentMethod = 'Later' AND HOUR(orderitems.ArriveAt) <= HOUR('$value') 
                AND DATE(orderitems.ArriveAt) = CURDATE() AND MONTH(orderitems.ArriveAt) = MONTH(CURDATE()) 
                AND YEAR(orderitems.ArriveAt) = YEAR(CURDATE()) AND orderitems.Status = 'Done' THEN 1
                ELSE 0 END) as Revenue
                FROM orders
                LEFT JOIN orderitems ON orders.Id = orderitems.OrderID
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

                $revenues[] = intval($revenue['Revenue']);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND Status = 'Banned' 
                AND HOUR(UpdateAt) <= HOUR('$value') 
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM users
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

                $banneds[] = $banned_users['Nows'];
            }

            $output['users'] = $users;
            $output['revenues'] = $revenues;
            $output['banneds'] = $banneds;

            break;
        case 'This Month':
            foreach ($timePoints as $key => $value) {
                $query = "SELECT 
                COUNT(CASE
                WHEN DATE(CreateAt) <= DATE('$value') 
                AND MONTH(CreateAt) = MONTH(CURDATE())
                AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as NewUsers
                FROM users 
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                $users[] = $user['NewUsers'];

                $query = "SELECT
                SUM(CASE 
                WHEN orders.PaymentMethod = 'Up Front' AND DATE(orderitems.ArriveAt) <= DATE('$value') 
                AND MONTH(orderitems.ArriveAt) = MONTH(CURDATE()) 
                AND YEAR(orderitems.ArriveAt) = YEAR(CURDATE()) AND orderitems.Status = 'Done' THEN 1
                WHEN orders.PaymentMethod = 'Later' AND HOUR(orderitems.ArriveAt) <= HOUR('$value') 
                AND DATE(orderitems.ArriveAt) = CURDATE() AND MONTH(orderitems.ArriveAt) = MONTH(CURDATE()) 
                AND YEAR(orderitems.ArriveAt) = YEAR(CURDATE()) AND orderitems.Status = 'Done' THEN 1
                ELSE 0 END) as Revenue
                FROM orders
                LEFT JOIN orderitems ON orders.Id = orderitems.OrderID
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

                $revenues[] = intval($revenue['Revenue']);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned' 
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM users
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

                $banneds[] = $banned_users['Nows'];
            }

            $output['users'] = $users;
            $output['revenues'] = $revenues;
            $output['banneds'] = $banneds;
            break;
        case 'This Year':
            foreach ($timePoints as $key => $value) {
                $query = "SELECT 
                COUNT(CASE WHEN MONTH(CreateAt) <= MONTH('$value')
                AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as NewUsers
                FROM users 
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                $users[] = $user['NewUsers'];

                $query = "SELECT
                SUM(CASE 
                WHEN orders.PaymentMethod = 'Up Front' AND MONTH(orderitems.ArriveAt) <= MONTH('$value')
                AND YEAR(orderitems.ArriveAt) = YEAR(CURDATE()) AND orderitems.Status = 'Done' THEN 1
                WHEN orders.PaymentMethod = 'Later' AND HOUR(orderitems.ArriveAt) <= HOUR('$value') 
                AND DATE(orderitems.ArriveAt) = CURDATE() AND MONTH(orderitems.ArriveAt) = MONTH(CURDATE()) 
                AND YEAR(orderitems.ArriveAt) = YEAR(CURDATE()) AND orderitems.Status = 'Done' THEN 1
                ELSE 0 END) as Revenue
                FROM orders
                LEFT JOIN orderitems ON orders.Id = orderitems.OrderID
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

                $revenues[] = intval($revenue['Revenue']);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned' 
                AND MONTH(UpdateAt) <= MONTH('$value') AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM users
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

                $banneds[] = $banned_users['Nows'];
            }

            $output['users'] = $users;
            $output['revenues'] = $revenues;
            $output['banneds'] = $banneds;
            break;
    }

    // $min = min(min($output['users']), min($output['revenues']), min($output['banneds']));
    // $max = max(max($output['users']), max($output['revenues']), max($output['banneds'])) + 10;

    echo json_encode(
        array(
            "data" => array(
                "output" => $output,
                // "min" => $min,
                // "max" => $max
            ),
            "status" => true,
            "message" => "Success to get all data board statistics!",
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "data" => [],
            "status" => false,
            "message" => $e
        )
    );
}
