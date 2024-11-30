<?php 

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'connection.php';

try {
    $query = "SELECT reports.*, users.Name as UserName from reports 
    INNER JOIN users ON reports.Author = users.Id 
    INNER JOIN foods ON reports.TargetID = foods.Id
    WHERE reports.Status != 'Done' ORDER BY reports.CreateAt DESC";
    $stmt = $dbConn->prepare($query);
    $stmt->execute();
    $reportErrors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($reportErrors as $key => $report) {
        $query = "SELECT foods.Name as TargetName FROM reports 
        INNER JOIN foods ON reports.TargetID = foods.Id
        WHERE reports.Id = :id";
        $stmt = $dbConn->prepare($query);
        $stmt->bindParam(':id', $report['Id']);
        $stmt->execute();
        $targetName = $stmt->fetch(PDO::FETCH_ASSOC);
        $reportErrors[$key]['TargetName'] = $targetName ? $targetName['TargetName'] : '';
    }
    echo json_encode($reportErrors);
} catch (Exception $e) {
    echo json_encode(array("message" => "Lỗi tìm lỗi báo cáo bởi vì $e"));
}

?>