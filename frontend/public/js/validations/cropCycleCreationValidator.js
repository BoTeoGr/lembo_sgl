// Bloquear números en los campos 'cycleName'
document.querySelector(".form__input--cycle-name").addEventListener("keydown", function (e) {
    if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        console.log("Número bloqueado en el campo");
    }
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
	estado: "habilitado", // Valor predeterminado para el estado
	usuario_id : 1, // Corresponde a el id del usuario
};

// Selección del formulario
const cultivationCycleForm = document.querySelector(".form__container");

// Definir variables para los campos del formulario
const cycleName = document.querySelector(".form__input--cycle-name");
const cycleDescription = document.querySelector(".form__textarea--cycle-description");
const cycleStartDate = document.querySelector(".form__input--cycle-start-date");
const cycleEndDate = document.querySelector(".form__input--cycle-end-date");
const cycleUpdates = document.querySelector(".form__textarea--cycle-updates");
const estadoRadios = document.querySelectorAll(
    'input[name="estado-habilitado"]'
);
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los datos
cycleName.addEventListener("input", readText);
cycleDescription.addEventListener("input", readText);
cycleStartDate.addEventListener("input", readText);
cycleEndDate.addEventListener("input", readText);
cycleUpdates.addEventListener("input", readText);

// Capturar el estado seleccionado en tiempo real
estadoRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        cycleData.estado = e.target.value;
        console.log(cycleData); // Mostrar en consola cuando cambia el estado
    });
});

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("form__input--cycle-name")) {
		cycleData.cycleName = e.target.value;
	} else if (e.target.classList.contains("form__textarea--cycle-description")) {
		cycleData.cycleDescription = e.target.value;
	} else if (e.target.classList.contains("form__input--cycle-start-date")) {
		cycleData.cycleStartDate = e.target.value;
	} else if (e.target.classList.contains("form__input--cycle-end-date")) {
		cycleData.cycleEndDate = e.target.value;
	} else if (e.target.classList.contains("form__textarea--cycle-updates")) {
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

		// Cambia la URL para que coincida con la ruta backend
        const response = await fetch("http://localhost:5000/ciclo_cultivo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(cycleData),
		});

		const data = await response.json();

		if (response.ok) {
			showToast("Ciclo de cultivo creado", "El ciclo de cultivo ha sido creado correctamente", "success");
			// Redirigir a listar-usuarios.html
            setTimeout(() => {
                window.location.href = "listar-ciclos-cultivos.html";
            }, 2000); // Espera 2 segundos para mostrar el toast antes de redirigir
		} else {
			showToast("Error", data.error || "Error al crear el ciclo de cultivo", "error");
		}
	} catch (error) {
		console.log(error);
		showToast("Error", "Error al comunicarse con el servidor", "error");
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Ciclo de Cultivo";
	}
});

// Función general para mostrar toasts
function showToast(title, message, type = "success") {
	const toast = document.getElementById("toast");
	const toastTitle = document.getElementById("toastTitle");
	const toastDescription = document.getElementById("toastDescription");
	const toastIcon = document.getElementById("toastIcon");
	const toastProgress = document.querySelector(".toast-progress");

	// Establecer el contenido del toast
	toastTitle.textContent = title;
	toastDescription.textContent = message;

	// Establecer el icono según el tipo
	switch (type) {
		case "success":
			toastIcon.className = "fas fa-check-circle";
			break;
		case "error":
			toastIcon.className = "fas fa-exclamation-circle";
			break;
		case "warning":
			toastIcon.className = "fas fa-exclamation-triangle";
			break;
		case "info":
			toastIcon.className = "fas fa-info-circle";
			break;
	}

	// Mostrar el toast
	toast.classList.remove("hidden");

	// Animación de la barra de progreso
	let progress = 0;
	const progressInterval = setInterval(() => {
		progress += 2;
		toastProgress.style.width = `${progress}%`;
		if (progress >= 100) {
			clearInterval(progressInterval);
			// Ocultar el toast después de 5 segundos
			setTimeout(() => {
				toast.classList.add("hidden");
				toastProgress.style.width = "0%";
			}, 3400);
		}
	}, 30);
}
