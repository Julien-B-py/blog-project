<?php
require_once('./db_connection.php');

// Query
$preparedRequest = $bdd->prepare("SELECT categories.title, COUNT(*) as count
FROM `articles`
LEFT JOIN categories ON articles.category_id=categories.id
GROUP BY categories.title
ORDER BY count DESC, categories.title;");

$preparedRequest->execute();

// PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
$categories = $preparedRequest->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);
