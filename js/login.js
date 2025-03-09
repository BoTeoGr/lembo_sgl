const userLogin ={
    password: '',
    email: '',
    
}

//Seleccionando elementos 
const password = document.querySelector('#password');
const email = document.querySelector('#email');
const form = document.querySelector('.login__form');

//inputs
form.addEventListener('input', readText)
email.addEventListener('input', readText);
password.addEventListener('input', readText);


//Evento submit
form.addEventListener('submit', function(e){
    e.preventDefault();
    const{email,password} = userLogin;
 
    if(email.trim() === '' || password.trim() === ''){
    
       showAlert('Todos los campos son obligatorio', true)
        return;
    }
     showAlert('Tu datos han sido enviado sastifactoriamente')
})

function showAlert(message, error = false){
    const alert = document.createElement('P')

    alert.textContent = message;
    alert.classList.add('alert');

    if (error){
        alert.classList.add('error')
    }else{
        alert.classList.add('correct')
    }
    form.appendChild(alert)

    setTimeout(()=> {
        alert.remove()
     },5000)
}

//Collback o funcion
function readText(e){
    userLogin[e.target.id] = e.target.value;
}




