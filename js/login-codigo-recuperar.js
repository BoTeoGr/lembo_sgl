// Objeto para almacenar el código ingresado
const codigoRecuperar = {
	codigo: "",
};

// Seleccionar todos los inputs de código
const inputs = document.querySelectorAll(".inputCode");
const form = document.querySelector(".form");

// Función para mover entre inputs automáticamente
function moveToNext(input, index) {
	if (input.value.length === 1 && index < inputs.length - 1) {
		inputs[index + 1].focus(); // Ir al siguiente input
	} else if (input.value.length === 0 && index > 0) {
		inputs[index - 1].focus(); // Volver al anterior si se borra
	}
}

// Bloquear letras y manejar desplazamiento entre inputs
inputs.forEach((input, index) => {
	input.addEventListener("input", function () {
		moveToNext(input, index);
		readText(); // Actualizar el código ingresado
	});

	input.addEventListener("keydown", function (e) {
		// Permitir teclas de navegación y eliminación
		if (
			e.key === "Backspace" ||
			e.key === "Tab" ||
			e.key === "Enter" ||
			e.key === "ArrowLeft" ||
			e.key === "ArrowRight"
		) {
			return;
		}

		// Bloquear cualquier tecla que NO sea un número
		if (e.key < "0" || e.key > "9") {
			e.preventDefault();
			console.log("Solo se permiten números");
		}
	});
});

// Capturar el código ingresado de todos los inputs
function readText() {
	let codigoIngresado = "";
	inputs.forEach(input => {
		codigoIngresado += input.value; // Concatenar valores de los 6 inputs
	});
	codigoRecuperar.codigo = codigoIngresado;
	console.log(codigoRecuperar);
}

// Función para mostrar alertas
function showAlert(message, error = false) {
	const alert = document.createElement("p");
	alert.textContent = message;
	alert.classList.add("alert"); // Clase base para la alerta

	if (error) {
		alert.classList.add("error"); // Agregar clase de error si es necesario
	} else {
		alert.classList.add("correct"); // Clase de éxito
	}

	form.appendChild(alert);

	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Evento submit del formulario
if (form) {
	form.addEventListener("submit", function (e) {
		e.preventDefault();

		if (codigoRecuperar.codigo.length < 6) {
			showAlert("Debes ingresar los 6 dígitos", true);
			return;
		}

		showAlert("Tu correo ha sido enviado satisfactoriamente");
		setTimeout(() => {
			window.location.href = "actualizacion-contraseña.html";
		}, 500);
	});
} else {
	console.error("No se encontró el formulario en el HTML.");
}
