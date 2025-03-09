const recuperar = {
    emailRecuperar: ''
}
// oSelelcciono los elementos
const emailRecuperar = document.querySelector('#emailRecuperar');
const login__form = document.querySelector('.login__form')


// guardo los valores de los input que seran usando por el callback readText
login__form.addEventListener('input',readText);
emailRecuperar.addEventListener('input',readText);

//Evento submit
login__form.addEventListener('submit', function(e){
    e.preventDefault();
    const { emailRecuperar } = recuperar; // Cambiado a recuperar.emailRecuperar
 
    if (emailRecuperar === '') {
        showAlert('Este campo es obligatorios', true);
        return;
    }

    // Uso la funcion validarEmail para verificar que si sea un correo
    if (!validarEmail(emailRecuperar)) {
        showAlert('El correo no es válido', true);
        return;
    }

    showAlert('Tu correo ha sido enviado satisfactoriamente');

    setTimeout(() => {
        window.location.href = "../pages/login-codigo-recuperar.html"; // Asegúrate de que la ruta sea correcta
    }, 1000);
})

// Esta funcion valida que sea un correo y que cumpla con el formato de uno
function validarEmail(emailRecuperar) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(emailRecuperar);
}

function showAlert(message, error = null){
    const alert = document.createElement('P');
    alert.textContent = message;

    if (error){
        alert.classList.add('error');
    } else {
        alert.classList.add('correct');
    }
    login__form.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

//Collback o funcion
function readText(e){
    if (e.target.id === 'emailRecuperar'){
        recuperar.emailRecuperar = e.target.value;
    }
    console.log(recuperar);
}

