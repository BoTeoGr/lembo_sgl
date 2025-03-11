// Mapeo entre los IDs de los inputs y las propiedades reales del objeto
const mapeoInputs = {
	"tipo-sensor": "tipo",
	"nombre-sensor": "nombre",
	"unidad-medida": "unidadMedida",
	imagen: "imagen",
	descripcion: "descripcion",
	tamano: "id",
	"tiempo-escaneo": "tiempoEscaneo",
};

// Objeto para almacenar los datos del sensor
const sensor = {
	tipo: "",
	nombre: "",
	unidadMedida: "",
	imagen: "",
	descripcion: "",
	id: "",
	tiempoEscaneo: "",
	estado: "habilitado",
};

// Seleccionar elementos del formulario
const form = document.querySelector(".userForm");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

// Capturar cambios en los inputs y actualizar el objeto correctamente
form.addEventListener("input", (e) => {
	const propiedad = mapeoInputs[e.target.id];
	if (propiedad) {
		sensor[propiedad] = e.target.value.trim();
		console.log(sensor); // Verifica que el objeto tenga solo las propiedades correctas
	}
});

// Capturar el estado en tiempo real
estadoRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		sensor.estado = e.target.value;
		console.log("Estado del sensor:", sensor.estado);
	});
});

// 🚀 Evento para validar y enviar el formulario
form.addEventListener("submit", (e) => {
	e.preventDefault();

	// Validaciones
	if (sensor.tipo === "default")
		return showAlert("Debe seleccionar un tipo de sensor.", true);
	if (!sensor.nombre)
		return showAlert("El nombre del sensor es obligatorio.", true);
	if (sensor.unidadMedida === "default")
		return showAlert("Debe seleccionar una unidad de medida.", true);
	if (!sensor.imagen)
		return showAlert("Debe subir una imagen del sensor.", true);
	if (!sensor.descripcion)
		return showAlert("Debe ingresar una descripción.", true);
	if (!sensor.id) return showAlert("El ID del sensor es obligatorio.", true);
	if (sensor.tiempoEscaneo === "default")
		return showAlert("Debe seleccionar el tiempo de escaneo.", true);

	// Si todo está correcto, muestro un mensaje de éxito
	showAlert("Sensor actualizado correctamente.");
	console.log("Datos finales del sensor:", sensor);

	setTimeout(() => {
		window.location.href = "../pages/listar-sensores.html";
	}, 1000);
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
