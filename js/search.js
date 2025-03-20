// Escuchar el evento 'input' en el campo de búsqueda
document.getElementById("searchInput").addEventListener("input", function () {
	// Obtener el término de búsqueda y convertirlo a minúsculas para hacer la búsqueda insensible a mayúsculas
	const searchTerm = this.value.toLowerCase();

	// Obtener todas las filas de la tabla (dentro del tbody)
	const rows = document.querySelectorAll("#dataTable tbody tr");

	// Obtener el tbody de la tabla para poder reorganizar las filas
	const tbody = document.querySelector("#dataTable tbody");

	// Crear dos arrays para separar las filas que coinciden y las que no coinciden con la búsqueda
	const matchedRows = []; // Filas que coinciden con el término de búsqueda
	const nonMatchedRows = []; // Filas que NO coinciden con el término de búsqueda

	// Recorrer cada fila de la tabla
	rows.forEach((row) => {
		// Obtener el contenido de la celda 'Nombre' y convertirlo a minúsculas
		const nameText = row
			.querySelector('td[data-Label="Nombre"]')
			.textContent.toLowerCase();

		// Verificar si el texto de la celda 'Nombre' incluye el término de búsqueda
		if (nameText.includes(searchTerm)) {
			// Si coincide, agregar la fila al array de coincidencias
			matchedRows.push(row);
		} else {
			// Si no coincide, agregar la fila al array de no coincidencias
			nonMatchedRows.push(row);
		}
	});

	// Limpiar el contenido actual del tbody para reorganizar las filas
	tbody.innerHTML = "";

	// Agregar primero las filas que coinciden con la búsqueda
	matchedRows.forEach((row) => tbody.appendChild(row));

	// Luego agregar las filas que NO coinciden con la búsqueda
	nonMatchedRows.forEach((row) => tbody.appendChild(row));
});
