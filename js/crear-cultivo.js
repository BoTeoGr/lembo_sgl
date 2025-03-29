// Bloquear números en los campos 'userName' y 'typeCrop'
document.querySelectorAll(".userName, .typeCrop").forEach(function (element) {
    element.addEventListener("keydown", function (e) {
        if (e.key >= "0" && e.key <= "9") {
            e.preventDefault();
            console.log("Número bloqueado en el campo");
        }
    });
});

// Bloquear Enter en el botón para evitar recargas accidentales
document.querySelector(".button--submit").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        console.log("Enter bloqueado en el botón de envío");
    }
});

// Objeto para almacenar los datos del cultivo
const cultivoData = {
    userName: "",          // Corresponde a 'nombre'
    typeCrop: "",          // Corresponde a 'tipo'
    userImage: "",         // Corresponde a 'imagen'
    userLocation: "",      // Corresponde a 'ubicacion'
    userDescription: "",   // Corresponde a 'descripcion'
    userId: 1,             // Corresponde a 'usuario_id'
};

// Selección del formulario
const cultivoForm = document.querySelector(".userForm");

// Definir variables para los campos del formulario
const userName = document.querySelector(".userName");
const typeCrop = document.querySelector(".typeCrop");
const userImage = document.querySelector(".userImage");
const userLocation = document.querySelector(".userLocation");
const userDescription = document.querySelector(".userDescription");
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los datos
userName.addEventListener("input", readText);
typeCrop.addEventListener("input", readText);
userImage.addEventListener("input", readText);
userLocation.addEventListener("input", readText);
userDescription.addEventListener("input", readText);

// Función para capturar los valores de los inputs
function readText(e) {
    if (e.target.classList.contains("userName")) {
        cultivoData.userName = e.target.value;
    } else if (e.target.classList.contains("typeCrop")) {
        cultivoData.typeCrop = e.target.value;
    } else if (e.target.classList.contains("userImage")) {
        cultivoData.userImage = e.target.value;
    } else if (e.target.classList.contains("userLocation")) {
        cultivoData.userLocation = e.target.value;
    } else if (e.target.classList.contains("userDescription")) {
        cultivoData.userDescription = e.target.value;
    }
    console.log(cultivoData); // Ver los valores almacenados en cultivoData
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
        userName,
        typeCrop,
        userImage,
        userLocation,
        userDescription,
        userId
    } = cultivoData;

    // Validación de los campos
    if (
        !userName ||
        !typeCrop ||
        !userImage ||
        !userLocation ||
        !userDescription ||
        userId === ""
    ) {
        showAlert("Todos los campos son obligatorios", true);
        return;
    }

    showAlert("Tus datos han sido enviados."); // Mostrar alerta de éxito

    // Redirigir después de que la alerta desaparezca
    setTimeout(() => {
        window.location.href = "listar-cultivos.html"; // Asegúrate de que la ruta sea correcta
    }, 1000);
});

// Función para enviar los datos del cultivo al servidor
submitButton.addEventListener("click", async () => {
    if (
        !cultivoData.userName ||
        !cultivoData.typeCrop ||
        !cultivoData.userImage ||
        !cultivoData.userLocation ||
        !cultivoData.userDescription
    ) {
        showAlert("Todos los campos son obligatorios", true);
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/cultivos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cultivoData),
        });
        const data = await response.json();

        if (response.ok) {
            showAlert("Cultivo creado exitosamente", false);
        } else {
            showAlert(data.error || "Error al crear el cultivo", true);
        }
    } catch (error) {
        console.log(error);
        showAlert("Error al comunicarse con el servidor", true);
    }
});