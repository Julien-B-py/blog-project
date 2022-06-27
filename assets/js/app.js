const connectMenuOptions = ["Se connecter", "Créer un compte"];

const connectBtn = document.querySelector("button");

let connectMenuVisible = false;

// Create a div > ul > 2*li and add it to the body
const createConnectMenu = () => {
    const connectMenu = document.createElement("div");
    connectMenu.classList.add("connect__menu", "connect__menu--hidden");

    const connectMenuList = document.createElement("ul");
    connectMenuOptions.forEach(option => {
        const connectMenuItem = document.createElement("li");
        connectMenuItem.textContent = option;
        connectMenuList.appendChild(connectMenuItem);
    })

    connectMenu.appendChild(connectMenuList);
    document.body.appendChild(connectMenu);
}

connectBtn.onclick = () => {

    // Create menu in the DOM if it doesnt exist already
    if (!document.querySelector(".connect__menu")) createConnectMenu();

    connectMenu = document.querySelector(".connect__menu");
    connectMenu.addEventListener("transitionend", () => {

        connectMenuVisible = true;

        if (connectMenu.classList.contains("connect__menu--hidden")) {
            connectMenuVisible = false;
            connectMenu.remove();
        }
    });

    // Hide menu if displayed
    if (!connectMenu.classList.contains("connect__menu--hidden")) return connectMenu.classList.add("connect__menu--hidden");

    // Otherwise display the menu
    // allow animation on element creation
    requestAnimationFrame(() => {
        connectMenu.classList.remove("connect__menu--hidden");
    })

    let connectBtnRect = connectBtn.getBoundingClientRect();
    let connectMenuRect = connectMenu.getBoundingClientRect();

    connectMenu.style.left = `${connectBtnRect.left - (connectMenuRect.width - connectBtnRect.width)}px`;
    connectMenu.style.top = `${connectBtnRect.top + connectBtnRect.height + 8}px`;

}

document.addEventListener('click', function (event) {
    let connectMenu = document.querySelector(".connect__menu");

    if (connectMenu && !connectMenu.contains(event.target) && connectMenuVisible) {
        connectMenu.classList.add("connect__menu--hidden");
    }

});