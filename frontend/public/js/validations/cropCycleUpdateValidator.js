// Objeto para almacenar los datos del formulario
const cicloCultivo = {
	nombre: "",
	id: "",
	descripcion: "",
	periodoInicio: "",
	periodoFinal: "",
	novedades: "",
	estado: "habilitado", // Valor por defecto
};

// Mapeo entre las clases de los inputs y las propiedades del objeto cicloCultivo
const mapeoClases = {
	"form__input--cycle-name": "nombre",
	"form__input--cycle-id": "id",
	"form__textarea--cycle-description": "descripcion",
	"form__input--cycle-start-date": "periodoInicio",
	"form__input--cycle-end-date": "periodoFinal",
	"form__textarea--cycle-updates": "novedades",
};

// Seleccionar elementos del formulario usando las nuevas clases BEM
const form = document.querySelector(".form__container");
const nombre = document.querySelector(".form__input--cycle-name");
const idInput = document.querySelector(".form__input--cycle-id");
const descripcion = document.querySelector(".form__textarea--cycle-description");
const periodoInicio = document.querySelector(".form__input--cycle-start-date");
const periodoFinal = document.querySelector(".form__input--cycle-end-date");
const novedades = document.querySelector(".form__textarea--cycle-updates");
const estadoRadios = document.querySelectorAll('input[name="estado-habilitado"]');

// --- NUEVO: Cargar datos del ciclo existente al abrir la página ---
window.addEventListener('DOMContentLoaded', async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const cicloId = urlParams.get('id');
	if (cicloId) {
		try {
			const res = await fetch(`http://localhost:5000/ciclo_cultivo/${cicloId}`);
			if (!res.ok) throw new Error('No se pudo cargar el ciclo de cultivo');
			const data = await res.json();
			// Llenar los campos
			nombre.value = data.nombre || '';
			idInput.value = data.id || '';
			descripcion.value = data.descripcion || '';
			periodoInicio.value = data.periodoInicio ? data.periodoInicio.slice(0,10) : '';
			periodoFinal.value = data.periodoFinal ? data.periodoFinal.slice(0,10) : '';
			novedades.value = data.novedades || '';
			// Estado
			if (data.estado) {
				estadoRadios.forEach(radio => {
					if (radio.value === data.estado.toLowerCase()) radio.checked = true;
				});
			}
			// Actualizar objeto cicloCultivo
			cicloCultivo.nombre = nombre.value;
			cicloCultivo.id = idInput.value;
			cicloCultivo.descripcion = descripcion.value;
			cicloCultivo.periodoInicio = periodoInicio.value;
			cicloCultivo.periodoFinal = periodoFinal.value;
			cicloCultivo.novedades = novedades.value;
			cicloCultivo.estado = (data.estado || 'habilitado').toLowerCase();
		} catch (e) {
			showAlert('No se pudo cargar el ciclo de cultivo.', true);
		}
	}
});

// Evento para capturar datos en tiempo real usando clases BEM
form.addEventListener("input", (e) => {
	const className = Array.from(e.target.classList).find((cls) =>
		mapeoClases.hasOwnProperty(cls)
	);

	if (className) {
		cicloCultivo[mapeoClases[className]] = e.target.value.trim();
		//console.log(cicloCultivo); // Ver el objeto actualizado en consola
	}
});

// Evento para capturar el estado seleccionado
estadoRadios.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		cicloCultivo.estado = e.target.value;
		//console.log("Estado seleccionado:", cicloCultivo.estado);
	});
});

// Bloquear teclas que no sean números en el campo ID
idInput.addEventListener("keydown", (e) => {
	const teclasPermitidas = [
		"Backspace",
		"Tab",
		"Enter",
		"ArrowLeft",
		"ArrowRight",
		"Delete",
	];
	if (!/^[0-9]$/.test(e.key) && !teclasPermitidas.includes(e.key)) {
		e.preventDefault(); // Bloquear la tecla
	}
});

// Evento para validar y guardar los datos al enviar el formulario
form.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Validaciones
	if (!cicloCultivo.nombre)
		return showAlert("El nombre del ciclo de cultivo es obligatorio.", true);
	if (!cicloCultivo.id || isNaN(cicloCultivo.id))
		return showAlert("El ID debe ser un número válido.", true);
	if (!cicloCultivo.descripcion)
		return showAlert("La descripción no puede estar vacía.", true);
	if (!cicloCultivo.periodoInicio || !cicloCultivo.periodoFinal)
		return showAlert("Las fechas de inicio y final son obligatorias.", true);
	if (
		new Date(cicloCultivo.periodoInicio) > new Date(cicloCultivo.periodoFinal)
	)
		return showAlert(
			"La fecha de inicio no puede ser mayor que la fecha final.",
			true
		);
	if (!cicloCultivo.novedades)
		return showAlert("Debe ingresar novedades del ciclo de cultivo.", true);

	// --- NUEVO: Enviar datos actualizados al backend ---
	try {
		const res = await fetch(`http://localhost:5000/ciclo_cultivo/${cicloCultivo.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				nombre: cicloCultivo.nombre,
				descripcion: cicloCultivo.descripcion,
				periodoInicio: cicloCultivo.periodoInicio,
				periodoFinal: cicloCultivo.periodoFinal,
				novedades: cicloCultivo.novedades,
				estado: cicloCultivo.estado
			})
		});
		if (!res.ok) throw new Error('No se pudo actualizar el ciclo de cultivo');
		showAlert("Ciclo de cultivo actualizado correctamente.");
		setTimeout(() => {
			window.location.href = "listar-ciclos-cultivo.html";
		}, 1000);
	} catch (err) {
		showAlert("Error al actualizar el ciclo de cultivo.", true);
	}
});

// Función para mostrar alertas personalizadas
function showAlert(message, error = false) {
	const alert = document.createElement("p");
	alert.textContent = message;
	alert.classList.add("alert", error ? "error" : "correct");

	form.appendChild(alert);
	setTimeout(() => alert.remove(), 5000);
}
