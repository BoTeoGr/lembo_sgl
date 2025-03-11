// Bloquear números en el campo de nombre
// Bloquear números en los campos 'userName' y 'typeCrop'
document.querySelectorAll(".userName, .typeCrop").forEach(function (element) {
	element.addEventListener("keydown", function (e) {
		if (e.key >= "0" && e.key <= "9") {
			e.preventDefault();
			console.log("Número bloqueado en el campo");
		}
	});
});

document.querySelector(".idCrop").addEventListener("keydown", function (e) {
	if (isNaN(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
		e.preventDefault();
		console.log("Letra bloqueada");
	}
});

// Bloquear Enter en el botón para evitar recargas accidentales
document
	.querySelector(".button--submit")
	.addEventListener("keydown", function (e) {
		if (e.key === "Enter") {
			e.preventDefault();
			console.log("Enter bloqueado en el botón de envío");
		}
	});

// Objeto para almacenar los datos del usuario
const userData = {
	userName: "",
	typeCrop: "",
	userImage: "",
	idCrop: "",
	userLocation: "",
	userDescription: "",
};

// Selección del formulario
const userForm = document.querySelector(".userForm");

// Verificar que el formulario exista antes de agregar eventos
if (userForm) {
	const userName = document.querySelector(".userName");
	const typeCrop = document.querySelector(".typeCrop");
	const userImage = document.querySelector(".userImage");
	const idCrop = document.querySelector(".idCrop");
	const userLocation = document.querySelector(".userLocation");
	const userDescription = document.querySelector(".userDescription");

	// Agregar eventos para capturar los datos
	userName.addEventListener("input", readText);
	typeCrop.addEventListener("input", readText);
	userImage.addEventListener("input", readText);
	idCrop.addEventListener("input", readText);
	userLocation.addEventListener("input", readText);
	userDescription.addEventListener("input", readText);

	// Validar y enviar el formulario
	userForm.addEventListener("submit", function (e) {
		e.preventDefault(); // Prevenir la recarga de la página

		const {
			userName,
			typeCrop,
			userImage,
			idCrop,
			userLocation,
			userDescription,
		} = userData;

		// Validación de los campos
		if (
			!userName ||
			!typeCrop ||
			!userImage ||
			!idCrop ||
			!userLocation ||
			!userDescription
		) {
			showAlert("Todos los campos son obligatorios", true);
			return;
		}

		// Mostrar mensaje de éxito
		showAlert("Tus datos han sido enviados.");

		// Redirigir después de mostrar el mensaje
		setTimeout(() => {
			window.location.href = "listar-insumos.html"; // Asegúrate de que la ruta sea correcta
		}, 1000);
	});

	// Función para capturar los valores de los inputs
	function readText(e) {
		const field = e.target.classList[0]; // Obtener la clase del input

		if (field in userData) {
			userData[field] = e.target.value;
		}

		console.log(userData); // Depuración para ver los valores en consola
	}

	// Función para mostrar alertas
	function showAlert(message, error = false) {
		const alert = document.createElement("P");
		alert.textContent = message;
		alert.classList.add(error ? "error" : "correct");

		userForm.appendChild(alert);

		// Eliminar la alerta después de 5 segundos
		setTimeout(() => {
			alert.remove();
		}, 5000);
	}
} else {
	console.error("El formulario no se encontró en el DOM.");
}
