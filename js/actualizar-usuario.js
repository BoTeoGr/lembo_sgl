// Objeto para almacenar los datos del formulario
const usuario = {
	tipoDocumento: "",
	nombre: "",
	numeroDocumento: "",
	telefono: "",
	correo: "",
	rol: "",
	estado: "habilitado",
};

// Mapeo entre los IDs de los inputs y las propiedades reales del objeto
const mapeoInputs = {
	"tipo-documento": "tipoDocumento",
	nombre: "nombre",
	"numero-documento": "numeroDocumento",
	telefono: "telefono",
	correo: "correo",
	"confirmar-correo": "confirmarCorreo",
	rol: "rol",
};

// Función para leer valores de los inputs y asignarlos al objeto correctamente
function readText(event) {
	const { id, value } = event.target;
	const propiedad = mapeoInputs[id]; // Buscar la propiedad correcta en el mapeo

	if (propiedad) {
		usuario[propiedad] = value.trim();
		console.log(usuario); // Mostrar el objeto actualizado en consola
	}
}

// Seleccionar elementos del formulario
const form = document.querySelector(".userForm");
const tipoDocumento = document.querySelector("#tipo-documento");
const nombre = document.querySelector("#nombre");
const numeroDocumento = document.querySelector("#numero-documento");
const telefono = document.querySelector("#telefono");
const correo = document.querySelector("#correo");
const confirmarCorreo = document.querySelector("#confirmar-correo");
const rol = document.querySelector("#rol");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

// Asignar eventos de entrada a cada input
tipoDocumento.addEventListener("input", readText);
nombre.addEventListener("input", readText);
numeroDocumento.addEventListener("input", readText);
telefono.addEventListener("input", readText);
correo.addEventListener("input", readText);
confirmarCorreo.addEventListener("input", readText);
rol.addEventListener("input", readText);

// Capturar el estado seleccionado en tiempo real
estadoRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		usuario.estado = e.target.value;
		console.log(usuario); // Mostrar en consola cuando cambia el estado
	});
});

// Función para bloquear teclas que no sean números
function bloquearTeclasNoNumericas(input) {
	input.addEventListener("keydown", (e) => {
		const teclasPermitidas = [
			"Backspace",
			"Tab",
			"Enter",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
		];
		if (!/^[0-9]$/.test(e.key) && !teclasPermitidas.includes(e.key)) {
			e.preventDefault();
		}
	});
}

// Aplico restricciones a los campos numéricos
bloquearTeclasNoNumericas(numeroDocumento);
bloquearTeclasNoNumericas(telefono);

// Evento para validar y enviar el formulario
form.addEventListener("submit", (e) => {
	e.preventDefault();

	// Validaciones
	if (!tipoDocumento.value || tipoDocumento.value === "default")
		return showAlert("Debe seleccionar un tipo de documento.", true);
	if (!nombre.value) return showAlert("El nombre es obligatorio.", true);
	if (!numeroDocumento.value)
		return showAlert("El número de documento es obligatorio.", true);
	if (!telefono.value) return showAlert("El teléfono es obligatorio.", true);
	if (!correo.value)
		return showAlert("El correo electrónico es obligatorio.", true);
	if (!confirmarCorreo.value)
		return showAlert("Debe confirmar el correo electrónico.", true);
	if (!rol.value || rol.value === "default")
		return showAlert("Debe seleccionar un rol.", true);

	// Valido que los correos coincidan
	if (correo.value !== confirmarCorreo.value)
		return showAlert("Los correos electrónicos no coinciden.", true);

	// Si todo está correcto, actualizo el objeto usuario con los valores del formulario
	usuario.tipoDocumento = tipoDocumento.value;
	usuario.nombre = nombre.value;
	usuario.numeroDocumento = numeroDocumento.value;
	usuario.telefono = telefono.value;
	usuario.correo = correo.value;
	usuario.rol = rol.value;

	// Muestro un mensaje de éxito
	showAlert("Usuario actualizado correctamente.");

	setTimeout(() => {
		window.location.href = "listar-usuarios.html"; // Asegúrate de que la ruta sea correcta
	}, 1000);

	console.log("Datos finales del usuario:", usuario);
});

// Función para mostrar alertas
function showAlert(message, error = false) {
	const alert = document.createElement("p");
	alert.textContent = message;
	alert.classList.add("alert");

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
