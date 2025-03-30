// Bloquear números en los campos 'cycleName'
document.querySelectorAll(".cycleName").forEach(function (element) {
	element.addEventListener("keydown", function (e) {
		if (e.key >= "0" && e.key <= "9") {
			e.preventDefault();
			console.log("Número bloqueado en el campo");
		}
	});
});

// Bloquear Enter en el botón para evitar recargas accidentales
document
	.querySelector(".button--submit")
	.addEventListener("keydown", function (e) {
		if (e.key === "Enter") {
			e.preventDefault();
			console.log("Enter bloqueado en el botón de envío");
		}
	});

// Objeto para almacenar los datos del ciclo de cultivo
const cycleData = {
	cycleName: "", // Corresponde a 'nombre'
	cycleDescription: "", // Corresponde a 'descripcion'
	cycleStartDate: "", // Corresponde a 'periodo_inicio'
	cycleEndDate: "", // Corresponde a 'periodo_final'
	cycleUpdates: "", // Corresponde a 'novedades'
};

// Selección del formulario
const cultivationCycleForm = document.querySelector(".form__container");

// Definir variables para los campos del formulario
const cycleName = document.querySelector(".cycleName");
const cycleDescription = document.querySelector(".cycleDescription");
const cycleStartDate = document.querySelector(".cycleStartDate");
const cycleEndDate = document.querySelector(".cycleEndDate");
const cycleUpdates = document.querySelector(".cycleUpdates");
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los datos
cycleName.addEventListener("input", readText);
cycleDescription.addEventListener("input", readText);
cycleStartDate.addEventListener("input", readText);
cycleEndDate.addEventListener("input", readText);
cycleUpdates.addEventListener("input", readText);

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("cycleName")) {
		cycleData.cycleName = e.target.value;
	} else if (e.target.classList.contains("cycleDescription")) {
		cycleData.cycleDescription = e.target.value;
	} else if (e.target.classList.contains("cycleStartDate")) {
		cycleData.cycleStartDate = e.target.value;
	} else if (e.target.classList.contains("cycleEndDate")) {
		cycleData.cycleEndDate = e.target.value;
	} else if (e.target.classList.contains("cycleUpdates")) {
		cycleData.cycleUpdates = e.target.value;
	}
	console.log(cycleData); // Ver los valores almacenados en cycleData
}

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	alert.classList.add(error ? "error" : "correct");
	cultivationCycleForm.appendChild(alert);

	// Eliminar la alerta después de 5 segundos
	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Función para validar fechas
function validarFechas(fechaInicio, fechaFinal) {
	const fechaInicioObj = new Date(fechaInicio);
	const fechaFinalObj = new Date(fechaFinal);

	if (fechaInicioObj > fechaFinalObj) {
		return false;
	}
	return true;
}

// Función para validar formato de fecha
function validarFormatoFecha(fecha) {
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	return regex.test(fecha);
}

// Función para validar que el campo no esté vacío ni tenga solo espacios
function validarCampoVacio(valor) {
	return valor.trim() !== "";
}

// Función para enviar los datos del ciclo de cultivo al servidor
submitButton.addEventListener("click", async () => {
	// Limpiar alertas anteriores
	const alerts = document.querySelectorAll(".error, .correct");
	alerts.forEach((alert) => alert.remove());

	// Validar los datos
	if (!validarCampoVacio(cycleData.cycleName)) {
		showAlert("El nombre del ciclo de cultivo es obligatorio", true);
		return;
	}
	if (!validarCampoVacio(cycleData.cycleDescription)) {
		showAlert("La descripción del ciclo de cultivo es obligatoria", true);
		return;
	}
	if (!validarFormatoFecha(cycleData.cycleStartDate)) {
		showAlert(
			"Por favor, ingrese una fecha de inicio válida (YYYY-MM-DD)",
			true
		);
		return;
	}
	if (!validarFormatoFecha(cycleData.cycleEndDate)) {
		showAlert("Por favor, ingrese una fecha final válida (YYYY-MM-DD)", true);
		return;
	}
	if (!validarFechas(cycleData.cycleStartDate, cycleData.cycleEndDate)) {
		showAlert("La fecha de inicio debe ser anterior a la fecha final", true);
		return;
	}
	if (!validarCampoVacio(cycleData.cycleUpdates)) {
		showAlert("Las novedades del ciclo de cultivo son obligatorias", true);
		return;
	}

	try {
		// Deshabilitar el botón durante el envío
		submitButton.disabled = true;
		submitButton.textContent = "Creando...";

		const response = await fetch("http://localhost:5000/ciclos-cultivos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(cycleData),
		});

		const data = await response.json();

		if (response.ok) {
			showAlert("Ciclo de cultivo creado exitosamente", false);
			setTimeout(() => {
				window.location.href = "listar-ciclos-cultivos.html";
			}, 2000);
		} else {
			showAlert(data.error || "Error al crear el ciclo de cultivo", true);
		}
	} catch (error) {
		console.error("Error en la conexión:", error);
		showAlert(
			"Error al comunicarse con el servidor. Por favor, inténtelo de nuevo.",
			true
		);
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Ciclo";
	}
});
