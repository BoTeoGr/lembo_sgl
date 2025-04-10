const cultivoActualizado = {
	nombre: "",
	tipo: "",
	imagen: "",
	id: "",
	ubicacion: "",
	descripcion: "",
	estado: "habilitado",
};

// Selección del formulario y campos usando clases BEM
const form = document.querySelector(".form__container");
const nombre = document.querySelector(".form__input--cultive-name");
const tipo = document.querySelector(".form__input--cultive-type");
const imagen = document.querySelector(".form__file--cultive-image");
const tamano = document.querySelector(".form__input--cultive-size");
const id = document.querySelector(".form__input--cultive-id");
const ubicacion = document.querySelector(".form__input--cultive-location");
const descripcion = document.querySelector(".form__textarea--cultive-description");
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
form.addEventListener("submit", function (e) {
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
		window.location.href = "../../views/listar-cultivos.html"; // Asegúrate de que la ruta sea correcta
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
	form.appendChild(alert);

	// Eliminar la alerta después de 5 segundos
	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Función para capturar los valores de los inputs usando clases BEM
function readText(e) {
    const className = e.target.classList;
    if (className.contains("form__input--cultive-name")) cultivoActualizado.nombre = e.target.value;
    if (className.contains("form__input--cultive-type")) cultivoActualizado.tipo = e.target.value;
    if (className.contains("form__file--cultive-image")) cultivoActualizado.imagen = e.target.files[0].name;
    if (className.contains("form__input--cultive-id")) cultivoActualizado.id = e.target.value;
    if (className.contains("form__input--cultive-location")) cultivoActualizado.ubicacion = e.target.value;
    if (className.contains("form__input--cultive-size")) cultivoActualizado.tamano = e.target.value;
    if (className.contains("form__textarea--cultive-description")) cultivoActualizado.descripcion = e.target.value;
    if (className.contains("estado-habilitado")) {
		cultivoActualizado.estado = document.querySelector(
			'input[name="estado-habilitado"]:checked'
		).value;
	}
    
    console.log(cultivoActualizado);
}
