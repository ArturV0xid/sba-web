// Обработчик события для поля пароля
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", async () => {
    // Проверка валидности пароля
    if (password.value.length < 8) {
        showError(passwordError, "Пароль должен содержать не менее 8 символов");
        return; // Прерываем выполнение функции, если пароль невалидный
    }

    // Проверка совпадения паролей
    if (password.value !== confirmPassword.value) {
        showError(confirmPasswordError, "Пароли не совпадают");
        return; // Прерываем выполнение функции, если пароли не совпадают
    }

    // Очистка ошибок, если поля валидные
    hideError(passwordError);
    hideError(confirmPasswordError);

    // Получение email пользователя
    let dataEmail;
    try {
        const response = await fetch('/auth/me', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        dataEmail = data.email;
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Можно показать сообщение об ошибке, если нужно
        return;
    }

    // Отправка данных на сервер для смены пароля
    try {
        const response = await fetch('/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": dataEmail,
                "password": password.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Пароль успешно изменен, можно перенаправить пользователя куда-то
            window.location.href = "index";
        } else {
            console.error("ERROR ENTER DATA:", data.message);
            // Можно показать сообщение об ошибке, если нужно
        }
    } catch (error) {
        console.error("ERROR:", error);
        // Можно показать сообщение об ошибке, если нужно
    }
});