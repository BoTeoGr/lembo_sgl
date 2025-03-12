// Funcion para mover entre inputs
function moveToNext(input, index) {
	const inputs = document.querySelectorAll(".code-input");
	if (input.value.length === 1 && index < inputs.length - 1) {
		inputs[index + 1].focus();
	} else if (input.value.length === 0 && index > 0) {
		inputs[index - 1].focus();
	}
}//Una vez completo el input pasa al siguiente input

const codigoRecuperar = {
	codigo: "",
};

// Seleccionar todos los inputs
const inputs = document.querySelectorAll(".inputCode");

// Bloquear letras y manejar desplazamiento
inputs.forEach((input, index) => {
	input.addEventListener("input", function () {
		// Avanzar al siguiente input automáticamente
		if (input.value.length === 1 && index < inputs.length - 1) {
			inputs[index + 1].focus();
		}
	});

	input.addEventListener("keydown", function (e) {
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

// Capturar el código ingresado
function readText() {
	let codigoIngresado = "";
	inputs.forEach(input => {
		codigoIngresado += input.value; // Concatenar valores de los 6 inputs
	});
	codigoRecuperar.codigo = codigoIngresado;
	console.log(codigoRecuperar);
}

// Agregar evento input a todos los inputs de código
inputs.forEach(input => input.addEventListener("input", readText));

// Evento submit
document.querySelector(".form").addEventListener("submit", function (e) {
	e.preventDefault();

	if (codigoRecuperar.codigo.length < 6) {
		showAlert("Debes ingresar los 6 dígitos", true);
		return;
	}

	showAlert("Tu correo ha sido enviado satisfactoriamente");
	setTimeout(() => {
		window.location.href = "../pages/actualizacion-contraseña.html"; // Asegúrate de que la ruta sea correcta
	}, 500);
});
