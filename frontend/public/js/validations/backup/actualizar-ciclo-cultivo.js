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

// Mapeo entre los IDs de los inputs y las propiedades del objeto cicloCultivo
const mapeoInputs = {
	nombre: "nombre",
	id: "id",
	descripcion: "descripcion",
	"periodo-inicio": "periodoInicio",
	"periodo-final": "periodoFinal",
	novedades: "novedades",
};

// Seleccionar elementos del formulario
const form = document.querySelector(".userForm");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

// Evento para capturar datos en tiempo real
form.addEventListener("input", (e) => {
	const propiedad = mapeoInputs[e.target.id]; // Buscar la propiedad en el mapeo
	if (propiedad) {
		cicloCultivo[propiedad] = e.target.value.trim();
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
document.querySelector("#id").addEventListener("keydown", (e) => {
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
		window.location.href = "../../views/listar-ciclo-cultivos.html";
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
