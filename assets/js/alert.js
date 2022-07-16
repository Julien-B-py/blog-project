/**
 * @name Alert
 * @description Informs the user and require an action. Executes a function when user selects "agree"
 * @param {function} onAgree 
 * 
 * @returns {undefined}
 */
function Alert(onAgree) {
    this.onAgree = onAgree;

    /**
     * @name create
     * @description Creates the alert structure.
     * 
     * @returns {undefined}
    */
    this.create = () => {
        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modalContent = document.createElement("div");
        this.modalContent.classList.add("modal__content");
        this.modalTitle = document.createElement("h2");

        this.modalTitle.textContent = "Confirmer la suppression de l'article";
        this.modalDetail = document.createElement("p");
        this.modalDetail.appendChild(document.createTextNode("L'article "));
        this.span = document.createElement("span");

        this.modalDetail.appendChild(this.span);
        this.modalDetail.appendChild(document.createTextNode(" va être supprimé. Cette action est irréversible. Voulez-vous vraiment continuer ?"));
        this.modalButtons = document.createElement("div");
        this.modalButtons.classList.add("modal__buttons");
        this.disagreeButton = document.createElement("button");
        this.disagreeButton.textContent = "Annuler";
        this.agreeButton = document.createElement("button");
        this.agreeButton.textContent = "Ok";
        this.disagreeButton.onclick = () => this.hide();
        this.agreeButton.onclick = () => {
            this.agree();
        };
        this.modalButtons.appendChild(this.disagreeButton);
        this.modalButtons.appendChild(this.agreeButton);
        this.modalContent.appendChild(this.modalTitle);
        this.modalContent.appendChild(this.modalDetail);
        this.modalContent.appendChild(this.modalButtons);
        this.modal.appendChild(this.modalContent);
    }

    this.show = () => {
        this.setText();
        document.querySelector('main').appendChild(this.modal);
    }

    this.hide = () => {
        this.modal.remove();
    }

    this.agree = () => {
        this.onAgree();
        this.hide();
    }

    this.setText = () => {
        this.articleToDeleteTitle = articles.filter(article => article.id === selectedArticle)[0].title;
        if (this.articleToDeleteTitle.length > 20) {
            this.articleToDeleteTitle = `${this.articleToDeleteTitle.slice(0, 35)} ...`;
        }
        this.span.textContent = `"${this.articleToDeleteTitle}"`;
    }

    this.create();

}


