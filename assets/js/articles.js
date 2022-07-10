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



fetch(articlesUrl)
    .then((response) => response.json())
    .then((data) => {

        articles = data.articles;
        // console.log(articles)
        notAllowed = data.restricted;
        createArticles();
        createAddArticleButton();
        loader.hide();

    })
    .catch(err => {
        displaySnackbar({ snackbarType: "error", snackbarMsg: "Server error !" });
        loader.hide();
    });

fetch(articleCategoriesUrl)
    .then((response) => response.json())
    .then((data) => articleCategories = data)
    .catch(err => {
        displaySnackbar({ snackbarType: "error", snackbarMsg: "Server error !" });
        loader.hide();
    });


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
        articleLikes.appendChild(document.createTextNode(`${article.liking_users}`));
        let articleComments = document.createElement("div");
        articleComments.classList.add("article__comments");
        let articleCommentsIcon = document.createElement("i");
        articleCommentsIcon.classList.add("fa-solid", "fa-comment");
        articleComments.appendChild(articleCommentsIcon);
        articleComments.appendChild(document.createTextNode("0"));
        articleSocial.appendChild(articleLikes);
        articleSocial.appendChild(articleComments);
        articleImgDiv.appendChild(articleSocial);

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

        // If article is liked by user color thumbs up in blue
        if (article.liked) {
            articleLikes.classList.add("article__liked");
        }

        // LIKE
        articleLikes.onclick = (e) => {
            if (articleLikes.classList.contains("article__liked")) {
                dislikeArticle(e, article.id);
                return;
            }
            likeArticle(e, article.id);
        };

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
    let articleToDeleteTitle = articles.filter(article => article.id === selectedArticle)[0].title;
    if (articleToDeleteTitle.length > 20) {
        articleToDeleteTitle = `${articleToDeleteTitle.slice(0, 35)} ...`;
    }

    modalTitle.textContent = "Confirmer la suppression de l'article";
    let modalDetail = document.createElement("p");
    modalDetail.appendChild(document.createTextNode("L'article "));
    let span = document.createElement("span");
    span.textContent = `"${articleToDeleteTitle}"`;
    modalDetail.appendChild(span);
    modalDetail.appendChild(document.createTextNode(" va être supprimé. Cette action est irréversible. Voulez-vous vraiment continuer ?"));
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
                displaySnackbar({ snackbarMsg: "Article supprimé avec succès." })
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

    // Create inner form div
    let innerForm = document.createElement("div");
    innerForm.classList.add("form__inner");

    form.appendChild(innerForm);
    document.body.appendChild(form);
    document.querySelector("form").style.display = "block";

    // Create tabs container
    let tabsContainer = document.createElement("div");
    tabsContainer.classList.add("form__inner__tabs");
    let tabsContainerButtons = document.createElement("div");
    tabsContainerButtons.classList.add("form__inner__tabs__buttons");
    tabsContainer.appendChild(tabsContainerButtons);
    innerForm.appendChild(tabsContainer);

    // Create tabs buttons
    ["Article", "Catégorie"].forEach((button, index) => {
        let tabsButton = document.createElement("button");
        tabsButton.textContent = button;
        if (index === 0) {
            tabsButton.classList.add("selected");
        }
        tabsButton.onclick = (e) => {
            e.preventDefault();
            moveIndicator(index);
        }
        tabsContainerButtons.appendChild(tabsButton);
    });

    // Create selected tab indicator
    let tabIndicator = document.createElement("span");
    let firstTabButtonWidth = document.querySelectorAll(".form__inner__tabs__buttons button")[0].offsetWidth;
    tabIndicator.style.width = `${firstTabButtonWidth}px`;
    tabsContainer.appendChild(tabIndicator);

    createNewArticleTab();

}

const dislikeArticle = (e, articleId) => {
    let clickedLikeDiv = e.target.closest('.article__likes');

    let header = new Headers();
    header.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("id", articleId);

    var requestOptions = {
        method: 'POST',
        headers: header,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("unlike_article.php", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Change color to white and decrement article likes count
                clickedLikeDiv.classList.remove("article__liked");
                var likesCount = clickedLikeDiv.childNodes[1].nodeValue
                clickedLikeDiv.childNodes[1].nodeValue = Number(likesCount) - 1;

            }
        })
        .catch(error => console.log('error', error));
}

const likeArticle = (e, articleId) => {
    let clickedLikeDiv = e.target.closest('.article__likes');

    let header = new Headers();
    header.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("id", articleId);

    var requestOptions = {
        method: 'POST',
        headers: header,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("like_article.php", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // Change color to blue and increment article likes count
                clickedLikeDiv.classList.add("article__liked");
                var likesCount = clickedLikeDiv.childNodes[1].nodeValue
                clickedLikeDiv.childNodes[1].nodeValue = Number(likesCount) + 1;
            }
        })
        .catch(error => console.log('error', error));
}



