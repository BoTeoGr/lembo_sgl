// Código que impide que el usuario ingrese números en un input de texto
document.querySelector(".sensorName").addEventListener("keydown", function (e) {
	if (e.key >= "0" && e.key <= "9") {
		e.preventDefault();
		console.log("Número bloqueado");
	}
});

document.querySelector(".button").addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		console.log("Enter bloqueado");
	}
});

// Objeto para almacenar datos del sensor
const sensorData = {
	sensorType: "",
	sensorName: "",
	sensorUnit: "",
	sensorImage: "",
	sensorDescription: "",
	sensorScan: "",
	userId: 1, // Valor predeterminado para userId
};

// Selección de elementos del formulario
const sensorForm = document.querySelector(".form__container");
const sensorType = document.querySelector(".sensorType");
const sensorName = document.querySelector(".sensorName");
const sensorUnit = document.querySelector(".sensorUnit");
const sensorImage = document.querySelector(".sensorImage");
const sensorDescription = document.querySelector(".sensorDescription");
const sensorScan = document.querySelector(".sensorScan");
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los valores de los inputs
sensorType.addEventListener("change", readText);
sensorName.addEventListener("input", readText);
sensorUnit.addEventListener("change", readText);
sensorImage.addEventListener("input", readText);
sensorDescription.addEventListener("input", readText);
sensorScan.addEventListener("change", readText);

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("sensorType")) {
		sensorData.sensorType = e.target.value;
	} else if (e.target.classList.contains("sensorName")) {
		sensorData.sensorName = e.target.value;
	} else if (e.target.classList.contains("sensorUnit")) {
		sensorData.sensorUnit = e.target.value;
	} else if (e.target.classList.contains("sensorImage")) {
		sensorData.sensorImage = e.target.value;
	} else if (e.target.classList.contains("sensorDescription")) {
		sensorData.sensorDescription = e.target.value;
	} else if (e.target.classList.contains("sensorScan")) {
		sensorData.sensorScan = e.target.value;
	}

	console.log(sensorData); // Ver los valores almacenados en sensorData
}

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	alert.classList.add(error ? "error" : "correct");
	sensorForm.appendChild(alert);

	// Eliminar la alerta después de 5 segundos
	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Función para validar los datos del sensor
function validateSensorData() {
	const requiredFields = [
		{ field: "sensorType", label: "Tipo de sensor" },
		{ field: "sensorName", label: "Nombre del sensor" },
		{ field: "sensorUnit", label: "Medida" },
		{ field: "sensorImage", label: "Imagen" },
		{ field: "sensorDescription", label: "Descripción" },
		{ field: "sensorScan", label: "Escaneo" },
	];

	for (const field of requiredFields) {
		if (!sensorData[field.field]) {
			showAlert(`Por favor, complete el campo ${field.label}`, true);
			return false;
		}
	}
	return true;
}

// Validación y envío del formulario
sensorForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevenir la recarga de la página

	const {
		sensorType,
		sensorName,
		sensorUnit,
		sensorImage,
		sensorDescription,
		sensorScan,
		userId,
	} = sensorData;

	// Validación de los campos
	if (
		sensorType === "" ||
		sensorName === "" ||
		sensorUnit === "" ||
		sensorImage === "" ||
		sensorDescription === "" ||
		sensorScan === "" ||
		userId === ""
	) {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}

	// Validar que el tipo de sensor sea válido
	const validSensorTypes = [
		"Sensor de contacto",
		"Sensor de distancia",
		"Sensores de luz",
	];
	if (!validSensorTypes.includes(sensorType)) {
		showAlert("Tipo de sensor no válido", true);
		return;
	}

	// Validar que la unidad de medida sea válida
	const validUnits = ["Temperatura", "Distancia", "Presión"];
	if (!validUnits.includes(sensorUnit)) {
		showAlert("Unidad de medida no válida", true);
		return;
	}

	// Validar que el tiempo de escaneo sea válido
	const validScanTimes = [
		"Sensores lentos",
		"Sensores de velocidad media",
		"Sensores rápidos",
	];
	if (!validScanTimes.includes(sensorScan)) {
		showAlert("Tiempo de escaneo no válido", true);
		return;
	}
});

// Función para enviar los datos del sensor al servidor
submitButton.addEventListener("click", async () => {
	if (!validateSensorData()) {
		return;
	}

	try {
		// Deshabilitar el botón durante el envío
		submitButton.disabled = true;
		submitButton.textContent = "Creando...";
		const response = await fetch("http://localhost:5000/sensor", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(sensorData),
		});
		const data = await response.json();

		if (response.ok) {
			showAlert("Sensor creado exitosamente", false);
			setTimeout(() => {
				window.location.href = "listar-sensores.html";
			}, 2000);
		} else {
			showAlert(data.error || "Error al crear el sensor", true);
		}
	} catch (error) {
		console.log(error);
		showAlert("Error al comunicarse con el servidor", true);
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Sensor";
	}
});

// Olvide este comentario
