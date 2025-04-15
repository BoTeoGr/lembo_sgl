// Elementos del DOM
const modal = document.querySelector(".modal--hidden");
const closeModalButton = document.querySelector(".modal__close");
const modalContent = document.querySelector(".modal__body");

// Función para abrir el modal con datos dinámicos
function openModal(data, renderFunction) {
    // Limpiar el contenido del modal
    modalContent.innerHTML = "";

    // Renderizar el contenido dinámico usando la función proporcionada
    renderFunction(modalContent, data);

    // Mostrar el modal
    modal.classList.remove("modal--hidden");
}

// Función para cerrar el modal
closeModalButton.addEventListener("click", () => {
    modal.classList.add("modal--hidden");
});

// Cerrar el modal al hacer clic fuera del contenido
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("modal--hidden");
    }
});

