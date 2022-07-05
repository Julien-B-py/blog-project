const articlesContainer = document.querySelector(".articles");

const articlesUrl = "./articles.php";
const articleCategoriesUrl = "./categories.php";

const newArticleInputs = [
    { name: "title", label: "Titre", type: "text" },
    { name: "content", label: "Contenu", type: "text" },
    { name: "img", label: "Image", type: "text" },
];

const newArticleSelects = [{ name: "category", label: "Catégorie" },
{ name: "status", label: "Statut" }];

let articles;
let notAllowed;

let articleCategories;
let selectedArticle;

fetch(articleCategoriesUrl)
    .then((response) => response.json())
    .then((data) => articleCategories = data)
    .catch(err => console.error('error:' + err));

fetch(articlesUrl)
    .then((response) => response.json())
    .then((data) => {

        articles = data.articles;
        notAllowed = data.restricted;
        createArticles();
        createAddArticleButton();

    })
    .catch(err => console.error('error:' + err));


const createArticles = () => {

    // Remove all existing articles if they exist before refreshing the display
    const existingArticles = document.querySelectorAll("article");
    if (existingArticles) {
        existingArticles.forEach(article => article.remove());
    }

    articles.forEach(article => {
        // Create a new article
        let newArticle = document.createElement("article");

        // Create article image
        let articleImgDiv = document.createElement("div");
        articleImgDiv.classList.add("article__img");
        let articleImg = document.createElement("img");
        articleImg.src = article.img;
        articleImgDiv.appendChild(articleImg);
        newArticle.appendChild(articleImgDiv);

        // Create article category tag
        let articleCategoryDiv = document.createElement("div");
        articleCategoryDiv.classList.add("article__category");
        articleCategoryDiv.textContent = article.category_name;
        newArticle.appendChild(articleCategoryDiv);

        // Create article title
        let articleTitle = document.createElement("h2");
        articleTitle.textContent = article.title;
        newArticle.appendChild(articleTitle);

        // Create article content preview
        let articleContent = document.createElement("p");
        articleContent.textContent = article.content;
        newArticle.appendChild(articleContent);

        // Create article user interactions (likes / comments)
        let articleSocial = document.createElement("div");
        articleSocial.classList.add("article__social");
        let articleLikes = document.createElement("div");
        articleLikes.classList.add("article__likes");
        let articleLikesIcon = document.createElement("i");
        articleLikesIcon.classList.add("fa-solid", "fa-thumbs-up");
        articleLikes.appendChild(articleLikesIcon);
        let articleComments = document.createElement("div");
        articleComments.classList.add("article__comments");
        let articleCommentsIcon = document.createElement("i");
        articleCommentsIcon.classList.add("fa-solid", "fa-comment");
        articleComments.appendChild(articleCommentsIcon);
        articleSocial.appendChild(articleLikes);
        articleSocial.appendChild(articleComments);
        newArticle.appendChild(articleSocial);

        // Create article footer (author / date)
        let articleFooter = document.createElement("div");
        articleFooter.classList.add("article__footer");
        let articleAuthor = document.createElement("div");
        articleAuthor.classList.add("article__author");
        let articleAuthorIcon = document.createElement("i");
        articleAuthorIcon.classList.add("fa-solid", "fa-pen");
        let articleAuthorText = document.createElement("span");
        articleAuthorText.textContent = `${article.first_name} ${article.last_name}`;
        articleAuthor.appendChild(articleAuthorIcon);
        articleAuthor.appendChild(articleAuthorText);
        // Add logo close to username to display admin rank
        if (article.user_admin) {
            let articleAuthorAdmin = document.createElement("i");
            articleAuthorAdmin.classList.add("fa-solid", "fa-circle-check");
            articleAuthor.appendChild(articleAuthorAdmin);
        }
        articleFooter.appendChild(articleAuthor);
        let articleDate = document.createElement("div");
        articleDate.classList.add("article__date");
        let articleDateIcon = document.createElement("i");
        articleDateIcon.classList.add("fa-regular", "fa-clock");
        let articleDateText = document.createTextNode(article.creation_date);
        articleDate.appendChild(articleDateIcon);
        articleDate.appendChild(articleDateText);
        articleFooter.appendChild(articleDate);
        newArticle.appendChild(articleFooter);

        // Delete article button
        if (!notAllowed) {
            let articleDeleteIcon = document.createElement("i");
            articleDeleteIcon.classList.add("fa-solid", "fa-trash");
            articleImgDiv.appendChild(articleDeleteIcon);
            articleDeleteIcon.onclick = () => {
                selectedArticle = article.id;
                createDeleteModal();
            };
        }

        // Add the article to articles container
        articlesContainer.appendChild(newArticle);
    })
}

