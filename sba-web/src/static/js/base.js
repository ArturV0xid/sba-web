const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

let termsModal = document.querySelector("#terms-modal");
let termsTrigger = document.querySelector("#terms-button");
let termsCloseButton = document.querySelector("#terms-close-button");

let helpModal = document.querySelector("#help-modal");
let helpTrigger = document.querySelector("#help-button");
let helpCloseButton = document.querySelector("#help-close-button");

let afterSendMessageModal = document.querySelector("#after-send-message-modal");
let afterSendMessageTrigger = document.querySelector("#send-message-button");
let afterSendMessageCloseButton = document.querySelector(
  "#after-send-message-close-button"
);

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
