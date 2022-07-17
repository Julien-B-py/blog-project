let loading = new Loading();
loading.show();

const connectMenuOptions = ["Se connecter", "Créer un compte"];

// const connectBtn = document.querySelector("button");
let connectBtn;

const navInner = document.querySelector(".nav__right");

let connectMenuVisible = false;

// Create a div > ul > 2*li and add it to the body
const createConnectMenu = () => {
  const connectMenu = document.createElement("div");
  connectMenu.classList.add("connect__menu", "connect__menu--hidden");

  const connectMenuList = document.createElement("ul");
  connectMenuOptions.forEach((option) => {
    const connectMenuItem = document.createElement("li");
    connectMenuItem.textContent = option;
    connectMenuList.appendChild(connectMenuItem);
  });

  connectMenu.appendChild(connectMenuList);
  document.body.appendChild(connectMenu);

  // event listener
  const connectMenuListItems = document.querySelectorAll(".connect__menu li");
  connectMenuListItems[0].addEventListener("click", (e) => {

    animateButton(e);
    createLoginModal();
    connectMenu.classList.add("connect__menu--hidden");
  });
  connectMenuListItems[1].addEventListener("click", (e) => {

    animateButton(e);
    createRegisterModal();
    connectMenu.classList.add("connect__menu--hidden");
  });
};

const registerInputs = [
  { name: "email", label: "Email", type: "email" },
  { name: "lastname", label: "Nom", type: "text" },
  { name: "firstname", label: "Prénom", type: "text" },
  { name: "birthdate", label: "Date de naissance", type: "date" },
  { name: "password", label: "Mot de passe", type: "password" },
  {
    name: "passwordConfirmation",
    label: "Confirmation mot de passe",
    type: "password",
  },
];

const loginInputs = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Mot de passe", type: "password" },
];

const createRegisterModal = () => {
  // Create a form dynamically
  let form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "./register.php");

  // Create inner form div
  let innerForm = document.createElement("div");
  innerForm.classList.add("form__inner");

  // Title
  let formTitle = document.createElement("h2");
  formTitle.textContent = "Créer un compte";
  innerForm.appendChild(formTitle);

  // Create inputs
  registerInputs.forEach((input) => {
    let emailInput = document.createElement("div");
    emailInput.classList.add("form__inner__input");
    let emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", input.name);
    emailLabel.textContent = input.label;
    emailInput.appendChild(emailLabel);
    let email = document.createElement("input");
    email.setAttribute("type", input.type);
    email.setAttribute("name", input.name);
    email.setAttribute("id", input.name);
    email.setAttribute("required", "");
    emailInput.appendChild(email);
    innerForm.appendChild(emailInput);
  });

  let button = document.createElement("button");
  button.setAttribute("name", "registerBtn");
  button.setAttribute("value", "S7FPrp6mpi");
  button.textContent = "Valider";
  button.onclick = (e) => animateButton(e);
  innerForm.appendChild(button);

  form.appendChild(innerForm);
  document.body.appendChild(form);

  document.querySelector("form").style.display = "block";
};

const submitLogin = () => {

  let existingMsg = document.querySelector('.form__error__msg');
  if (existingMsg) existingMsg.remove();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  let form = document.querySelector("form");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", form.querySelectorAll("input")[0].value);
  urlencoded.append("password", form.querySelectorAll("input")[1].value);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  fetch("./login.php", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // If failed to login
      if (result.error) displayLoginError(result.error);
      // If login successful
      else {
        sessionStorage.name = result.firstName;
        sessionStorage.lastName = result.lastName;
        location.href = "/";
      }
    })
    .catch((error) => console.log("error", error));
};

const displayLoginError = (text) => {
  let form = document.querySelector("form .form__inner");
  let p = document.createElement("p");
  p.classList.add("form__error__msg");
  p.textContent = text;
  form.insertBefore(p, document.querySelector(".form__inner button"));
};

const createLoginModal = () => {
  // Create a form dynamically
  let form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "./login.php");

  // Create inner form div
  let innerForm = document.createElement("div");
  innerForm.classList.add("form__inner");

  // Title
  let formTitle = document.createElement("h2");
  formTitle.textContent = "Se connecter";
  innerForm.appendChild(formTitle);

  // Create inputs
  loginInputs.forEach((input) => {
    let emailInput = document.createElement("div");
    emailInput.classList.add("form__inner__input");
    let emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", input.name);
    emailLabel.textContent = input.label;
    emailInput.appendChild(emailLabel);
    let email = document.createElement("input");
    email.setAttribute("type", input.type);
    email.setAttribute("name", input.name);
    email.setAttribute("id", input.name);
    email.setAttribute("required", "");
    emailInput.appendChild(email);
    innerForm.appendChild(emailInput);
  });

  let button = document.createElement("button");
  button.setAttribute("name", "registerBtn");
  button.setAttribute("value", "S7FPrp6mpi");
  button.textContent = "Valider";

  button.addEventListener("click", (e) => {
    e.preventDefault();
    animateButton(e);
    submitLogin();
  });

  innerForm.appendChild(button);

  form.appendChild(innerForm);
  document.body.appendChild(form);

  document.querySelector("form").style.display = "block";
};

