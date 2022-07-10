class Loader {
    constructor(color, fadeOutDelay = 300) {
        this.color = color;
        this.fadeOutDelay = fadeOutDelay;
    }

    show() {
        if (!this.loader) {
            this.loader = document.createElement("div");
            this.loader.classList.add("loading");
            this.loaderInner = document.createElement("div");
            this.loaderInner.classList.add("loading__inner");
            for (let i = 0; i < 4; i++) {
                this.loaderInnerCircle = document.createElement("div");
                if (this.color) this.loaderInnerCircle.style.backgroundColor = this.color;
                this.loaderInner.appendChild(this.loaderInnerCircle);
            }
            this.loader.appendChild(this.loaderInner);

            this.loader.addEventListener('transitionend', () => {
                this.loader.remove();
            })
        }

        if (this.loader.classList.contains("loading--hidden")) this.loader.classList.remove("loading--hidden");

        document.body.appendChild(this.loader);
    }

    hide() {
        if (document.body.contains(this.loader)) {
            setTimeout(() => {
                this.loader.classList.add("loading--hidden");
            }, this.fadeOutDelay);
        }
    }
}

let loader = new Loader();
loader.show();