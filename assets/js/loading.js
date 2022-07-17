/**
 * @name Loading
 * @description Loading animation to let the user know something is happening in background.
 * @param {string} color 
 * @param {number} fadeOutDelay 
 * 
 * @returns {undefined}
 */
const Loading = function (color, fadeOutDelay = 300) {

    this.color = color;
    this.fadeOutDelay = fadeOutDelay;
    this.create();

};

/**
 * @name create
 * @description Creates the loading animation structure.
 * 
 * @returns {undefined}
*/
Loading.prototype.create = function () {
    // If loading <div> has not been created yet
    if (!this.loading) {
        // Create loading <div> and all required childrens
        this.loading = document.createElement("div");
        this.loading.classList.add("loading");
        this.loadingInner = document.createElement("div");
        this.loadingInner.classList.add("loading__inner");
        for (let i = 0; i < 4; i++) {
            this.loadingInnerCircle = document.createElement("div");
            // Set custom color if specified
            if (this.color) this.loadingInnerCircle.style.backgroundColor = this.color;
            this.loadingInner.appendChild(this.loadingInnerCircle);
        }
        this.loading.appendChild(this.loadingInner);
    }
};

/**
   * @name show
   * @description Displays the loading animation.
   * 
   * @returns {undefined}
   */
Loading.prototype.show = function () {
    // If the loading <div> has the class hidden, remove it
    this.loading.classList.contains("loading--hidden") && this.loading.classList.remove("loading--hidden");
    // Add loading <div> to document body to make it visible
    document.body.appendChild(this.loading);
};

/**
 * @name hide
 * @description Hides the loading animation if visible.
 * 
 * @returns {undefined}
 */
Loading.prototype.hide = function () {
    // Check if the animation <div> is in the body
    if (document.body.contains(this.loading)) {
        // If ontransitionend is not set already, we set it so the loading <div> is removed from the DOM after it has faded out.
        if (!this.loading.ontransitionend) this.loading.ontransitionend = () => this.loading.remove();
        // Fade out the loading <div> after a preset amount of time
        setTimeout(() => this.loading.classList.add("loading--hidden"), this.fadeOutDelay);
    }
};