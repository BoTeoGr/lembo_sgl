// Código que impide que el usuario ingrese números en un input de texto
document.querySelector(".userNameSensor").addEventListener("keydown", function(e){
    if (e.key >= "0" && e.key <= "9"){
        e.preventDefault();
        console.log("Número bloqueado");
    }
});

document.querySelector(".button").addEventListener('keydown', function(e){
    if (e.key === "Enter"){
        e.preventDefault();
        console.log("Enter bloqueado");
    }
})

// Objeto para almacenar datos del usuario
const userData = {
    userType: '',
    userNameSensor: '',
    userMedida: '',
    userImage: '',
    UserDescription: '',
    userId: '',
    userEscaneo: ''
};

const userForm = document.querySelector('.userForm');

// Definir variables sin espacios incorrectos
const userType = document.querySelector('.userType');
const userNameSensor = document.querySelector('.userNameSensor');
const userMedida = document.querySelector('.userMedida');
const userImage = document.querySelector('.userImage');
const UserDescription = document.querySelector('.UserDescription');
const userId = document.querySelector('.userId');
const userEscaneo = document.querySelector('.userEscaneo');

// Agregar eventos sin errores de nombres
userType.addEventListener('change', readText);
userNameSensor.addEventListener('input', readText);
userMedida.addEventListener('change', readText);
userImage.addEventListener('input', readText);
UserDescription.addEventListener('input', readText);
userId.addEventListener('input', readText);
userEscaneo.addEventListener('input', readText);

// Función para validar el formulario antes de enviarlo
userForm.addEventListener('submit', function(e){
    e.preventDefault(); // Prevenir la recarga de la página

    const { userType, userNameSensor, userMedida, userImage, UserDescription, userId, userEscaneo } = userData;

    // Validación de los campos
    if (userType === '' || userNameSensor === '' || userMedida === '' || userImage === '' || UserDescription === '' || userId === '' || userEscaneo === '') {
        showAlert('Todos los campos son obligatorios', true); // Mostrar mensaje de error si hay campos vacíos
        return; // No hacer nada más y no redirigir
    }

    // Si todos los campos son válidos
    showAlert('Tus datos han sido enviados.'); // Mostrar alerta de éxito

    // Redirigir después de que la alerta desaparezca
    setTimeout(() => {
        window.location.href = 'listar-sensores.html'; // Redirigir a la página
    }, 1000); // Retraso de 5 segundos para permitir que la alerta sea visible
});

// Función para mostrar alertas en el formulario
function showAlert(message, error = null){
    const alert = document.createElement('P');
    alert.textContent = message;
    if (error){
        alert.classList.add('error')
    }else{
        alert.classList.add('correct')
    }
    userForm.appendChild(alert);

    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Función para capturar los valores de los inputs
function readText(e) {
    if (e.target.classList.contains('userType')) {
        userData.userType = e.target.value;
    } else if (e.target.classList.contains('userNameSensor')) {
        userData.userNameSensor = e.target.value;
    } else if (e.target.classList.contains('userMedida')) {
        userData.userMedida = e.target.value;
    } else if (e.target.classList.contains('userImage')) { // Corregido: eliminé el espacio extra
        userData.userImage = e.target.value;
    } else if (e.target.classList.contains('UserDescription')) {
        userData.UserDescription = e.target.value;
    } else if (e.target.classList.contains('userId')) {
        userData.userId = e.target.value;
    } else if (e.target.classList.contains('userEscaneo')) {
        userData.userEscaneo = e.target.value;
    }

    console.log(userData); // Ver los valores almacenados en userData para asegurarte de que se actualicen correctamente
}
