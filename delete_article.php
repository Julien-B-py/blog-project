<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    // If user is logged and admin
    if (!empty($_SESSION) && $_SESSION['is_admin']) {

        parse_str(file_get_contents("php://input"), $delete_vars);
        $articleId = htmlspecialchars($delete_vars["ref"]);

        require_once('./db_connection.php');

        // 1st Query : delete associated likes first to prevent constraint error due to article_id foreign key
        $preparedRequest = $bdd->prepare("DELETE FROM `likes` WHERE `article_id` = :articleId");
        $preparedRequest->bindValue(":articleId", $articleId, PDO::PARAM_INT);
        if (!$preparedRequest->execute()) {
            echo json_encode(['failure' => "Server error"]);
            return;
        }

        // 2nd Query : delete the article itself
        $preparedRequest = $bdd->prepare("DELETE FROM `articles` WHERE `articles`.`id` = :articleId");

        $preparedRequest->bindValue(":articleId", $articleId, PDO::PARAM_INT);

        if (!$preparedRequest->execute()) {
            echo json_encode(['failure' => "Server error"]);
            return;
        }

        echo json_encode(['success' => true]);
    }
}
