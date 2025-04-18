const recuperar = {
	emailRecuperar: "",
};

const emailRecuperar = document.querySelector("#emailRecuperar");
const form = document.querySelector(".form--forget");

form.addEventListener("input", readText);
emailRecuperar.addEventListener("input", readText);

// Evento submit
form.addEventListener("submit", function (e) {
	e.preventDefault();
	const { emailRecuperar } = recuperar;

	if (emailRecuperar === "") {
		showAlert("Este campo es obligatorio", true);
		return;
	}

	if (!validarEmail(emailRecuperar)) {
		showAlert("El correo no es válido", true);
		return;
	}

	showAlert("Tu correo ha sido enviado satisfactoriamente");

	setTimeout(() => {
		window.location.href = "login-codigo-recuperar.html";
	}, 1000);
});

function validarEmail(emailRecuperar) {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(emailRecuperar);
}

function showAlert(message, error = null) {
	const alert = document.createElement("p");
	alert.textContent = message;
	alert.classList.add("form__alert");

	if (error) {
		alert.classList.add("form__alert--error");
	} else {
		alert.classList.add("form__alert--success");
	}

	form.appendChild(alert);

	setTimeout(() => {
		alert.remove();
	}, 5000);
}

function readText(e) {
	if (e.target.id === "emailRecuperar") {
		recuperar.emailRecuperar = e.target.value;
	}
	console.log(recuperar);
}
