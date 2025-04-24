// Objeto para almacenar los datos del formulario
const cicloCultivo = {
	nombre: "",
	id: "",
	descripcion: "",
	periodoInicio: "",
	periodoFinal: "",
	novedades: "",
	estado: "habilitado", // Valor por defecto
};

// Mapeo entre las clases de los inputs y las propiedades del objeto cicloCultivo
const mapeoClases = {
	"form__input--cycle-name": "nombre",
	"form__input--cycle-id": "id",
	"form__textarea--cycle-description": "descripcion",
	"form__input--cycle-start-date": "periodoInicio",
	"form__input--cycle-end-date": "periodoFinal",
	"form__textarea--cycle-updates": "novedades",
};

// Seleccionar elementos del formulario usando las nuevas clases BEM
const form = document.querySelector(".form__container");
const nombre = document.querySelector(".form__input--cycle-name");
const id = document.querySelector(".form__input--cycle-id");
const descripcion = document.querySelector(".form__textarea--cycle-description");
const periodoInicio = document.querySelector(".form__input--cycle-start-date");
const periodoFinal = document.querySelector(".form__input--cycle-end-date");
const novedades = document.querySelector(".form__textarea--cycle-updates");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

// Evento para capturar datos en tiempo real usando clases BEM
form.addEventListener("input", (e) => {
	const className = Array.from(e.target.classList).find((cls) =>
		mapeoClases.hasOwnProperty(cls)
	);

	if (className) {
		cicloCultivo[mapeoClases[className]] = e.target.value.trim();
		console.log(cicloCultivo); // Ver el objeto actualizado en consola
	}
});

// Evento para capturar el estado seleccionado
estadoRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		cicloCultivo.estado = e.target.value;
		console.log("Estado seleccionado:", cicloCultivo.estado);
	});
});

// Bloquear teclas que no sean números en el campo ID
document.querySelector(".form__input--cycle-id").addEventListener("keydown", (e) => {
	const teclasPermitidas = [
		"Backspace",
		"Tab",
		"Enter",
		"ArrowLeft",
		"ArrowRight",
		"Delete",
	];
	if (!/^[0-9]$/.test(e.key) && !teclasPermitidas.includes(e.key)) {
		e.preventDefault(); // Bloquear la tecla
	}
});

// Evento para validar y guardar los datos al enviar el formulario
form.addEventListener("submit", (e) => {
	e.preventDefault();

	// Validaciones
	if (!cicloCultivo.nombre)
		return showAlert("El nombre del ciclo de cultivo es obligatorio.", true);
	if (!cicloCultivo.id || isNaN(cicloCultivo.id))
		return showAlert("El ID debe ser un número válido.", true);
	if (!cicloCultivo.descripcion)
		return showAlert("La descripción no puede estar vacía.", true);
	if (!cicloCultivo.periodoInicio || !cicloCultivo.periodoFinal)
		return showAlert("Las fechas de inicio y final son obligatorias.", true);
	if (
		new Date(cicloCultivo.periodoInicio) > new Date(cicloCultivo.periodoFinal)
	)
		return showAlert(
			"La fecha de inicio no puede ser mayor que la fecha final.",
			true
		);
	if (!cicloCultivo.novedades)
		return showAlert("Debe ingresar novedades del ciclo de cultivo.", true);

	// Si todo es válido, mostrar éxito y redirigir
	showAlert("Ciclo de cultivo actualizado correctamente.");
	setTimeout(() => {
		window.location.href = "../../views/listar-ciclos-cultivos.html";
	}, 1000);

	// console.log("Datos finales del ciclo de cultivo:", cicloCultivo);
});

// Función para mostrar alertas personalizadas
function showAlert(message, error = false) {
	const alert = document.createElement("p");
	alert.textContent = message;
	alert.classList.add("alert", error ? "error" : "correct");

	form.appendChild(alert);
	setTimeout(() => alert.remove(), 5000);
}