const moveIndicator = (btnIndex) => {
    let tabIndicator = document.querySelector(".form__inner__tabs span");
    let tabsButtons = document.querySelectorAll(".form__inner__tabs__buttons button");
    let clickedButton = tabsButtons[btnIndex];
    let clickedTabButtonWidth = clickedButton.offsetWidth;
    let clickedTabXPosition = 0;
    for (let i = 0; i < btnIndex; i++) {
        clickedTabXPosition = clickedTabXPosition + tabsButtons[btnIndex - 1].offsetWidth;
    }
    tabIndicator.style.width = `${clickedTabButtonWidth}px`;
    tabIndicator.style.left = `${clickedTabXPosition}px`;
    tabsButtons.forEach(button => {
        if (button.classList.contains("selected")) {
            button.classList.remove("selected");
        }
    })
    clickedButton.classList.add("selected");

    if (btnIndex === 0) createNewArticleTab();
    if (btnIndex === 1) createNewCategoryTab();

}


const createNewArticleTab = () => {
    let innerForm = document.querySelector(".form__inner");
    let form = document.querySelector("form");
    form.setAttribute("action", "./add_article.php");

    // Clear the form
    while (innerForm.childNodes.length > 1) {
        innerForm.removeChild(innerForm.lastChild);
    }

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
        let newInputDiv = document.createElement("div");
        newInputDiv.classList.add("form__inner__input");
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


        newInputDiv.appendChild(selectLabel);
        newInputDiv.appendChild(newSelect);
        innerForm.appendChild(newInputDiv);
    })

    let button = document.createElement("button");
    button.setAttribute("name", "registerBtn");
    button.setAttribute("value", "S7FPrp6mpi");
    button.textContent = "Valider";
    innerForm.appendChild(button);
}


createNewCategoryTab = () => {
    let innerForm = document.querySelector(".form__inner");
    let form = document.querySelector("form");
    form.setAttribute("action", "./add_category.php");

    // Clear the form
    while (innerForm.childNodes.length > 1) {
        innerForm.removeChild(innerForm.lastChild);
    }

    // Title
    let formTitle = document.createElement("h2");
    formTitle.textContent = "Créer une catégorie";
    innerForm.appendChild(formTitle);

    // Create input
    let newInputDiv = document.createElement("div");
    newInputDiv.classList.add("form__inner__input");
    let newInputLabel = document.createElement("label");
    newInputLabel.setAttribute("for", "category");
    newInputLabel.textContent = "Catégorie";
    newInputDiv.appendChild(newInputLabel);
    let newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("name", "category");
    newInput.setAttribute("id", "category");
    newInput.setAttribute("required", "");
    newInputDiv.appendChild(newInput);
    innerForm.appendChild(newInputDiv);

    let button = document.createElement("button");
    button.setAttribute("name", "registerBtn");
    button.setAttribute("value", "S7FPrp6mpi");
    button.textContent = "Valider";
    innerForm.appendChild(button);
}

/*
|
|   SNACKBAR 
|
*/
const snackbarTypes = {
    "success": "fa-check",
    "error": "fa-circle-exclamation",
    "warning": "fa-triangle-exclamation"
};

// Give notifications to the user
const displaySnackbar = ({ closingDelay = 3000, snackbarType = "success", snackbarMsg } = {}) => {

    // Check if one feedback exists already
    // If so interrupt to not stack them
    if (document.querySelector(".feedback")) {
        return;
    }

    // If not existing create a div with feedback class
    let snackbar = document.createElement("div");
    snackbar.classList.add("snackbar", `snackbar--${snackbarType}`);
    // Add icon and text to the div and add the whole element to the document body
    let snackbarIcon = document.createElement("i");
    snackbar.appendChild(snackbarIcon);
    let snackbarText = document.createTextNode(snackbarMsg);
    snackbar.appendChild(snackbarText);

    // Depending on requested snackbar type : change icon and background color
    snackbarIcon.classList.add("fa-solid", snackbarTypes[snackbarType]);

    document.body.appendChild(snackbar);

    // Slide in animation
    gsap.to(".snackbar", { bottom: '24px' });

    // Slide out animation then remove the element from the DOM after specified delay
    setTimeout(() => {
        gsap.to(".snackbar", { bottom: '-60px', onComplete: () => snackbar.remove() });
    }, closingDelay);

}