<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

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

function generateCode()
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 6; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

try {

    $data = json_decode(file_get_contents("php://input"));
    $id = generateID('NOT');
    $adminID = $data->id;
    $title = $data->title;
    $content = $data->content;
    $userID = $data->userID;
    $gift = $data->gift;
    $amount = count($userID);
    $code = generateCode();
    $repeat = true;



    // Begin transaction
    // $dbConn->beginTransaction();

    if ($gift == 'true') {
        $couponID = generateID('CPN');
        while ($repeat) {
            $start = date('Y-m-d H:i:s'); // Current date and time
            $end = date('Y-m-d H:i:s', strtotime('+1 month')); // One month from now
            $query = "SELECT * FROM coupons WHERE Code = '$code' AND ((Start <= '$end' AND End >= '$start'))";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch();
            if ($result == null) {
                $repeat = false;
            } else {
                $code = generateCode();
            }
        }

        $query = "SELECT foods.*, SUM(orderitems.Quantity) as Sold
        FROM foods 
        INNER JOIN orderitems ON foods.Id = orderitems.FoodID 
        WHERE foods.Status = 'Sale' 
        GROUP BY foods.Id 
        ORDER BY Sold DESC, TimeMade DESC, Price ASC LIMIT 10";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $foods = $stmt->fetchAll();

        $query = "INSERT INTO coupons (Id, Code, Start, End, Discount, Type, CreateAt, CreateBy, UpdateBy) VALUES 
        ('$couponID', '$code', '$start', '$end', 30, 'Times', NOW(), '$adminID', '$adminID')";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        foreach ($foods as $food) {
            $query = "INSERT INTO couponitems (CouponID, FoodID) VALUES ('$couponID', '$food->Id')";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();
        }

        foreach ($userID as $user) {
            $copID = generateID('CPU');
            $query = "INSERT INTO couponuser (Id,UserID, CouponID, Status) VALUES ('$copID','$user', '$couponID', 'Available')";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();

            $query = "INSERT INTO notifications (Id, Title, Content, IsRead, CreateAt, GiftID, TargetID, Creator) VALUES 
            ('$id', '$title', '$content',0, NOW(), '$couponID', '$user', '$adminID')";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();
            $id = generateID('NOT');

        }

        // echo json_encode(
        //     array(
        //         "statusText" => "Success!",
        //         "status" => true
        //     )
        // );
    } else {
        foreach ($userID as $user) {
            // error_log($user);
            $query = "INSERT INTO notifications (Id, Title, Content, IsRead, CreateAt, GiftID, TargetID, Creator) VALUES 
            ('$id', '$title', '$content',0, NOW(), NULL, '$user', '$adminID')";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();
            $id = generateID('NOT');

        }

        // $values = "";
        // foreach ($userID as $user) {
        //     $values .= "('$id', '$title', '$content', 0, NOW(), NULL, '$user', '$adminID'),";
        // }
        // // Loại bỏ dấu phẩy cuối cùng
        // $values = rtrim($values, ",");

        // $query = "INSERT INTO notifications (Id, Title, Content, IsRead, CreateAt, GiftID, TargetID, Creator) VALUES $values";
        // error_log($query);
        // $stmt = $dbConn->prepare($query);
        // $stmt->execute();



    }


    // Commit the transaction
    // $dbConn->commit();

    echo json_encode(
        array(
            "statusText" => "Success!",
            "status" => true
        )
    );
} catch (Exception $e) {
    // Rollback the transaction if an exception occurs
    // $dbConn->rollback();

    echo json_encode(
        array(
            "statusText" => "lối ".$e,
            "status" => false
        )
    );
}
