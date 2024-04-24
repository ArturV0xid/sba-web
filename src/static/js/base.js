const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const settingButton = document.querySelector("#settings-button");
const menu = document.querySelector("#menu");


const termsModal = document.querySelector("#terms-modal");
const termsTrigger = document.querySelector("#terms-button");
const termsCloseButton = document.querySelector("#terms-close-button");

const helpModal = document.querySelector("#help-modal");
const helpTrigger = document.querySelector("#help-button");
const helpCloseButton = document.querySelector("#help-close-button");

const afterSendMessageModal = document.querySelector("#after-send-message-modal");
const afterSendMessageTrigger = document.querySelector("#send-message-button");
const afterSendMessageCloseButton = document.querySelector(
  "#after-send-message-close-button"
);

let dataEmail = undefined

function checkCookie() {
  return document.cookie.indexOf("bank") !== -1;
}

// Функция для отображения элементов в зависимости от наличия куки
function toggleElements() {

  const menu = document.getElementById("menu");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const settingsButton = document.getElementById("burger-menu-button");
  if (checkCookie()) {
    settingsButton.style.display = "flex"; // Показываем кнопку-бургер
    loginLink.style.display = "none"; // Скрываем ссылку "Войти"
    registerLink.style.display = "none"; // Скрываем ссылку "Регистрация"
  } else {
    settingsButton.style.display = "none"; // Скрываем кнопку-бургер
    menu.style.display = "none"; // Скрываем меню
    loginLink.style.display = "flex"; // Показываем ссылку "Войти"
    registerLink.style.display = "flex"; // Показываем ссылку "Регистрация"
  }

  fetch('/auth/me', {
  method: 'GET',
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  dataEmail = data.email;
  document.getElementById("settings-email").innerText = dataEmail;
})
.catch(error => {
  console.error('There has been a problem with your fetch operation:', error);
});

}
// Вызываем функцию при загрузке страницы
window.onload = toggleElements;


function termsToggleModal() {
  termsModal.classList.toggle("show-modal");
}

function helpToggleModal() {
  helpModal.classList.toggle("show-modal");
}

function afterSendMessageToggleModal() {
  let email = document.getElementById("send-email");
  let text = document.getElementById("send-text");
  let thema = document.getElementById("send-thema");

  if (
    email.value.trim().length > 0 &&
    isEmailValid(email.value.trim()) &&
    text.value.trim().length > 0 &&
    thema.value.trim().length > 0
  ) {
    document.getElementById("send-email-error").textContent = "";
    document.getElementById("send-thema-error").textContent = "";
    document.getElementById("send-text-error").textContent = "";
    afterSendMessageModal.classList.toggle("show-modal");
  } else {
    if (email.value.trim().length === 0 || !isEmailValid(email.value.trim())) {
      document.getElementById("send-email-error").textContent =
        "Неверный адресс";
    } else {
      document.getElementById("send-email-error").textContent = "";
    }
    if (thema.value.trim().length === 0) {
      document.getElementById("send-thema-error").textContent = "Пустая тема";
    } else {
      document.getElementById("send-thema-error").textContent = "";
    }
    if (text.value.trim().length === 0) {
      document.getElementById("send-text-error").textContent = "Пустой текст";
    } else {
      document.getElementById("send-text-error").textContent = "";
    }
  }
}

function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}

function windowOnClick(event) {

  if (event.target === termsModal) {
    termsToggleModal();
  }
  if (event.target === helpModal) {
    helpToggleModal();
  }
  if (event.target === afterSendMessageModal) {
    afterSendMessageToggleModal();
  }
}

termsTrigger.addEventListener("click", termsToggleModal);
termsCloseButton.addEventListener("click", termsToggleModal);

helpTrigger.addEventListener("click", helpToggleModal);
helpCloseButton.addEventListener("click", helpToggleModal);

afterSendMessageTrigger.addEventListener("click", afterSendMessageToggleModal);
afterSendMessageCloseButton.addEventListener(
  "click",
  afterSendMessageToggleModal
);

window.addEventListener("click", windowOnClick);

document.getElementById("burger-menu-button").addEventListener("click", function() {

  const menu = document.getElementById("menu");

  if (menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
});


function goToWork() {
  window.location.href = "work";
}


function goToChangePassword() {
  window.location.href = "change-password";
}

function logOut() {

  fetch('/auth/logout', {
  method: 'POST',
})
.then(response => {
    if (response.ok) {
        window.location.href = "index";
    }
    else {
        window.location.href = "index";
    }

})
.catch(error => {

});

}