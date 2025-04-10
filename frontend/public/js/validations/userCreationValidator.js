document.querySelector(".form__input--user-name").addEventListener("keydown", function (e) {
	if (e.key >= "0" && e.key <= "9") {
		e.preventDefault();
		console.log("Número bloqueado");
	}
});
document.querySelector(".form__input--user-id").addEventListener("keydown", function (e) {
	if (
		e.key === "Backspace" ||
		e.key === "Tab" ||
		e.key === "Enter" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight"
	) {
		return; //No bloquear estas teclas
	}

	//Bloquear cualquier tecla que NO sea un número
	if (e.key < "0" || e.key > "9") {
		e.preventDefault();
		console.log("Solo se permite números");
	}
});

document.querySelector(".button").addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		console.log("Enter bloqueado");
	}
});

//Solo permita números y bloquee la letra
document.querySelector(".form__input--user-tel").addEventListener("keydown", function (e) {
	if (
		e.key === "Backspace" ||
		e.key === "Tab" ||
		e.key === "Enter" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight"
	) {
		return; //No bloquear estas teclas
	}

	//Bloquear cualquier tecla que NO sea un número
	if (e.key < "0" || e.key > "9") {
		e.preventDefault();
		console.log("Solo se permite números");
	}
});

// Objeto para almacenar datos del usuario
const userData = {
	userTypeId: "",
	userName: "",
	userId: "",
	userTel: "",
	userEmail: "",
	userConfirmEmail: "",
	userRol: "",
	estado: "habilitado", // Valor predeterminado para el estado
};

const userForm = document.querySelector(".form__container");

// Definir variables sin espacios incorrectos
const userTypeId = document.querySelector(".form__select--user-type-id");
const userName = document.querySelector(".form__input--user-name");
const userId = document.querySelector(".form__input--user-id");
const userTel = document.querySelector(".form__input--user-tel");
const userEmail = document.querySelector(".form__input--user-email");
const userConfirmEmail = document.querySelector(".form__input--user-confirm-email");
const userRol = document.querySelector(".form__select--user-rol");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);
const submitButton = document.querySelector(".button--submit");

// Agregar eventos sin errores de nombres
userTypeId.addEventListener("change", readText);
userName.addEventListener("input", readText);
userId.addEventListener("input", readText);
userTel.addEventListener("input", readText);
userEmail.addEventListener("input", readText);
userConfirmEmail.addEventListener("input", readText);
userRol.addEventListener("change", readText);

// Capturar el estado seleccionado en tiempo real
estadoRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		userData.estado = e.target.value;
		console.log(userData); // Mostrar en consola cuando cambia el estado
	});
});

// Función para validar el formulario antes de enviarlo
userForm.addEventListener("submit", function (e) {
	e.preventDefault(); // Prevenir la recarga de la página
	const {
		userTypeId,
		userName,
		userId,
		userTel,
		userEmail,
		userConfirmEmail,
		userRol,
	} = userData;
	if (
		userTypeId === "" ||
		userName === "" ||
		userId === "" ||
		userTel === "" ||
		userEmail === "" ||
		userConfirmEmail === "" ||
		userRol === "" 
	) {
		showToast("Campos requeridos", "Todos los campos son obligatorios", "error");
		return;
	}
	// Validación de los campos
    if (!validateSensorData()) {
        return;
    }
	showToast("Enviando datos", "Tus datos están siendo enviados", "info");
});

// Función para validar los datos del usuario
function validateUserData() {
	const requiredFields = [
		{ field: "userTypeId", label: "Tipo de documento" },
		{ field: "userName", label: "Nombre" },
		{ field: "userId", label: "Número de documento" },
		{ field: "userTel", label: "Teléfono" },
		{ field: "userEmail", label: "Correo electrónico" },
		{ field: "userConfirmEmail", label: "Confirmación de correo" },
		{ field: "userRol", label: "Rol" },
		{ field: "estado", label: "Estado" }, // Agregamos el estado a las validaciones
	];

	for (const field of requiredFields) {
		if (!userData[field.field]) {
			showToast(`Por favor, complete el campo ${field.label}`, "", "error");
			return false;
		}
	}

	// Validar que los correos coincidan
	if (userData.userEmail !== userData.userConfirmEmail) {
		showToast("Error", "Los correos electrónicos no coinciden", "error");
		return false;
	}

	// Validar que el tipo de documento sea válido
	const validDocumentTypes = ["ti", "cc", "ce","ppt", "pep"];
	if (!validDocumentTypes.includes(userData.userTypeId)) {
		showToast("Error", "Tipo de documento no válido", "error");
		return false;
	}

	// Validar que el estado no sea "Deshabilitado"
    if (userData.estadoRadios === "deshabilitado") {
        showToast("Error", "Cambia el estado para crear el usuario", "error");
        return false;
    }

	return true;
}

// Función para capturar los valores de los inputs
submitButton.addEventListener("click", async () => {
	if (!validateUserData()) {
		return;
	}

	try {
		// Deshabilitar el botón durante el envío
		submitButton.disabled = true;
		submitButton.textContent = "Creando...";
		const response = await fetch("http://localhost:5000/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
		const data = await response.json();

		if (response.ok) {
			showToast("Usuario creado", "El usuario ha sido creado correctamente", "success");
			// Redirigir a listar-usuarios.html
            setTimeout(() => {
                window.location.href = "listar-usuarios.html";
            }, 2000); // Espera 2 segundos para mostrar el toast antes de redirigir
		} else {
			showToast("Error", data.error || "Error al crear el usuario", "error");
		}
	} catch (error) {
		console.log(error);
		showToast("Error", "Error al comunicarse con el servidor", "error");
	} finally {
		// Rehabilitar el botón
		submitButton.disabled = false;
		submitButton.textContent = "Crear Usuario";
	}
});

function readText(e) {
	if (e.target.classList.contains("form__select--user-type-id")) {
        userData.userTypeId = e.target.value;
    } else if (e.target.classList.contains("form__input--user-name")) {
        userData.userName = e.target.value;
    } else if (e.target.classList.contains("form__input--user-id")) {
        userData.userId = e.target.value;
    } else if (e.target.classList.contains("form__input--user-tel")) {
        userData.userTel = e.target.value;
    } else if (e.target.classList.contains("form__input--user-email")) {
        userData.userEmail = e.target.value;
    } else if (e.target.classList.contains("form__input--user-confirm-email")) {
        userData.userConfirmEmail = e.target.value;
    } else if (e.target.classList.contains("form__select--user-rol")) {
        userData.userRol = e.target.value;
    }
	console.log(userData); // Ver los valores almacenados en userData para asegurarte de que se actualicen correctamente
}

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