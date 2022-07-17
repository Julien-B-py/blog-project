/**
 * @name Alert
 * @description Informs the user and require an action. Executes a function when user selects "agree"
 * @param {function} onAgree 
 * 
 * @returns {undefined}
 */
const Alert = function (onAgree) {

    this.onAgree = onAgree;
    this.create();

}

/**
   * @name create
   * @description Creates the alert structure.
   * 
   * @returns {undefined}
  */
Alert.prototype.create = function () {
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
    this.disagreeButton.onclick = (e) => {
        animateButton(e);
        setTimeout(() => this.hide(), 200);
    };
    this.agreeButton.onclick = (e) => {
        animateButton(e);
        setTimeout(() => this.agree(), 200);
    };
    this.modalButtons.appendChild(this.disagreeButton);
    this.modalButtons.appendChild(this.agreeButton);
    this.modalContent.appendChild(this.modalTitle);
    this.modalContent.appendChild(this.modalDetail);
    this.modalContent.appendChild(this.modalButtons);
    this.modal.appendChild(this.modalContent);
}

Alert.prototype.show = function () {
    this.setText();
    document.querySelector('main').appendChild(this.modal);
}

Alert.prototype.hide = function () {
    this.modal.remove();
}

Alert.prototype.agree = function () {
    this.onAgree();
    this.hide();
}

Alert.prototype.setText = function () {
    this.articleToDeleteTitle = articles.filter(article => article.id === selectedArticle)[0].title;
    if (this.articleToDeleteTitle.length > 20) {
        this.articleToDeleteTitle = `${this.articleToDeleteTitle.slice(0, 35)} ...`;
    }
    this.span.textContent = `"${this.articleToDeleteTitle}"`;
}
