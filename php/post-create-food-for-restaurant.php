<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';



try {
    $data = json_decode(file_get_contents('php://input'));

    function generateID($prefix)
    {
        $char = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charLength = strlen($char);
        $randomString = $prefix;
        for ($i = 0; $i < 17; $i++) {
            $randomString .= $char[rand(0, $charLength - 1)];
        }
        return $randomString;
    }

    $id = generateID('FOD');
    $resID = $data->resID;
    $name = $data->name;
    $price = $data->price;
    $desc = $data->desc;
    $time = $data->time;
    $featured = $data->featured;
    $disc = $data->disc;
    $status = $data ->status;
    $image = $data->image;

    $query = "INSERT INTO foods (Id, Name, Price, Description, TimeMade, 
FeatureItem, Discount, Status, RestaurantID, CreateAt) 
VALUES(:id, :name, :price, :desc, :time, :featured, :disc, :status, :resID, NOW())";

    $stmt = $dbConn->prepare($query);
    $stmt->execute([
        'id' => $id,
        'name' => $name,
        'price' => $price,
        'desc' => $desc,
        'time' => $time,
        'featured' => $featured,
        'disc' => $disc,
        'resID' => $resID,
        'status' => $status
    ]);


    echo json_encode(
        array(
            "status" => true,
            "statusText" => "Tạo món ăn thành công!",
            "data" => $id
        )
    );
} catch (Exception $e) {
    echo json_encode(
        array(
            "status" => false,
            "statusText" => "Thêm món ăn thất bại bởi vì $e!",
        )
    );
}
