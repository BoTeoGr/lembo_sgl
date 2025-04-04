document.querySelector(".userName").addEventListener("keydown", function (e) {
	if (e.key >= "0" && e.key <= "9") {
		e.preventDefault();
		console.log("Número bloqueado");
	}
});
document.querySelector(".userId").addEventListener("keydown", function (e) {
	if (isNaN(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
		e.preventDefault();
		console.log("Letra bloqueada");
	}
});

document.querySelector(".button").addEventListener("keydown", function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		console.log("Enter bloqueado");
	}
});

//Solo permita números y bloquee la letra
document.querySelector(".userTel").addEventListener("keydown", function (e) {
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
};

const userForm = document.querySelector(".form__container");

// Definir variables sin espacios incorrectos
const userTypeId = document.querySelector(".userTypeId");
const userName = document.querySelector(".userName");
const userId = document.querySelector(".userId");
const userTel = document.querySelector(".userTel");
const userEmail = document.querySelector(".userEmail");
const userConfirmEmail = document.querySelector(".userConfirmEmail");
const userRol = document.querySelector(".userRol");
const submitButton = document.querySelector(".button--submit");

// Agregar eventos sin errores de nombres
userTypeId.addEventListener("change", readText);
userName.addEventListener("input", readText);
userId.addEventListener("input", readText);
userTel.addEventListener("input", readText);
userEmail.addEventListener("input", readText);
userConfirmEmail.addEventListener("input", readText);
userRol.addEventListener("change", readText);

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
	const validDocumentTypes = ["ti", "cc", "ppt"];
	if (!validDocumentTypes.includes(userData.userTypeId)) {
		showToast("Error", "Tipo de documento no válido", "error");
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
			showToast("Éxito", "El usuario ha sido creado correctamente", "success");
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
	if (e.target.classList.contains("userTypeId")) {
		userData.userTypeId = e.target.value;
	} else if (e.target.classList.contains("userName")) {
		userData.userName = e.target.value;
	} else if (e.target.classList.contains("userId")) {
		userData.userId = e.target.value;
	} else if (e.target.classList.contains("userTel")) {
		userData.userTel = e.target.value;
	} else if (e.target.classList.contains("userEmail")) {
		userData.userEmail = e.target.value;
	} else if (e.target.classList.contains("userConfirmEmail")) {
		userData.userConfirmEmail = e.target.value;
	} else if (e.target.classList.contains("userRol")) {
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