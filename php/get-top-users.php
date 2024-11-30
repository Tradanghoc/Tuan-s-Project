<?php 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php'; 

    $query = "SELECT * 
                  FROM users 
                  ORDER BY `Rank` DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $res = $stmt -> fetchAll(PDO::FETCH_ASSOC);

    if($res == null){
         echo json_encode(
            array(
                "users" => null,
                "status" => false,
                "message" => "No found found",
            )
        );
    }else 
         echo json_encode(
            array(
                "users" => $res,
                "status" => true,
                "message" => "Success to get top users!"
            )
        );

?>