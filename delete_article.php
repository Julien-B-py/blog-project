<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    // If user is logged and admin
    if (!empty($_SESSION) && $_SESSION['is_admin']) {

        parse_str(file_get_contents("php://input"), $delete_vars);
        $articleId = htmlspecialchars($delete_vars["ref"]);

        require_once('./db_connection.php');

        // Query
        $preparedRequest = $bdd->prepare("DELETE FROM `articles` WHERE `articles`.`id` = :articleId");

        $preparedRequest->bindValue(":articleId", $articleId, PDO::PARAM_INT);

        $result = $preparedRequest->execute();

        echo json_encode(['success' => true]);
    }
}
