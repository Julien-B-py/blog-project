<?php

session_start();

$adminUser = NULL;

if (!empty($_SESSION)) {
    $adminUser = $_SESSION["is_admin"];
}

require_once('./db_connection.php');

$response = [];

// Admin
if ($adminUser) {

    // Query
    $preparedRequest = $bdd->prepare("SELECT 
    articles.id,
    articles.image_url as img, 
    articles.title, 
    articles.content, 
    articles.creation_date, 
    categories.title as category_name, 
    users.lastname as last_name, 
    users.firstname as first_name, 
    users.is_admin as user_admin,
    articles.status,
    GROUP_CONCAT(user_id) likes_users_ids
    FROM articles
    LEFT JOIN categories ON articles.category_id=categories.id
    LEFT JOIN users ON articles.owner_id=users.id
    LEFT JOIN likes ON likes.article_id = articles.id
    GROUP BY articles.id
    ORDER BY `creation_date` DESC;");
} else {
    // Not admin
    $response["restricted"] = true;

    // Query
    $preparedRequest = $bdd->prepare("SELECT
     articles.id,
     articles.image_url as img, 
     articles.title, 
     articles.content, 
     articles.creation_date, 
     categories.title as category_name, 
     users.lastname as last_name, 
     users.firstname as first_name, 
     users.is_admin as user_admin,
     articles.status,
     GROUP_CONCAT(user_id) likes_users_ids
     FROM articles
     LEFT JOIN categories ON articles.category_id=categories.id
     LEFT JOIN users ON articles.owner_id=users.id
     LEFT JOIN likes ON likes.article_id = articles.id
     WHERE articles.status = 'public'
     GROUP BY articles.id
     ORDER BY `creation_date` DESC;");
}

$preparedRequest->execute();

// PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
$articles = $preparedRequest->fetchAll(PDO::FETCH_ASSOC);

// Loop through all articles to edit the array
foreach ($articles as &$article) {
    // Format date for display
    $article["creation_date"] = date_format(date_create($article["creation_date"]), 'd/m/Y - H:i:s');
    // Truncate article content to create a text preview
    $article["content"] = mb_strimwidth($article["content"], 0, 300, "...");

    // If article has no like
    if (!$article["likes_users_ids"]) {
        $article["liking_users"] = 0;
    } else {
        $allLikes = explode(",", $article["likes_users_ids"]);
        // If user is logged in => check if article is liked
        if (!empty($_SESSION) && $_SESSION['current_user']) {
            $article["liked"] = in_array($_SESSION['current_user'], $allLikes);
        }
        // Count how many users liked the article
        $article["liking_users"] = count($allLikes);
    }

    unset($article["likes_users_ids"]);
}

$response["articles"] = $articles;

echo json_encode($response);

// <3