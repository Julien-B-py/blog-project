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
    $preparedRequest = $bdd->prepare("SELECT articles.image_url as img, 
    articles.title, 
    articles.content, 
    articles.creation_date, 
    categories.title as category_name, 
    users.lastname as last_name, 
    users.firstname as first_name, 
    articles.status
    FROM articles
    INNER JOIN categories ON articles.category_id=categories.id
    INNER JOIN users ON articles.owner_id=users.id
    ORDER BY `creation_date` DESC;");
} else {
    // Not admin
    $response["restricted"] = true;

    // Query
    $preparedRequest = $bdd->prepare("SELECT articles.image_url as img, 
     articles.title, 
     articles.content, 
     articles.creation_date, 
     categories.title as category_name, 
     users.lastname as last_name, 
     users.firstname as first_name, 
     articles.status
     FROM articles
     INNER JOIN categories ON articles.category_id=categories.id
     INNER JOIN users ON articles.owner_id=users.id
     WHERE articles.status = 'public'
     ORDER BY `creation_date` DESC;");
}

$preparedRequest->execute();

// PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
$results = $preparedRequest->fetchAll(PDO::FETCH_ASSOC);

foreach ($results as &$result) {
    $result["creation_date"] = date_format(date_create($result["creation_date"]), 'd/m/Y - H:i:s');
    $result["content"] = mb_strimwidth($result["content"], 0, 300, "...");
}

$response["articles"] = $results;

echo json_encode($response);

// <3