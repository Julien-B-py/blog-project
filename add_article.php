<?php

session_start();

// If user is logged and admin
if (!empty($_SESSION) && $_SESSION['is_admin']) {
    $currentUserId = $_SESSION['current_user'];

    $articleTitle = htmlspecialchars($_POST['title']);
    $articleContent = htmlspecialchars($_POST['content']);
    $articleImage = htmlspecialchars($_POST['img']);
    $articleCategoryId = $_POST['category'];
    $articleStatus = $_POST['status'];

    require_once('./db_connection.php');

    // Query
    $preparedRequest = $bdd->prepare("INSERT INTO `articles` (`owner_id`, `category_id`, `title`, `content`, `image_url`, `creation_date`, `status`)
    VALUES (:userId, :categoryId, :title, :content, :imgUrl, now(), :status)");

    $preparedRequest->bindValue(":userId", $currentUserId, PDO::PARAM_INT);
    $preparedRequest->bindValue(":categoryId", $articleCategoryId, PDO::PARAM_INT);
    $preparedRequest->bindValue(":title", $articleTitle, PDO::PARAM_STR);
    $preparedRequest->bindValue(":content", $articleContent, PDO::PARAM_STR);
    $preparedRequest->bindValue(":imgUrl", $articleImage, PDO::PARAM_STR);
    $preparedRequest->bindValue(":status", $articleStatus, PDO::PARAM_STR);

    $result = $preparedRequest->execute();
}

header("location: index.html");
