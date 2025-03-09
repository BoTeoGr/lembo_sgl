const codigoRecuperar = {
    codigo: ''
}

// Seleccionando elementos
const loginForm = document.querySelector('.login__form');
const codigoInput = document.querySelector('#input_num');

// Bloquear letras en el input de código
codigoInput.addEventListener("keydown", function(e){
    if (e.key === "Backspace" || e.key === "Tab" || e.key === "Enter" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        return; // No bloquear estas teclas
    }

    // Bloquear cualquier tecla que NO sea un número
    if (e.key < "0" || e.key > "9") {
        e.preventDefault();
        console.log("Solo se permiten números");
    }
});

// Añadir eventos de input
loginForm.addEventListener('input', readText);
codigoInput.addEventListener('input', readText);

// Evento submit
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const { codigo } = codigoRecuperar;
 
    if (codigo === '') {
        showAlert('Este campo es obligatorio', true);
        return;
    }
    showAlert('Tu correo ha sido enviado satisfactoriamente');
    setTimeout(() => {
        window.location.href = "../index.html"; // Asegúrate de que la ruta sea correcta
    }, 500);
});

// Función para mostrar alertas
function showAlert(message, error = null){
    const alert = document.createElement('P');
    alert.textContent = message;
    alert.classList.add('alert'); // Añadir clase 'alert'

    if (error){
        alert.classList.add('error');
    } else {
        alert.classList.add('correct');
    }
    loginForm.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Función para leer el texto del input
function readText(e){
    if (e.target.id === 'input_num'){
        codigoRecuperar.codigo = e.target.value;
    }
    console.log(codigoRecuperar);
}