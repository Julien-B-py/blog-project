<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Collecting form data
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $lastName = htmlspecialchars($_POST['lastname']);
    $firstName = htmlspecialchars($_POST['firstname']);
    $birthDate = htmlspecialchars($_POST['birthdate']);
    $pass = htmlspecialchars($_POST['password']);
    $confirm_pass = htmlspecialchars($_POST['passwordConfirmation']);

    if ($_POST['registerBtn'] === "S7FPrp6mpi") {

        // L'email fourni doit être valide, nous avions effectué une vérification du format email
        // lors de la vérification des variables, nous pouvons donc écrire
        // SI $email est strictement égal à FALSE, alors mauvais email
        if ($email === FALSE) {
            echo "Ceci n'est pas un email valide";
            die;
        }
        // Les mots de passe doivent correspondre
        if ($pass !== $confirm_pass) {
            echo "Les mots de passe ne correspondent pas";
            die;
        }

        if (empty($birthDate)) {
            echo "Please enter a birth date";
            die;
        }


        if ($pass !== $confirm_pass) {
            echo "Les mots de passe ne correspondent pas";
            die;
        }


        // Create connection
        // Need to uncomment extension=pdo_mysql in php.ini first
        try {
            $bdd = new PDO("mysql:host=localhost;dbname=blogproject", "root", "");
        } catch (PDOException $e) {
            die($e->getMessage());
        }

        // Query
        $preparedRequest = $bdd->prepare("INSERT INTO `users` (`mail`, `last_name`, `first_name`, `birth_date`, `password`, `is_admin`) VALUES (:email, :lastname, :firstname, :birthdate, :passw, 0)");

        $preparedRequest->bindValue(":email", $email, PDO::PARAM_STR);
        $preparedRequest->bindValue(":lastname", $lastName, PDO::PARAM_STR);
        $preparedRequest->bindValue(":firstname", $firstName, PDO::PARAM_STR);
        $preparedRequest->bindValue(":birthdate", $birthDate, PDO::PARAM_STR);
        $preparedRequest->bindValue(":passw", password_hash($pass, PASSWORD_DEFAULT), PDO::PARAM_STR);

        $result = $preparedRequest->execute();

        header("location: index.php");
    }
}
