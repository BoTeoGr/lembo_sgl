// Código que impide que el usuario ingrese números en un input de texto
document.querySelector("#input_num").addEventListener("keydown", function(e){
    if(  e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"){
            return; //No bloquear estas teclas
        }

        //Bloquear caulquier tecla que NO sea un numero
    if (e.key < "0" || e.key > "9"){
        e.preventDefault();
        console.log("Solo se permite numeros")
    }
  
})