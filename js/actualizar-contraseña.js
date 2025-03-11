const contraseñaRecuperar = {
	contraseña: "",
	contraseñaConfirm: "",
};

// Seleccionando elementos
const form = document.querySelector(".form");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");

// Añadir eventos de input
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
		window.location.href = "../index.html"; // Asegúrate de que la ruta sea correcta
	}, 500);
});

// Función para mostrar alertas
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	alert.classList.add("alert"); // Añadir clase 'alert'

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

// Función para leer el texto del input
function readText(e) {
	if (e.target.id === "password") {
		contraseñaRecuperar.contraseña = e.target.value;
	} else if (e.target.id === "password2") {
		contraseñaRecuperar.contraseñaConfirm = e.target.value;
	}
	console.log(contraseñaRecuperar);
}