const adjustElementPosition = (element, btn = 0) => {
  let connectBtnRect;
  if (!btn) {
    connectBtnRect = connectBtn.getBoundingClientRect();
  } else {
    connectBtnRect = btn.getBoundingClientRect();
  }

  let connectMenuRect = element.getBoundingClientRect();

  element.style.left = `${connectBtnRect.left - (connectMenuRect.width - connectBtnRect.width)
    }px`;
  element.style.top = `${connectBtnRect.top + connectBtnRect.height + 8}px`;
};

document.addEventListener("click", function (event) {
  let connectMenu = document.querySelector(".connect__menu");

  if (
    connectMenu &&
    !connectMenu.contains(event.target) &&
    connectMenuVisible
  ) {
    connectMenu.classList.add("connect__menu--hidden");
  }
});

// Allow the connection dropdown menu position to follow the connection button position when resizing the window
window.addEventListener("resize", () => {
  let connectMenu = document.querySelector(".connect__menu");
  if (connectMenu) adjustElementPosition(connectMenu);
});

// When the user clicks anywhere outside of the form, close it
window.onclick = (event) => {
  if (event.target == document.querySelector("form")) {
    document.querySelector("form").remove();
  }
};

window.onload = () => {
  if (sessionStorage.name) {
    let logoutBtn = document.createElement("button");
    let logoutLogo = document.createElement("i");
    logoutLogo.classList.add("fa-solid", "fa-user");
    logoutBtn.appendChild(logoutLogo);
    logoutBtn.appendChild(
      document.createTextNode(
        `${sessionStorage.name} ${sessionStorage.lastName}`
      )
    );

    navInner.appendChild(logoutBtn);



    logoutBtn.onclick = (e) => {

      animateButton(e);

      if (!document.querySelector(".connect__menu")) {
        const disconnectMenu = document.createElement("div");
        disconnectMenu.classList.add("connect__menu", "connect__menu--hidden");

        const disconnectMenuList = document.createElement("ul");
        const disconnectMenuItem = document.createElement("li");
        disconnectMenuItem.textContent = "Se déconnecter";
        disconnectMenuList.appendChild(disconnectMenuItem);
        disconnectMenu.appendChild(disconnectMenuList);

        disconnectMenuItem.onclick = (e) => {
          animateButton(e);
          // Disconnect the user
          sessionStorage.clear();

          const logoutUrl = "./logout.php";

          fetch(logoutUrl)
            .then((response) => location.reload())
            .catch(err => console.error('error:' + err));
        }

        document.body.appendChild(disconnectMenu);

        requestAnimationFrame(() => {
          disconnectMenu.classList.remove("connect__menu--hidden");
        });

        adjustElementPosition(disconnectMenu, logoutBtn);


      }



    };

  } else {
    connectBtn = document.createElement("button");
    let loginLogo = document.createElement("i");
    loginLogo.classList.add("fa-solid", "fa-user");
    connectBtn.appendChild(loginLogo);
    connectBtn.appendChild(document.createTextNode("Connexion"));

    navInner.appendChild(connectBtn);

    connectBtn.onclick = (e) => {

      animateButton(e);

      // Create menu in the DOM if it doesnt exist already
      if (!document.querySelector(".connect__menu")) createConnectMenu();

      let connectMenu = document.querySelector(".connect__menu");
      connectMenu.addEventListener("transitionend", () => {
        connectMenuVisible = true;

        if (connectMenu.classList.contains("connect__menu--hidden")) {
          connectMenuVisible = false;
          connectMenu.remove();
        }
      });

      // Hide menu if displayed
      if (!connectMenu.classList.contains("connect__menu--hidden"))
        return connectMenu.classList.add("connect__menu--hidden");

      // Otherwise display the menu
      // allow animation on element creation
      requestAnimationFrame(() => {
        connectMenu.classList.remove("connect__menu--hidden");
      });

      adjustElementPosition(connectMenu);
    };
  }
};


const animateButton = (e) => {
  // let x = e.clientX - e.currentTarget.offsetLeft;
  // let y = e.clientY - e.currentTarget.offsetTop;

  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left; //x position within the element.
  let y = e.clientY - rect.top;  //y position within the element.

  let buttonAnim = document.createElement("div");
  buttonAnim.classList.add("wave");
  buttonAnim.style.left = `${x}px`;
  buttonAnim.style.top = `${y}px`;
  e.currentTarget.appendChild(buttonAnim);

  setTimeout(() => buttonAnim.remove(), 1000);
}