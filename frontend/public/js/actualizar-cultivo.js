const cultivoActualizado = {
	nombre: "",
	tipo: "",
	imagen: "",
	id: "",
	ubicacion: "",
	descripcion: "",
	estado: "habilitado",
};

// Selección del formulario y campos
const userForm = document.querySelector(".userForm");
const nombre = document.querySelector("#nombre");
const tipo = document.querySelector("#tipo");
const imagen = document.querySelector("#imagen");
const tamano = document.querySelector("#tamano");
const id = document.querySelector("#id");
const ubicacion = document.querySelector("#ubicacion");
const descripcion = document.querySelector("#descripcion");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

// Agregar eventos para capturar los datos
nombre.addEventListener("input", readText);
tipo.addEventListener("input", readText);
imagen.addEventListener("change", readText);
id.addEventListener("input", readText);
ubicacion.addEventListener("input", readText);
tamano.addEventListener("input", readText);
descripcion.addEventListener("input", readText);
estadoRadios.forEach((radio) => radio.addEventListener("change", readText));

// Bloquear teclas que no sean números en el campo ID
id.addEventListener("keydown", (e) => {
	// Permitir teclas de control (backspace, tab, enter, etc.)
	const teclasPermitidas = [
		"Backspace",
		"Tab",
		"Enter",
		"ArrowLeft",
		"ArrowRight",
		"Delete",
	];

	// Permitir solo números (teclado principal y numérico)
	if (!/^[0-9]$/.test(e.key) && !teclasPermitidas.includes(e.key)) {
		e.preventDefault(); // Bloquear la tecla
	}
});

// Validar y enviar el formulario
userForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevenir la recarga de la página

	const { nombre, tipo, imagen, id, ubicacion, descripcion, tamano, estado } =
		cultivoActualizado;

	// Validación de los campos
	if (
		nombre === "" ||
		tipo === "" ||
		imagen === "" ||
		id === "" ||
		ubicacion === "" ||
		descripcion === "" ||
		tamano === "" ||
		estado === ""
	) {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}

	// Mostrar mensaje de éxito
	showAlert("Tus datos han sido enviados satisfactoriamente.");

	// Redirigir después de mostrar el mensaje
	setTimeout(() => {
		window.location.href = "/listar-cultivos.html"; // Asegúrate de que la ruta sea correcta
	}, 1000);
});

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	alert.classList.add("alert"); // Añadir clase 'alert'

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
	const field = e.target.id || e.target.name; // Obtener el id o name del input

	if (field === "estado-habilitado") {
		cultivoActualizado.estado = document.querySelector(
			'input[name="estado-habilitado"]:checked'
		).value;
	} else if (field === "imagen") {
		cultivoActualizado.imagen = e.target.files[0].name; // Capturar el nombre del archivo
	} else if (field in cultivoActualizado) {
		cultivoActualizado[field] = e.target.value;
	}
	console.log(cultivoActualizado); // Ver los valores almacenados en cultivoActualizado para asegurarte de que se actualicen correctamente
}
