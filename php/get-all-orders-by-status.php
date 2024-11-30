<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
require_once 'connection.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    $status = $data->status;
    $query = "SELECT orders.UserID, orders.Status, GROUP_CONCAT(foods.Name SEPARATOR ', ') as OrderItems
    FROM orders 
    INNER JOIN orderitems ON orders.Id = orderitems.OrderID
    INNER JOIN foods ON orderitems.FoodID = foods.Id
    WHERE orders.Status = '$status' 
    GROUP BY orders.Id";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array(
        "status" => true,
        "message" => "Orders fetched successfully",
        "data" => $result
    ));

} catch (Exception $e) {
    echo json_encode(array(
        "status" => false,
        "message" => "Error: $e"
    ));
}

?>