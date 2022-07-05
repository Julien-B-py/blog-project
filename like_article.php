<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $userId = $_SESSION['current_user'];

    if (!$userId) {
        echo json_encode(['failure' => "You need to be logged in"]);
        return;
    }

    $postId = $_POST["id"];

    require_once('./db_connection.php');

    $preparedRequest = $bdd->prepare("INSERT INTO `likes` (`user_id`, `article_id`) VALUES (:userId, :articleId)");

    $preparedRequest->bindValue(":userId", $userId, PDO::PARAM_INT);
    $preparedRequest->bindValue(":articleId", $postId, PDO::PARAM_INT);

    $preparedRequest->execute();

    echo json_encode(['success' => true]);
}
