// Bloquear números en el campo de nombre
document.querySelector(".userName").addEventListener("keydown", function (e) {
	if (e.key >= "0" && e.key <= "9") {
		e.preventDefault();
		console.log("Número bloqueado en el nombre");
	}
});

// Seleccionamos todos los elementos con las clases .userPrice, .userAmount y .totalValue
document
	.querySelectorAll(".userPrice, .userAmount, .totalValue, .idInsumo")
	.forEach(function (input) {
		input.addEventListener("keydown", function (e) {
			// Verificamos si la tecla presionada no es un número ni las teclas permitidas (Backspace o Tab)
			if (
				!(e.key >= "0" && e.key <= "9") &&
				e.key !== "Backspace" &&
				e.key !== "Tab"
			) {
				e.preventDefault(); // Bloqueamos la tecla
				console.log("Letra bloqueada");
			}
		});
	});

// Bloquear números en el campo de tipo de insumo
document.querySelector(".userType").addEventListener("keydown", function (e) {
	if (e.key >= "0" && e.key <= "9") {
		e.preventDefault();
		console.log("Número bloqueado en el tipo de insumo");
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
	userType: "",
	userImage: "",
	idInsumo: "",
	UserExtent: "",
	userPrice: "",
	userAmount: "",
};

// Selección del formulario
const userForm = document.querySelector(".userForm");

// Verificar que el formulario exista antes de agregar eventos
if (userForm) {
	const userName = document.querySelector(".userName");
	const userType = document.querySelector(".userType");
	const userImage = document.querySelector(".userImage");
	const idInsumo = document.querySelector(".idInsumo");
	const UserExtent = document.querySelector(".UserExtent");
	const userPrice = document.querySelector(".userPrice");
	const userAmount = document.querySelector(".userAmount");

	// Agregar eventos para capturar los datos
	userName.addEventListener("input", readText);
	userType.addEventListener("input", readText);
	userImage.addEventListener("input", readText);
	idInsumo.addEventListener("input", readText);
	UserExtent.addEventListener("change", readText);
	userPrice.addEventListener("input", readText);
	userAmount.addEventListener("input", readText);

	// Validar y enviar el formulario
	userForm.addEventListener("submit", function (e) {
		e.preventDefault(); // Prevenir la recarga de la página

		const {
			userName,
			userType,
			userImage,
			idInsumo,
			UserExtent,
			userPrice,
			userAmount,
		} = userData;

		// Validación de los campos
		if (
			!userName ||
			!userType ||
			!userImage ||
			!idInsumo ||
			!UserExtent ||
			!userPrice ||
			!userAmount
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
