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

        if (!notAllowed) {
            let articleDeleteIcon = document.createElement("i");
            articleDeleteIcon.classList.add("fa-solid", "fa-trash");
            articleImgDiv.appendChild(articleDeleteIcon);
        }

        // Add the article to articles container
        articlesContainer.appendChild(newArticle);
    })
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