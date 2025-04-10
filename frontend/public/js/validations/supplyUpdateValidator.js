// Objeto para almacenar los datos del formulario
const insumo = {
	nombre: "",
	tipo: "",
	id: "",
	medida: "",
	valorUnitario: "",
	cantidad: "",
	valorTotal: "",
	descripcion: "",
	estado: "habilitado",
};

// Seleccionar elementos usando las nuevas clases BEM
const form = document.querySelector(".form__container");
const nombre = document.querySelector(".form__input--insume-name");
const tipo = document.querySelector(".form__input--insume-type");
const id = document.querySelector(".form__input--insume-id");
const medida = document.querySelector(".form__select--insume-extent");
const valorUnitario = document.querySelector(".form__input--insume-price");
const cantidad = document.querySelector(".form__input--insume-amount");
const valorTotal = document.querySelector(".form__input--total-value");
const descripcion = document.querySelector(".form__textarea--insume-description");
const estadoRadios = document.querySelectorAll(
	'input[name="estado-habilitado"]'
);

//  Función para bloquear teclas que no sean números
function bloquearTeclasNoNumericas(input) {
	input.addEventListener("keydown", (e) => {
		const teclasPermitidas = [
			"Backspace",
			"Tab",
			"Enter",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
		];
		if (!/^[0-9]$/.test(e.key) && !teclasPermitidas.includes(e.key)) {
			e.preventDefault();
		}
	});
}

// Aplicar la restricción a los campos numéricos
bloquearTeclasNoNumericas(id);
bloquearTeclasNoNumericas(valorUnitario);
bloquearTeclasNoNumericas(cantidad);
bloquearTeclasNoNumericas(valorTotal);

// Actualizar los selectores en el evento input
form.addEventListener("input", (e) => {
    const className = e.target.classList;
    if (className.contains("form__input--insume-name")) insumo.nombre = e.target.value;
    if (className.contains("form__input--insume-type")) insumo.tipo = e.target.value;
    if (className.contains("form__input--insume-id")) insumo.id = e.target.value;
    if (className.contains("form__select--insume-extent")) insumo.medida = e.target.value;
    if (className.contains("form__input--insume-price")) insumo.valorUnitario = e.target.value;
    if (className.contains("form__input--insume-amount")) insumo.cantidad = e.target.value;
    if (className.contains("form__input--total-value")) insumo.valorTotal = e.target.value;
    if (className.contains("form__textarea--insume-description")) insumo.descripcion = e.target.value;
    
    console.log(insumo);
});

// Capturar el estado seleccionado
estadoRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		insumo.estado = e.target.value;
	});
});

//  Evento para validar y enviar el formulario
form.addEventListener("submit", (e) => {
	e.preventDefault();

	// Capturar valores en el objeto manualmente
	insumo.nombre = nombre.value.trim();
	insumo.tipo = tipo.value.trim();
	insumo.id = id.value.trim();
	insumo.medida = medida.value;
	insumo.valorUnitario = valorUnitario.value.trim();
	insumo.cantidad = cantidad.value.trim();
	insumo.valorTotal = valorTotal.value.trim();
	insumo.descripcion = descripcion.value.trim();

	// Validaciones
	if (!insumo.nombre)
		return showAlert("El nombre del insumo es obligatorio.", true);
	if (!insumo.tipo)
		return showAlert("Debe especificar el tipo de insumo.", true);
	if (!insumo.id || isNaN(insumo.id))
		return showAlert("El ID debe ser un número válido.", true);
	if (medida.value === "default")
		return showAlert("Debe seleccionar una unidad de medida.", true);
	if (!insumo.valorUnitario || isNaN(insumo.valorUnitario))
		return showAlert("El valor unitario debe ser un número.", true);
	if (!insumo.cantidad || isNaN(insumo.cantidad))
		return showAlert("La cantidad debe ser un número válido.", true);
	if (!insumo.valorTotal || isNaN(insumo.valorTotal))
		return showAlert("El valor total debe ser un número válido.", true);
	if (!insumo.descripcion)
		return showAlert("Debe ingresar una descripción.", true);

	// Si todo está correcto, moestro un mensaje de éxito
	showAlert("Insumo actualizado correctamente.");
	// Redirigir después de mostrar el mensaje
	setTimeout(() => {
		window.location.href = "listar-insumos.html"; // Asegúrate de que la ruta sea correcta
	}, 1000);
	// console.log(insumo);
});

// Función para mostrar alertas
function showAlert(message, error = false) {
	const alert = document.createElement("p");
	alert.textContent = message;
	alert.classList.add("alert");

	if (error) {
		alert.classList.add("error");
	} else {
		alert.classList.add("correct");
	}

	form.appendChild(alert);

	setTimeout(() => {
		alert.remove();
	}, 5000);
}
