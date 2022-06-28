<?php

// Create connection
// Need to uncomment extension=pdo_mysql in php.ini first
try {
    $bdd = new PDO("mysql:host=localhost;dbname=blogproject", "root", "");
} catch (PDOException $e) {
    die($e->getMessage());
}


// Query
$preparedRequest = $bdd->prepare("SELECT articles.img, articles.title, articles.content, articles.publication_date, categories.category_name, users.last_name, users.first_name, articles.status
FROM articles
INNER JOIN categories ON articles.category_id=categories.id
INNER JOIN users ON articles.user_id=users.id
ORDER BY `publication_date` DESC;");

$preparedRequest->execute();

// PDO::FETCH_ASSOC: returns an array indexed by column name as returned in your result set
$results = $preparedRequest->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog | Homepage</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
    <link rel="stylesheet" href="./assets/css/styles.css">
</head>

<body>

    <main>
        <nav>
            <div class="container nav__inner">
                <div class="nav__left">
                    <a><i class="fa-solid fa-splotch"></i></i>Blog</a>
                </div>

            </div>
        </nav>

        <div class="articles container">
            <?php foreach ($results as $result) {
                $authorName = $result['first_name'];
                $authorLastname =  $result['last_name'];
                $articleDate = date_format(date_create($result["publication_date"]), 'd/m/Y - H:i:s');
            ?>

                <article class="">
                    <div class="article__img">
                        <img src="<?= $result["img"] ?>" alt="">
                    </div>
                    <div class="article__category">
                        <?= $result["category_name"] ?>
                    </div>
                    <h2><?= $result["title"] ?></h2>
                    <p><?= mb_strimwidth($result["content"], 0, 300, "...") ?></p>
                    <div class="article__footer">
                        <div class="article__author"><i class="fa-solid fa-pen"></i><span><?= "$authorName $authorLastname" ?></span></div>
                        <div class="article__date"><i class="fa-regular fa-clock"></i><?= $articleDate ?></div>
                    </div>
                </article>
            <?php

            }
            ?>

        </div>

    </main>





    <script src="./assets/js/app.js"></script>

</body>

</html>