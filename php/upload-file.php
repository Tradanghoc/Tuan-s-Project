<?php 
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    // http://127.0.0.1:8686/upload-file.php

    try {
        $currentDirectory = getcwd();
        $uploadDirectory = "/uploads/";
        $fileName = $_FILES['image']['name'];
        $fileTmpName  = $_FILES['image']['tmp_name'];
        $uploadPath = $currentDirectory . $uploadDirectory . basename($fileName);
        // upload file
        move_uploaded_file($fileTmpName, $uploadPath);
        echo json_encode(
            array(
                "status" => true,
                "statusText" => "Upload Image successful with id: $fileName",
                "data" => $fileName
            )
        );
    } catch (Exception $e) {
        echo json_encode(
            array(
                "status" => false,
                "statusText" => "Upload failed because of $e",
            )
        );
    }