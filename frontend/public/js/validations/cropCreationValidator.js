// Bloquear números en los campos 'userName' y 'typeCrop'
document.querySelectorAll(".form__input--cultive-name, .form__input--cultive-type").forEach(function (element) {
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

// Bloquear caracteres no numéricos en el campo cultiveSize
document
	.querySelector(".form__input--cultive-size")
	.addEventListener("keydown", function (e) {
		if ((e.key < "0" || e.key > "9") && e.key !== "." && e.key !== "Backspace") {
			e.preventDefault();
		}
	});

// Objeto para almacenar los datos del cultivo
const cultiveData = {
	cultiveName: "", // Corresponde a 'nombre'
	cultiveType: "", // Corresponde a 'tipo'
	cultiveImage: "", // Corresponde a 'imagen'
	cultiveLocation: "", // Corresponde a 'ubicacion'
	cultiveDescription: "", // Corresponde a 'descripcion'
	cultiveSize: "", // Corresponde a 'tamaño'
	usuario_id: 1, // Corresponde a 'usuario_id'
	estado: "habilitado", // Valor predeterminado para el estado
	cultivoId: 1, // Asegúrate de incluir el ID del cultivo
};

// Selección del formulario
const cultivoForm = document.querySelector(".form__container");

// Definir variables para los campos del formulario
const cultiveName = document.querySelector(".form__input--cultive-name");
const cultiveType = document.querySelector(".form__input--cultive-type");
const cultiveImage = document.querySelector(".form__file--cultive-image");
const cultiveLocation = document.querySelector(".form__input--cultive-location");
const cultiveDescription = document.querySelector(".form__textarea--cultive-description");
const cultiveSize = document.querySelector(".form__input--cultive-size");
const estadoRadios = document.querySelectorAll(
    'input[name="estado-habilitado"]'
);
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los datos
cultiveName.addEventListener("input", readText);
cultiveSize.addEventListener("input", readText);
cultiveType.addEventListener("input", readText);
cultiveImage.addEventListener("input", readText);
cultiveLocation.addEventListener("input", readText);
cultiveDescription.addEventListener("input", readText);

// Capturar el estado seleccionado en tiempo real
estadoRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        cultiveData.estado = e.target.value;
        console.log(cultiveData); // Mostrar en consola cuando cambia el estado
    });
});

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("form__input--cultive-name")) {
		cultiveData.cultiveName = e.target.value;
	} else if (e.target.classList.contains("form__input--cultive-type")) {
		cultiveData.cultiveType = e.target.value;
	} else if (e.target.classList.contains("form__file--cultive-image")) {
		cultiveData.cultiveImage = e.target.value;
	} else if (e.target.classList.contains("form__input--cultive-location")) {
		cultiveData.cultiveLocation = e.target.value;
	} else if (e.target.classList.contains("form__textarea--cultive-description")) {
		cultiveData.cultiveDescription = e.target.value;
	} else if (e.target.classList.contains("form__input--cultive-size")) {
		cultiveData.cultiveSize = e.target.value;
	}
	console.log(cultiveData); // Ver los valores almacenados en cultiveData
}

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	alert.classList.add(error ? "error" : "correct");
	cultivoForm.appendChild(alert);

	// Eliminar la alerta después de 5 segundos
	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Validar y enviar el formulario
cultivoForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevenir la recarga de la página

	const {
		cultiveName,
		cultiveType,
		cultiveImage,
		cultiveLocation,
		cultiveDescription,
		cultiveSize,
		usuario_id,
	} = cultiveData;

	// Validación de los campos
	if (
		!cultiveName ||
		!cultiveType ||
		!cultiveImage ||
		!cultiveLocation ||
		!cultiveDescription ||
		usuario_id === "" ||
		!isValidSize(cultiveSize)
	) {
		showAlert("Todos los campos son obligatorios y el tamaño debe estar entre 10 y 10000 m²", true);
		return;
	}
	
});

// Función para validar el tamaño del cultivo
function isValidSize(size) {
	const parsedSize = parseFloat(size);
	// El tamaño mínimo razonable para un cultivo es 10m²
	return !isNaN(parsedSize) && parsedSize >= 10 && parsedSize <= 10000;
}

// Función para enviar los datos del cultivo al servidor
submitButton.addEventListener("click", async () => {
	if (
		!cultiveData.cultiveName ||
		!cultiveData.cultiveType ||
		!cultiveData.cultiveImage ||
		!cultiveData.cultiveLocation ||
		!cultiveData.cultiveDescription ||
		!cultiveData.cultiveSize
	) {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}

	try {
		// Deshabilitar el botón durante el envío
		submitButton.disabled = true;
		submitButton.textContent = "Creando...";
		const response = await fetch("http://localhost:5000/cultivos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(cultiveData),
		});
		const data = await response.json();

		if (response.ok) {
			showToast("Cultivo creado", "El cultivo ha sido creado correctamente", "success");
			// Redirigir a listar-usuarios.html
            setTimeout(() => {
                window.location.href = "listar-cultivos.html";
            }, 2000); // Espera 2 segundos para mostrar el toast antes de redirigir
		} else {
			showToast("Error", data.error || "Error al crear el cultivo", "error");
		}
	} catch (error) {
		console.log(error);
		showToast("Error", "Error al comunicarse con el servidor", "error");
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Cultivo";
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
