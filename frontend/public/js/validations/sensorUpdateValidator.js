// Actualizar selectores para usar clases BEM
const mapeoInputs = {
    "form__select--sensor-type": "tipo",
    "form__input--sensor-name": "nombre",
    "form__select--sensor-unit": "unidadMedida",
    "form__file--sensor-image": "imagen", 
    "form__textarea--sensor-description": "descripcion",
    "form__input--sensor-id": "id",
    "form__select--sensor-scan": "tiempoEscaneo"
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

// Seleccionar elementos usando las nuevas clases BEM
const form = document.querySelector(".form__container");
const tipoSensor = document.querySelector(".form__select--sensor-type");
const nombreSensor = document.querySelector(".form__input--sensor-name");
const unidadMedida = document.querySelector(".form__select--sensor-unit");
const imagen = document.querySelector(".form__file--sensor-image");
const descripcion = document.querySelector(".form__textarea--sensor-description");
const sensorId = document.querySelector(".form__input--sensor-id");
const tiempoEscaneo = document.querySelector(".form__select--sensor-scan");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

// Capturar cambios usando las nuevas clases
form.addEventListener("input", (e) => {
    const className = Array.from(e.target.classList)
        .find(cls => mapeoInputs.hasOwnProperty(cls));
    
    if (className) {
        sensor[mapeoInputs[className]] = e.target.value.trim();
        console.log(sensor);
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
		window.location.href = "listar-sensores.html";
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
