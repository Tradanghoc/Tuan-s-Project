<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

function generateRandomString($prefix)
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randomString = $prefix;
    for ($i = 0; $i < 17; $i++) {
        $randomString .= $characters[rand(0, 61)];
    }
    return $randomString;
}


try {
    $data = json_decode(file_get_contents('php://input'));
    $id = generateRandomString("ORD");
    $user = $data->userID;
    $foodID = $data->foodID;
    $quantity = $data->quantity;

    // Get address

    $query = "SELECT Id from address WHERE `OwnerID` = '$user' AND `Priority` = 1";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $address = $stmt->fetchColumn();
    if ($address) {
        $query = "SELECT Id from address WHERE `OwnerID` = '$user'";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $address = $stmt->fetchColumn();
        if(!$address){
            echo json_encode(array("address" => $address,  "user" => $user, "status" => 400));
            return;
        }
    }


    // Get order in waiting status

    $query = "SELECT Id from orders WHERE `UserID` = '$user' AND `Status` = 'Waiting'";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $order = $stmt->fetchColumn();
    if ($order == null) {
        // Create new order
        $query = "INSERT INTO `orders`(`Id`,`UserID`, `AddressID`, `Status`) VALUES ('$id','$user', '$address', 'Waiting')";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        // Insert item into order
        $itemID = generateRandomString("ORI");
        $query = "INSERT INTO orderitems (Id,OrderID, FoodID, Quantity, Pick) 
        VALUES ('$itemID','$id','$foodID','$quantity',0)";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();

        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Thêm dơn hàng thành công!",
            )
        );
    } else {
        // Check if item already exist
        $query =  "SELECT Id FROM orderitems WHERE `OrderID` = '$order' AND `FoodID` = '$foodID'";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        $updateRow = $stmt->fetchColumn();
        if ($updateRow != null) {
            // Update quantity
            $query = "UPDATE orderitems SET `Quantity` = `Quantity` + '$quantity' WHERE `Id` = '$updateRow'";
            $stmt = $dbConn->prepare($query);
            $stmt->execute();
            echo json_encode(
                array(
                    "status" => true,
                    "statusText" => "Thay đổi dơn hàng thành công!",
                )
            );
            return;
        }
        // Insert item into order
        $itemID = generateRandomString("ORI");
        $query = "INSERT INTO orderitems (Id,OrderID, FoodID, Quantity, Pick) 
        VALUES ('$itemID','$order','$foodID','$quantity',0)";
        $stmt = $dbConn->prepare($query);
        $stmt->execute();
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Thêm dơn hàng thành công!",
            )
        );
    }
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => 500,
            "statusText" => "Thêm dơn hàng thất bại bởi vì $e!",
            "data" => null,
        )
    );
}
