// Selecciona todas las celdas de la columna "Nombre"
const nombreCells = document.querySelectorAll(".table__cell:first-child");

// Selecciona el elemento element-display
const elementDisplay = document.querySelector(".element-display");

// Selecciona el botón de cierre del element-display
const closeIcon = document.querySelector(".element-display__close-icon");

// Agrega un evento de clic a cada celda de la columna "Nombre"
nombreCells.forEach((cell) => {
	cell.addEventListener("click", () => {
		// Muestra el element-display
		elementDisplay.style.display = "block";
	});
});

// Agrega un evento de clic al botón de cierre para ocultar el element-display
closeIcon.addEventListener("click", () => {
	elementDisplay.style.display = "none";
});
// Agrega un evento de clic al botón de cierre para ocultar el element-display
closeIcon.addEventListener("click", () => {
	elementDisplay.style.display = "none";
});