const createDeleteModal = () => {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    let modalContent = document.createElement("div");
    modalContent.classList.add("modal__content");
    let modalTitle = document.createElement("h2");
    modalTitle.textContent = "Confirmer la suppression de l'article";
    let modalDetail = document.createElement("p");
    modalDetail.textContent = "Cette action est irréversible. Voulez-vous vraiment continuer ?"
    let modalButtons = document.createElement("div");
    modalButtons.classList.add("modal__buttons");
    let disagreeButton = document.createElement("button");
    disagreeButton.textContent = "Annuler";
    let agreeButton = document.createElement("button");
    agreeButton.textContent = "Ok";
    disagreeButton.onclick = () => modal.remove();
    agreeButton.onclick = () => {
        deleteArticle();
        modal.remove();
    };
    modalButtons.appendChild(disagreeButton);
    modalButtons.appendChild(agreeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalDetail);
    modalContent.appendChild(modalButtons);
    modal.appendChild(modalContent);
    document.querySelector('main').appendChild(modal);
}

const deleteArticle = () => {

    // Postman
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("ref", selectedArticle);

    var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
    };

    fetch("./delete_article.php", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            if (result?.success) {
                articles = articles.filter(article => article.id != selectedArticle);
                createArticles();
            }
        })
        .catch((error) => console.log("error", error));

}


const createAddArticleButton = () => {
    if (notAllowed) return;
    let addArticleBtn = document.createElement("button");
    addArticleBtn.classList.add("add__article__btn");
    let addArticleBtnIcon = document.createElement("i");
    addArticleBtnIcon.classList.add("fa-solid", "fa-pen");
    addArticleBtn.appendChild(addArticleBtnIcon);
    document.querySelector('main').appendChild(addArticleBtn);

    addArticleBtn.addEventListener("click", () => createNewArticleModal());

}

const createNewArticleModal = () => {
    // Create a form dynamically
    let form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "./add_article.php");

    // Create inner form div
    let innerForm = document.createElement("div");
    innerForm.classList.add("form__inner");

    // Title
    let formTitle = document.createElement("h2");
    formTitle.textContent = "Publier un article";
    innerForm.appendChild(formTitle);

    // Create inputs
    newArticleInputs.forEach((input) => {
        let newInputDiv = document.createElement("div");
        newInputDiv.classList.add("form__inner__input");
        let newInputLabel = document.createElement("label");
        newInputLabel.setAttribute("for", input.name);
        newInputLabel.textContent = input.label;
        newInputDiv.appendChild(newInputLabel);
        let newInput = document.createElement("input");
        newInput.setAttribute("type", input.type);
        newInput.setAttribute("name", input.name);
        newInput.setAttribute("id", input.name);
        newInput.setAttribute("required", "");
        newInputDiv.appendChild(newInput);
        innerForm.appendChild(newInputDiv);
    });

    // Create selects
    newArticleSelects.forEach((select, index) => {
        let selectLabel = document.createElement("label");
        selectLabel.textContent = select.label;
        let newSelect = document.createElement("select");
        newSelect.name = select.name;

        if (index === 0) {
            articleCategories.forEach((category) => {
                let option = document.createElement("option");
                option.value = category.id;
                option.text = category.title;
                newSelect.add(option, null);
            });
        } else {
            ['public', 'member', 'draft'].forEach((status) => {
                let option = document.createElement("option");
                option.value = status;
                option.text = status.charAt(0).toUpperCase() + status.slice(1);
                newSelect.add(option, null);
            })
        }


        innerForm.appendChild(selectLabel);
        innerForm.appendChild(newSelect);
    })

    let button = document.createElement("button");
    button.setAttribute("name", "registerBtn");
    button.setAttribute("value", "S7FPrp6mpi");
    button.textContent = "Valider";
    innerForm.appendChild(button);

    form.appendChild(innerForm);
    document.body.appendChild(form);

    document.querySelector("form").style.display = "block";
}