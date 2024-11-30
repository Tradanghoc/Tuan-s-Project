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

                /** query new user */

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

                /** query new restaurant */

                $query = "SELECT 
                COUNT(CASE WHEN HOUR(CreateAt) <= HOUR('$value') 
                AND DATE(CreateAt) = CURDATE() 
                AND MONTH(CreateAt) = MONTH(CURDATE())
                AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as NewRestaurants
                FROM restaurants 
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

                $revenues[] = intval($revenue['NewRestaurants']);

                /** query banned */

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND Status = 'Banned' 
                AND HOUR(UpdateAt) <= HOUR('$value') 
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM users
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND Status = 'Banned' 
                AND HOUR(UpdateAt) <= HOUR('$value')
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM foods
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_foods = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) = CURDATE() AND Status = 'Banned' AND HOUR(UpdateAt) <= HOUR('$value')
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM restaurants
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_restaurants = $stmt->fetch(PDO::FETCH_ASSOC);

                $banned['Nows'] = $banned_users['Nows'] + $banned_foods['Nows'] + $banned_restaurants['Nows'];

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
                COUNT(CASE WHEN DATE(CreateAt) <= DATE('$value')
                AND MONTH(CreateAt) = MONTH(CURDATE())
                AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as NewRestaurants
                FROM restaurants 
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

                $revenues[] = intval($revenue['NewRestaurants']);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned' 
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM users
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned' 
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM foods
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_foods = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned'
                AND MONTH(UpdateAt) = MONTH(CURDATE()) AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM restaurants
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_restaurants = $stmt->fetch(PDO::FETCH_ASSOC);

                $banned['Nows'] = $banned_users['Nows'] + $banned_foods['Nows'] + $banned_restaurants['Nows'];

                $banneds[] = $banned['Nows'];
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
                COUNT(CASE WHEN MONTH(CreateAt) = MONTH('$value')
                AND YEAR(CreateAt) = YEAR(CURDATE()) THEN 1 END) as NewRestaurants
                FROM restaurants 
                ORDER BY `CreateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $revenue = $stmt->fetch(PDO::FETCH_ASSOC);

                $revenues[] = intval($revenue['NewRestaurants']);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned' 
                AND MONTH(UpdateAt) <= MONTH('$value') AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM users
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_users = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned' 
                AND MONTH(UpdateAt) <= MONTH('$value') AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM foods
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_foods = $stmt->fetch(PDO::FETCH_ASSOC);

                $query = "SELECT 
                COUNT(CASE WHEN DATE(UpdateAt) <= DATE('$value') AND Status = 'Banned'
                AND MONTH(UpdateAt) <= MONTH('$value') AND YEAR(UpdateAt) = YEAR(CURDATE()) THEN 1 END) as Nows
                FROM restaurants
                ORDER BY `UpdateAt` DESC";
                $stmt = $dbConn->prepare($query);
                $stmt->execute();
                $banned_restaurants = $stmt->fetch(PDO::FETCH_ASSOC);

                $banned['Nows'] = $banned_users['Nows'] + $banned_foods['Nows'] + $banned_restaurants['Nows'];

                $banneds[] = $banned['Nows'];
            }

            $output['users'] = $users;
            $output['revenues'] = $revenues;
            $output['banneds'] = $banneds;
            break;
    }

    $min = min(min($output['users']), min($output['revenues']), min($output['banneds']));
    $max = max(max($output['users']), max($output['revenues']), max($output['banneds'])) + 10;

    echo json_encode(
        array(
            "data" => array(
                "output" => $output,
                "min" => $min,
                "max" => $max
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
