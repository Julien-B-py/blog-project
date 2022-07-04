<?php
require_once('./db_connection.php');

// Query
$preparedRequest = $bdd->prepare("SELECT id, title
    FROM categories;");

$preparedRequest->execute();

// PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
$categories = $preparedRequest->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);
