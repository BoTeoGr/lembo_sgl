// Bloquear números en el campo de nombre
document.querySelectorAll("#nombre").forEach(function(element) {
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

// Objeto para almacenar los datos del usuario
const userData = {
    userName: "",
    userId: "",
    userDescription: "",
    userDateInicio: "",
    userDateFinal: "",
    UserNovedades: "",
    userStatus: ""
};

// Selección del formulario
const userForm = document.querySelector("form");

// Verificar que el formulario exista antes de agregar eventos
if (userForm) {
    const userName = document.querySelector("#nombre");
    const userId = document.querySelector("#id");
    const userDescription = document.querySelector("#descripcion");
    const userDateInicio = document.querySelector("#periodo-inicio");
    const userDateFinal = document.querySelector("#periodo-final");
    const UserNovedades = document.querySelector("#novedades");
    const userStatusRadios = document.querySelectorAll("input[name='estado-habilitado']");

    // Agregar eventos para capturar los datos
    userName.addEventListener("input", readText);
    userId.addEventListener("input", readText);
    userDescription.addEventListener("input", readText);
    userDateInicio.addEventListener("input", readText);
    userDateFinal.addEventListener("input", readText);
    UserNovedades.addEventListener("input", readText);
    userStatusRadios.forEach(radio => radio.addEventListener("change", readText));

    // Validar y enviar el formulario
    userForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevenir la recarga de la página

        const { userName, userId, userDescription, userDateInicio, userDateFinal, UserNovedades, userStatus } = userData;

        // Validación de los campos
        if (!userName || !userId || !userDescription || !userDateInicio || !userDateFinal || !UserNovedades || !userStatus) {
            showAlert("Todos los campos son obligatorios", true);
            return;
        }

        // Mostrar mensaje de éxito
        showAlert("Tus datos han sido enviados.");

        // Redirigir después de mostrar el mensaje
        setTimeout(() => {
            window.location.href = "listar-ciclo-cultivos.html"; // Asegúrate de que la ruta sea correcta
        }, 1000);
    });
}

// Función para mostrar alertas en el formulario
function showAlert(message, error = null) {
    const alert = document.createElement('P');
    alert.textContent = message;
    alert.classList.add('alert'); // Añadir clase 'alert'

    if (error) {
        alert.classList.add('error');
    } else {
        alert.classList.add('correct');
    }
    userForm.appendChild(alert);

    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Función para capturar los valores de los inputs
function readText(e) {
    const field = e.target.id || e.target.name; // Obtener el id o name del input

    if (field === 'estado-habilitado') {
        userData.userStatus = e.target.value;
    } else if (field in userData) {
        userData[field] = e.target.value;
    }

    console.log(userData); // Ver los valores almacenados en userData para asegurarte de que se actualicen correctamente
}