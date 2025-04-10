// Código que impide que el usuario ingrese números en un input de texto
document.querySelector(".form__input--sensor-name").addEventListener("keydown", function (e) {
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
	estado: "habilitado", // Valor predeterminado para el estado
};

// Selección de elementos del formulario
const sensorForm = document.querySelector(".form__container");
const sensorType = document.querySelector(".form__select--sensor-type");
const sensorName = document.querySelector(".form__input--sensor-name");
const sensorUnit = document.querySelector(".form__select--sensor-unit");
const sensorImage = document.querySelector(".form__file--sensor-image");
const sensorDescription = document.querySelector(".form__textarea--sensor-description");
const sensorScan = document.querySelector(".form__select--sensor-scan");
const estadoRadios = document.querySelectorAll(
    'input[name="estado-habilitado"]'
);
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los valores de los inputs
sensorType.addEventListener("change", readText);
sensorName.addEventListener("input", readText);
sensorUnit.addEventListener("change", readText);
sensorImage.addEventListener("input", readText);
sensorDescription.addEventListener("input", readText);
sensorScan.addEventListener("change", readText);

// Capturar el estado seleccionado en tiempo real
estadoRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        sensorData.estado = e.target.value;
        console.log(sensorData); // Mostrar en consola cuando cambia el estado
    });
});

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("form__select--sensor-type")) {
		sensorData.sensorType = e.target.value;
	} else if (e.target.classList.contains("form__input--sensor-name")) {
		sensorData.sensorName = e.target.value;
	} else if (e.target.classList.contains("form__select--sensor-unit")) {
		sensorData.sensorUnit = e.target.value;
	} else if (e.target.classList.contains("form__file--sensor-image")) {
		sensorData.sensorImage = e.target.value;
	} else if (e.target.classList.contains("form__textarea--sensor-description")) {
		sensorData.sensorDescription = e.target.value;
	} else if (e.target.classList.contains("form__select--sensor-scan")) {
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
		{ field: "estado", label: "Estado" }, // Cambiado de estadoRadios a estado
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
			showToast("Sensor creado", "El sensor ha sido creado correctamente", "success");
			// Redirigir a listar-usuarios.html
            setTimeout(() => {
                window.location.href = "listar-sensores.html";
            }, 2000); // Espera 2 segundos para mostrar el toast antes de redirigir
		} else {
			showToast("Error", data.error || "Error al crear el sensor", "error");
		}
	} catch (error) {
		console.log(error);
		showToast("Error", "Error al comunicarse con el servidor", "error");
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Sensor";
	}
});

// Función general para mostrar toasts
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastDescription = document.getElementById('toastDescription');
    const toastIcon = document.getElementById('toastIcon');
    const toastProgress = document.querySelector('.toast-progress');

    // Establecer el contenido del toast
    toastTitle.textContent = title;
    toastDescription.textContent = message;
    
    // Establecer el icono según el tipo
    switch(type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            toastIcon.className = 'fas fa-exclamation-triangle';
            break;
        case 'info':
            toastIcon.className = 'fas fa-info-circle';
            break;
    }

    // Mostrar el toast
    toast.classList.remove('hidden');
    
    // Animación de la barra de progreso
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        toastProgress.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(progressInterval);
            // Ocultar el toast después de 5 segundos
            setTimeout(() => {
                toast.classList.add('hidden');
                toastProgress.style.width = '0%';
            }, 3400);
        }
    }, 30);
}
