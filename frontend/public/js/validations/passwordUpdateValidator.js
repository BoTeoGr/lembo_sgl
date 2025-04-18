const contraseñaRecuperar = {
	contraseña: "",
	contraseñaConfirm: "",
};

const form = document.querySelector(".form--password");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");

// Leer texto en inputs
form.addEventListener("input", readText);
password.addEventListener("input", readText);
password2.addEventListener("input", readText);

// Evento submit
form.addEventListener("submit", function (e) {
	e.preventDefault();
	const { contraseña, contraseñaConfirm } = contraseñaRecuperar;

	if (contraseña === "" || contraseñaConfirm === "") {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}

	if (contraseña !== contraseñaConfirm) {
		showAlert("Las contraseñas no coinciden", true);
		return;
	}

	showAlert("Contraseña actualizada satisfactoriamente");

	setTimeout(() => {
		window.location.href = "index.html";
	}, 1000);
});

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
	if (e.target.id === "password") {
		contraseñaRecuperar.contraseña = e.target.value;
	} else if (e.target.id === "password2") {
		contraseñaRecuperar.contraseñaConfirm = e.target.value;
	}
	console.log(contraseñaRecuperar);
}
