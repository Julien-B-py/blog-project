<?php

// Vérification de la présence d'un enregistreent
if (!empty($_POST)) {

    // Connexion à la base de données pour rechercher le mot de passe haché atteribué 
    // à l'emeil renseigné
    require_once('./db_connection.php');

    $query = $bdd->prepare("SELECT id, lastname, firstname, birthdate, password, is_admin FROM `users` WHERE mail = ?");
    $query->execute(array($_POST['email']));

    // PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
    $user = $query->fetch(PDO::FETCH_ASSOC);


    // If email doesnt exist
    // or password doesnt match
    if (!$user || !password_verify($_POST['password'], $user['password'])) {
        echo json_encode(['error' => "Email ou mot de passe incorrect"]);
    } else {

        // start a session
        session_start();
        // initialize session variables
        $_SESSION['is_admin'] = $user["is_admin"];
        $_SESSION['current_user'] = $user["id"];

        echo json_encode(['firstName' => $user["firstname"], 'lastName' => $user["lastname"]]);
    }
}
