// Exportar el título para el header
export const pageTitle = "Crear usuario";

document.querySelector(".userName").addEventListener("keydown", function (e) {
	if (e.key >= "0" && e.key <= "9") {
		e.preventDefault();
		console.log("Número bloqueado");
	}
});
document.querySelector(".userId").addEventListener("keydown", function (e) {
	if (isNaN(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
		e.preventDefault();
		console.log("Letra bloqueada");
	}
});

document.querySelector(".button").addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		console.log("Enter bloqueado");
	}
});

//Solo permita numeros y bloquees la letra
document.querySelector(".userTel").addEventListener("keydown", function (e) {
	if (
		e.key === "Backspace" ||
		e.key === "Tab" ||
		e.key === "Enter" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight"
	) {
		return; //No bloquear estas teclas
	}

	//Bloquear caulquier tecla que NO sea un numero
	if (e.key < "0" || e.key > "9") {
		e.preventDefault();
		console.log("Solo se permite numeros");
	}
});

// Objeto para almacenar datos del usuario
const userData = {
	userTypeId: "",
	userName: "",
	userId: "",
	userTel: "",
	userEmail: "",
	userConfirmEmail: "",
	userRol: "",
};

const userForm = document.querySelector(".userForm");

// Definir variables sin espacios incorrectos
const userTypeId = document.querySelector(".userTypeId");
const userName = document.querySelector(".userName");
const userId = document.querySelector(".userId");
const userTel = document.querySelector(".userTel");
const userEmail = document.querySelector(".userEmail");
const userConfirmEmail = document.querySelector(".userConfirmEmail");
const userRol = document.querySelector(".userRol");

// Agregar eventos sin errores de nombres
userTypeId.addEventListener("change", readText);
userName.addEventListener("input", readText);
userId.addEventListener("input", readText);
userTel.addEventListener("input", readText);
userEmail.addEventListener("input", readText);
userConfirmEmail.addEventListener("input", readText);
userRol.addEventListener("change", readText);

// Función para validar el formulario antes de enviarlo
userForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevenir la recarga de la página
	const {
		userTypeId,
		userName,
		userId,
		userTel,
		userEmail,
		userConfirmEmail,
		userRol,
	} = userData;
	if (
		userTypeId === "" ||
		userName === "" ||
		userId === "" ||
		userTel === "" ||
		userEmail === "" ||
		userConfirmEmail === "" ||
		userRol === ""
	) {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}
	showAlert("Tus datos han sido enviados."); // Mostrar alerta de éxito

	// Redirigir después de que la alerta desaparezca
	setTimeout(() => {
		window.location.href = "listar-usuarios.html"; // Redirigir a la página
	}, 1000); // Retraso de 5 segundos para permitir que la alerta sea visible
});

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	if (error) {
		alert.classList.add("error");
	} else {
		alert.classList.add("correct");
	}
	userForm.appendChild(alert);

	// Eliminar la alerta después de 5 segundos
	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("userTypeId")) {
		userData.userTypeId = e.target.value;
	} else if (e.target.classList.contains("userName")) {
		userData.userName = e.target.value;
	} else if (e.target.classList.contains("userId")) {
		userData.userId = e.target.value;
	} else if (e.target.classList.contains("userTel")) {
		// Corregido: eliminé el espacio extra
		userData.userTel = e.target.value;
	} else if (e.target.classList.contains("userEmail")) {
		userData.userEmail = e.target.value;
	} else if (e.target.classList.contains("userConfirmEmail")) {
		userData.userConfirmEmail = e.target.value;
	} else if (e.target.classList.contains("userRol")) {
		userData.userRol = e.target.value;
	}

	console.log(userData); // Ver los valores almacenados en userData para asegurarte de que se actualicen correctamente
}
