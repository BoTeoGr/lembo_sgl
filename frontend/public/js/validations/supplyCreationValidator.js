// Código que impide que el usuario ingrese números en un input de texto
document.querySelector(".form__input--insume-name").addEventListener("keydown", function (e) {
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

// Objeto para almacenar datos del insumo
const insumoData = {
	insumeName: "",
	insumeType: "",
	insumeImage: "",
	insumeExtent: "",
	insumeDescription: "",
	insumePrice: "",
	insumeAmount: "",
	totalValue: "",
	insumeId: 1, // Valor predeterminado para insumeId
	estado: "habilitado", // Valor predeterminado para el estado
};

// Selección de elementos del formulario
const insumeForm = document.querySelector(".form__container");
const insumeName = document.querySelector(".form__input--insume-name");
const insumeType = document.querySelector(".form__input--insume-type");
const insumeImage = document.querySelector(".form__file--insume-image");
const insumeExtent = document.querySelector(".form__select--insume-extent");
const insumeDescription = document.querySelector(".form__textarea--insume-description");
const insumePrice = document.querySelector(".form__input--insume-price");
const insumeAmount = document.querySelector(".form__input--insume-amount");
const totalValue = document.querySelector(".form__input--total-value");
const estadoRadios = document.querySelectorAll(
    'input[name="estado-habilitado"]'
);
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los valores de los inputs
insumeType.addEventListener("change", readText);
insumeName.addEventListener("input", readText);
insumeExtent.addEventListener("change", readText);
insumeImage.addEventListener("input", readText);
insumeDescription.addEventListener("input", readText);
insumePrice.addEventListener("input", readText);
insumeAmount.addEventListener("input", readText);

// Capturar el estado seleccionado en tiempo real
estadoRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        insumoData.estado = e.target.value;
        console.log(insumoData); // Mostrar en consola cuando cambia el estado
    });
});

// Función para calcular el valor total automáticamente
function calculateTotal() {
	const price = parseFloat(insumePrice.value) || 0;
	const amount = parseInt(insumeAmount.value) || 0;

	// Validar que el precio sea un número válido
	if (isNaN(price)) {
		totalValue.value = "";
		insumoData.totalValue = "";
		return;
	}
	const total = (price * amount).toFixed(0); // Redondear a entero
	// Formatear con puntos y signo $
	const formattedTotal = `$${total}`;

	totalValue.value = formattedTotal;
	insumoData.totalValue = total; // Guardar el valor sin formato para el backend
}

insumePrice.addEventListener("input", calculateTotal);
insumeAmount.addEventListener("input", calculateTotal);

// Función para capturar los valores de los inputs
function readText(e) {
	if (e.target.classList.contains("form__input--insume-name")) {
		insumoData.insumeName = e.target.value;
	} else if (e.target.classList.contains("form__input--insume-type")) {
		insumoData.insumeType = e.target.value;
	} else if (e.target.classList.contains("form__file--insume-image")) {
		insumoData.insumeImage = e.target.value;
	} else if (e.target.classList.contains("form__select--insume-extent")) {
		insumoData.insumeExtent = e.target.value;
	} else if (e.target.classList.contains("form__textarea--insume-description")) {
		insumoData.insumeDescription = e.target.value;
	} else if (e.target.classList.contains("form__input--insume-price")) {
		insumoData.insumePrice = e.target.value;
	} else if (e.target.classList.contains("form__input--insume-amount")) {
		insumoData.insumeAmount = e.target.value;
	} else if (e.target.classList.contains("form__input--total-value")) {
		insumoData.totalValue = e.target.value;
	}

	console.log(insumoData); // Ver los valores almacenados en insumoData
}

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
	const alert = document.createElement("P");
	alert.textContent = message;
	alert.classList.add(error ? "error" : "correct");
	insumeForm.appendChild(alert);

	// Eliminar la alerta después de 5 segundos
	setTimeout(() => {
		alert.remove();
	}, 5000);
}

// Función para validar los datos de insumos
function validateInsumoData() {
	const requiredFields = [
		{ field: "insumeName", label: "Nombre del insumo" },
		{ field: "insumeType", label: "Tipo de insumo" },
		{ field: "insumeImage", label: "Imagen" },
		{ field: "insumeExtent", label: "Unidad de medida" },
		{ field: "insumeDescription", label: "Descripción" },
		{ field: "insumePrice", label: "Precio unitario" },
		{ field: "insumeAmount", label: "Cantidad" },
		{ field: "totalValue", label: "Valor total" },
		{ field: "estado", label: "Estado" }, // Cambiado de estadoRadios a estado
	];

	for (const field of requiredFields) {
		if (!insumoData[field.field]) {
			showAlert(`Por favor, complete el campo ${field.label}`, true);
			return false;
		}
	}

	// Validar que los valores numéricos sean válidos
	if (isNaN(insumoData.insumePrice) || insumoData.insumePrice <= 0) {
		showAlert("El precio unitario debe ser un número válido mayor a 0", true);
		return false;
	}

	if (isNaN(insumoData.insumeAmount) || insumoData.insumeAmount <= 0) {
		showAlert("La cantidad debe ser un número válido mayor a 0", true);
		return false;
	}

	if (isNaN(insumoData.totalValue) || insumoData.totalValue <= 0) {
		showAlert("El valor total debe ser un número válido mayor a 0", true);
		return false;
	}

	return true;
}

// Validación y envío del formulario
insumeForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevenir la recarga de la página

	const {
		insumeName,
		insumeType,
		insumeImage,
		insumeExtent,
		insumeDescription,
		insumePrice,
		insumeAmount,
		totalValue,
		insumeId,
	} = insumoData;

	// Validación de los campos
	if (
		insumeName === "" ||
		insumeType === "" ||
		insumeImage === "" ||
		insumeExtent === "" ||
		insumeDescription === "" ||
		insumePrice === "" ||
		insumeAmount === "" ||
		totalValue === "" ||
		insumeId === ""
	) {
		showAlert("Todos los campos son obligatorios", true);
		return;
	}

	// Validar que el estado no sea "deshabilitado"
    if (estado === "deshabilitado") {
        showAlert("Habilita el sensor para guardarlo", true);
        return;
    }
	
	// Validar que la unidad de medida sea válida
	const validUnits = ["peso", "volumen", "superficie", "Concentración"];
	if (!validUnits.includes(insumeExtent)) {
		showAlert("Unidad de medida no válida", true);
		return;
	}
});

// Función para enviar los datos del insumo al servidor
submitButton.addEventListener("click", async () => {
	if (!validateInsumoData()) {
		return;
	}

	try {
		// Deshabilitar el botón durante el envío
		submitButton.disabled = true;
		submitButton.textContent = "Creando...";
		const response = await fetch("http://localhost:5000/insumos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(insumoData),
		});
		const data = await response.json();

		if (response.ok) {
			showToast("Insumo creado", "El insumo ha sido creado correctamente", "success");
			// Redirigir a listar-usuarios.html
            setTimeout(() => {
                window.location.href = "listar-insumos.html";
            }, 2000); // Espera 2 segundos para mostrar el toast antes de redirigir
		} else {
			showToast("Error", data.error || "Error al crear el insumo", "error");
		}
	} catch (error) {
		console.log(error);
		showToast("Error", "Error al comunicarse con el servidor", "error");
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Insumo";
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