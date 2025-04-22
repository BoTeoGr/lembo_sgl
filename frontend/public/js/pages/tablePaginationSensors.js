// Configuración de la paginación
const rowsPerPage = 6; // Número de filas por página
let currentPage = 1; // Página actual
let totalPages = 0; // Total de páginas

// Elementos del DOM
const tableBody = document.querySelector(".table__body");
const prevPageButton = document.querySelector(".pagination__button--prev");
const nextPageButton = document.querySelector(".pagination__button--next");
const paginationInfo = document.querySelector(".pagination__info");
const elementsCount = document.querySelector(".table__count-number");

// URL de la API
const apiUrl = "http://localhost:5000/sensor"; // Cambia esta URL según tu backend

// Función para obtener los sensores desde la API
async function fetchSensors(page) {
    try {
        // Realizar la solicitud a la API con la página actual y el número de filas por página
        const response = await fetch(`${apiUrl}?page=${page}&limit=${rowsPerPage}`);
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();

        // Verificar si hay datos
        if (!data.sensores || data.sensores.length === 0) {
            showAlert("No se encontraron sensores.", true);
            tableBody.innerHTML = "<tr><td colspan='5'>No hay sensores disponibles.</td></tr>";
            return;
        }

        // Actualizar la tabla y la información de la paginación
        renderTable(data.sensores);
        totalPages = data.totalPages; // Total de páginas devuelto por la API
        elementsCount.textContent = data.totalSensores; // Total de sensores
        updatePaginationInfo();
    } catch (error) {
        console.error("Error al obtener los sensores:", error);
        showAlert("Error al cargar los sensores. Intenta nuevamente.", true);
    }
}

// Función para renderizar los datos de un sensor en el modal
function renderSensorDetails(container, sensor) {
    container.innerHTML = `
        <p><strong>ID:</strong> ${sensor.id}</p>
        <p><strong>Nombre:</strong> ${sensor.nombre_sensor}</p>
        <p><strong>Tipo de Sensor:</strong> ${sensor.tipo_sensor}</p>
        <p><strong>Unidad de Medida:</strong> ${sensor.unidad_medida}</p>
        <p><strong>Tiempo de escaneo:</strong> ${sensor.tiempo_escaneo}</p>
        <p><strong>Id del Usuario:</strong> ${sensor.usuario_id}</p>
        <p><strong>Descripción:</strong> ${sensor.descripcion}</p>
        <p><strong>Estado:</strong> ${sensor.estado}</p>
        <p><strong>Fecha de creacion del sensor:</strong> ${sensor.fecha_creacion}</p>
    `;
}

// Función para renderizar la tabla
function renderTable(sensors) {
    // Limpiar el cuerpo de la tabla
    tableBody.innerHTML = "";

    // Agregar las filas correspondientes a los sensores
    sensors.forEach((sensor) => {
        const row = document.createElement("tr");
        row.classList.add("table__row");

        row.innerHTML = `
            <td class="table__cell" data-Label="ID">${sensor.id}</td>
            <td class="table__cell" data-Label="Nombre">${sensor.nombre_sensor}</td>
            <td class="table__cell" data-Label="Tipo de Sensor">${sensor.tipo_sensor}</td>
            <td class="table__cell" data-Label="Unidad de Medida">${sensor.unidad_medida}</td>
            <td class="table__cell table__cell--status" data-Label="Estado">
                <span class="table__status table__status--${sensor.estado === "habilitado" ? "enabled" : "disabled"}"></span>
                <span class="status-text">${sensor.estado}</span>
            </td>
        `;

        // Agregar evento de clic para abrir el modal
        row.addEventListener("click", () => {
            openModal(sensor, renderSensorDetails);
        });

        tableBody.appendChild(row);
    });
}

// Función para actualizar la información de la paginación
function updatePaginationInfo() {
    paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

// Función para cambiar de página
function changePage(direction) {
    currentPage += direction;
    fetchSensors(currentPage);
}

// Eventos de los botones de paginación
prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

// Renderizar la tabla inicial
fetchSensors(currentPage);

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

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}