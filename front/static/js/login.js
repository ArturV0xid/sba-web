const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    let submitButton = document.querySelector("#sign-in-button");

function checkData() {

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let emailError = document.getElementById("email-error");
  let passwordError = document.getElementById("password-error");

  if (
    email.trim().length > 0 &&
    isEmailValid(email.trim()) &&
    password.trim().length >= 8
  ) {
    emailError.textContent = "";
    passwordError.textContent = "";
    submitButton.style.border = "2px solid lightgreen";
    return true;
  } else {
    document.getElementById("password").value = "";
    emailError.textContent = "Неверный адресс или пароль";
    passwordError.textContent = "Неверный адресс или пароль";
    submitButton.style.border = "2px solid red";
    return false;
  }
}
function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}

submitButton.addEventListener("click", function () {
  if (checkData()) {
    let email = document.getElementById("email");
    email.value = "Всё хорошо, но я устал!!!";
  }
});
