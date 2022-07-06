<?php

session_start();

// If user is logged and admin
if (!empty($_SESSION) && $_SESSION['is_admin']) {
    $currentUserId = $_SESSION['current_user'];

    $newCategory = htmlspecialchars($_POST['category']);

    require_once('./db_connection.php');

    // Query
    $preparedRequest = $bdd->prepare("INSERT INTO `categories` (`title`, `image_url`)
    VALUES (:category, NULL)");

    $preparedRequest->bindValue(":category", $newCategory, PDO::PARAM_STR);

    $result = $preparedRequest->execute();
}

header("location: index.html");
