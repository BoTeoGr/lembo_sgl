// Código que impide que el usuario ingrese números en un input de texto
document.querySelector(".userNameSensor").addEventListener("keydown", function (e) {
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
    userType: "",
    userNameSensor: "",
    userMedida: "",
    userImage: "",
    userDescription: "",
    userEscaneo: "",
    userId: 1, // Valor predeterminado para userId
};

// Selección de elementos del formulario
const userForm = document.querySelector(".userForm");
const userType = document.querySelector(".userType");
const userNameSensor = document.querySelector(".userNameSensor");
const userMedida = document.querySelector(".userMedida");
const userImage = document.querySelector(".userImage");
const userDescription = document.querySelector(".userDescription");
const userEscaneo = document.querySelector(".userEscaneo");
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los valores de los inputs
userType.addEventListener("change", readText);
userNameSensor.addEventListener("input", readText);
userMedida.addEventListener("change", readText);
userImage.addEventListener("input", readText);
userDescription.addEventListener("input", readText);
userEscaneo.addEventListener("change", readText);

// Función para capturar los valores de los inputs
function readText(e) {
    if (e.target.classList.contains("userType")) {
        sensorData.userType = e.target.value;
    } else if (e.target.classList.contains("userNameSensor")) {
        sensorData.userNameSensor = e.target.value;
    } else if (e.target.classList.contains("userMedida")) {
        sensorData.userMedida = e.target.value;
    } else if (e.target.classList.contains("userImage")) {
        sensorData.userImage = e.target.value;
    } else if (e.target.classList.contains("userDescription")) {
        sensorData.userDescription = e.target.value;
    } else if (e.target.classList.contains("userEscaneo")) {
        sensorData.userEscaneo = e.target.value;
    }

    console.log(sensorData); // Ver los valores almacenados en sensorData
}

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
    const alert = document.createElement("P");
    alert.textContent = message;
    alert.classList.add(error ? "error" : "correct");
    userForm.appendChild(alert);

    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Función para validar los datos del sensor
function validateSensorData() {
    const requiredFields = [
        { field: "userType", label: "Tipo de sensor" },
        { field: "userNameSensor", label: "Nombre del sensor" },
        { field: "userMedida", label: "Medida" },
        { field: "userImage", label: "Imagen" },
        { field: "userDescription", label: "Descripción" },
        { field: "userEscaneo", label: "Escaneo" },
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
userForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir la recarga de la página

    const {
        userType,
        userNameSensor,
        userMedida,
        userImage,
        userDescription,
        userEscaneo,
        userId,
    } = sensorData;

    // Validación de los campos
    if (
        userType === "" ||
        userNameSensor === "" ||
        userMedida === "" ||
        userImage === "" ||
        userDescription === "" ||
        userEscaneo === "" ||
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
    if (!validSensorTypes.includes(userType)) {
        showAlert("Tipo de sensor no válido", true);
        return;
    }

    // Validar que la unidad de medida sea válida
    const validUnits = ["Temperatura", "Distancia", "Presión"];
    if (!validUnits.includes(userMedida)) {
        showAlert("Unidad de medida no válida", true);
        return;
    }

    // Validar que el tiempo de escaneo sea válido
    const validScanTimes = [
        "Sensores lentos",
        "Sensores de velocidad media",
        "Sensores rápidos",
    ];
    if (!validScanTimes.includes(userEscaneo)) {
        showAlert("Tiempo de escaneo no válido", true);
        return;
    }

    // Si todos los campos son válidos
    showAlert("Tus datos han sido enviados.");

    // Redirigir después de que la alerta desaparezca
	setTimeout(() => {
        window.location.href = "listar-usuarios.html"; // Asegúrate de que la ruta sea correcta
    }, 1000);
// Retraso de 5 segundos para permitir que la alerta sea visible
});

// Función para enviar los datos del sensor al servidor
submitButton.addEventListener("click", async () => {
    if (!validateSensorData()) {
        return;
    }

    try {
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
        } else {
            showAlert(data.error || "Error al crear el sensor", true);
        }
    } catch (error) {
        console.log(error);
        showAlert("Error al comunicarse con el servidor", true);
    }
});

// Olvide este comentario