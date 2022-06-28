<?php
// Vérification de la présence d'un enregistreent
if (!empty($_POST)) {

    // Connexion à la base de données pour rechercher le mot de passe haché atteribué 
    // à l'emeil renseigné
    try {
        $db = new PDO(
            'mysql:host=localhost;dbname=blogproject',
            'root',
            ''
        );

        $query = $db->prepare("SELECT last_name, first_name, birth_date, password, is_admin FROM `users` WHERE mail = ?");
        $query->execute(array($_POST['email']));

        // PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
        $user = $query->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo "<p>Erreur d'enregistrement, contacter l'administrateur du site</p>";
        echo $e;
    }

    // If email doesnt exist
    // or password doesnt match
    if (!$user || !password_verify($_POST['password'], $user['password'])) {
        echo json_encode(['error' => "Email ou mot de passe incorrect"]);
    } else {
        echo json_encode(['firstName' => $user["first_name"], 'lastName' => $user["last_name"]]);
    }
}
