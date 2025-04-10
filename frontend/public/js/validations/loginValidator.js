const userLogin = {
	password: "",
	email: "",
};

//Seleccionando elementos
const password = document.querySelector(".form__input--password");
const email = document.querySelector(".form__input--email");
const form = document.querySelector(".form__container--login");

//inputs
form.addEventListener("input", readText);
email.addEventListener("input", readText);
password.addEventListener("input", readText);

//Evento submit
form.addEventListener("submit", function (e) {
	e.preventDefault();
	const { email, password } = userLogin;

	if (email === "" || password === "") {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}

	if (!validarEmail(email)) {
		showAlert("El correo no es válido", true);
		return;
	}

	showAlert("Tus datos han sido enviados satisfactoriamente");

	setTimeout(() => {
		window.location.href = "home.html"; // Asegúrate de que la ruta sea correcta
	}, 1000);
});

// Esta funcion valida que sea un correo y que cumpla con el formato de uno
function validarEmail(email) {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(email);
}

function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;

	if (error) {
		alert.classList.add("error");
	} else {
		alert.classList.add("correct");
	}
	form.appendChild(alert);

	setTimeout(() => {
		alert.remove();
	}, 5000);
}

//Callback o funcion
function readText(e) {
	if (e.target.classList.contains("form__input--email")) {
        userLogin.email = e.target.value.trim(); // Actualizar el valor del correo
    } else if (e.target.classList.contains("form__input--password")) {
        userLogin.password = e.target.value.trim(); // Actualizar el valor de la contraseña
    }
	console.log(userLogin);
}
