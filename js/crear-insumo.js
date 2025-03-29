// Código que impide que el usuario ingrese números en un input de texto
document.querySelector(".userName").addEventListener("keydown", function (e) {
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
    userName: "",
    userType: "",
    userImage: "",
    userExtent: "",
    userDescription: "",
    userPrice: "",
    userAmount: "",
    totalValue: "",
    userId: 1, // Valor predeterminado para userId
};

// Selección de elementos del formulario
const userForm = document.querySelector(".userForm");
const userName = document.querySelector(".userName");
const userType = document.querySelector(".userType");
const userImage = document.querySelector(".userImage");
const userExtent = document.querySelector(".userExtent");
const userDescription = document.querySelector(".userDescription");
const userPrice = document.querySelector(".userPrice");
const userAmount = document.querySelector(".userAmount");
const totalValue = document.querySelector(".totalValue");
const submitButton = document.querySelector(".button--submit");

// Agregar eventos para capturar los valores de los inputs
userType.addEventListener("change", readText);
userName.addEventListener("input", readText);
userExtent.addEventListener("change", readText);
userImage.addEventListener("input", readText);
userDescription.addEventListener("input", readText);
userPrice.addEventListener("input", readText);
userAmount.addEventListener("input", readText);

// Función para calcular el valor total automáticamente
function calculateTotal() {
    const price = parseFloat(userPrice.value) || 0;
    const amount = parseInt(userAmount.value) || 0;
    const total = (price * amount).toFixed(2);

    totalValue.value = total;
    insumoData.totalValue = total;
}

userPrice.addEventListener("input", calculateTotal);
userAmount.addEventListener("input", calculateTotal);


// Función para capturar los valores de los inputs
function readText(e) {
    if (e.target.classList.contains("userName")) {
        insumoData.userName = e.target.value;
    } else if (e.target.classList.contains("userType")) {
        insumoData.userType = e.target.value;
    } else if (e.target.classList.contains("userImage")) {
        insumoData.userImage = e.target.value;
    } else if (e.target.classList.contains("userExtent")) {
        insumoData.userExtent = e.target.value;
    } else if (e.target.classList.contains("userDescription")) {
        insumoData.userDescription = e.target.value;
    } else if (e.target.classList.contains("userPrice")) {
        insumoData.userPrice = e.target.value;
    } else if (e.target.classList.contains("userAmount")) {
        insumoData.userAmount = e.target.value;
    } else if (e.target.classList.contains("totalValue")) {
        insumoData.totalValue = e.target.value;
    }

    console.log(insumoData); // Ver los valores almacenados en insumoData
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

// Función para validar los datos del insumo
function validateInsumoData() {
    const requiredFields = [
        { field: "userName", label: "Nombre del insumo" },
        { field: "userType", label: "Tipo de insumo" },
        { field: "userImage", label: "Imagen" },
        { field: "userExtent", label: "Unidad de medida" },
        { field: "userDescription", label: "Descripción" },
        { field: "userPrice", label: "Precio unitario" },
        { field: "userAmount", label: "Cantidad" },
        { field: "totalValue", label: "Valor total" },
    ];

    for (const field of requiredFields) {
        if (!insumoData[field.field]) {
            showAlert(`Por favor, complete el campo ${field.label}`, true);
            return false;
        }
    }

    // Validar que los valores numéricos sean válidos
    if (isNaN(insumoData.userPrice) || insumoData.userPrice <= 0) {
        showAlert("El precio unitario debe ser un número válido mayor a 0", true);
        return false;
    }

    if (isNaN(insumoData.userAmount) || insumoData.userAmount <= 0) {
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
userForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir la recarga de la página

    const {
        userName,
        userType,
        userImage,
        userExtent,
        userDescription,
        userPrice,
        userAmount,
        totalValue,
        userId,
    } = insumoData;

    // Validación de los campos
    if (
        userName === "" ||
        userType === "" ||
        userImage === "" ||
        userExtent === "" ||
        userDescription === "" ||
        userPrice === "" ||
        userAmount === "" ||
        totalValue === "" ||
        userId === ""
    ) {
        showAlert("Todos los campos son obligatorios", true);
        return;
    }

    // Validar que la unidad de medida sea válida
    const validUnits = ["peso", "volumen", "superficie", "Concentración"];
    if (!validUnits.includes(userExtent)) {
        showAlert("Unidad de medida no válida", true);
        return;
    }

    // Si todos los campos son válidos
    showAlert("Tus datos han sido enviados.");

    // Redirigir después de que la alerta desaparezca
    setTimeout(() => {
        window.location.href = "listar-insumos.html"; // Asegúrate de que la ruta sea correcta
    }, 1000);
});

// Función para enviar los datos del insumo al servidor
submitButton.addEventListener("click", async () => {
    if (!validateInsumoData()) {
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/insumos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(insumoData),
        });
        const data = await response.json();

        if (response.ok) {
            showAlert("Insumo creado exitosamente", false);
        } else {
            showAlert(data.error || "Error al crear el insumo", true);
        }
    } catch (error) {
        console.log(error);
        showAlert("Error al comunicarse con el servidor", true);
    }
});