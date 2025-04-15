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
const apiUrl = "http://localhost:5000/cultivos"; // Cambia esta URL según tu backend

// Función para obtener los cultivos desde la API
async function fetchCultivos(page) {
    try {
        // Realizar la solicitud a la API con la página actual y el número de filas por página
        const response = await fetch(`${apiUrl}?page=${page}&limit=${rowsPerPage}`);
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();

        // Verificar si hay datos
        if (!data.cultivos || data.cultivos.length === 0) {
            showAlert("No se encontraron cultivos.", true);
            tableBody.innerHTML = "<tr><td colspan='6'>No hay cultivos disponibles.</td></tr>";
            return;
        }

        // Actualizar la tabla y la información de la paginación
        renderTable(data.cultivos);
        totalPages = data.totalPages; // Total de páginas devuelto por la API
        elementsCount.textContent = data.totalCultivos; // Total de cultivos
        updatePaginationInfo();
    } catch (error) {
        console.error("Error al obtener los cultivos:", error);
        showAlert("Error al cargar los cultivos. Intenta nuevamente.", true);
    }
}

// Función para renderizar los datos de un cultivo en el modal
function renderCultivoDetails(container, cultivo) {
    container.innerHTML = `
        <p><strong>ID:</strong> ${cultivo.id}</p>
        <p><strong>Nombre:</strong> ${cultivo.nombre}</p>
        <p><strong>Tipo:</strong> ${cultivo.tipo}</p>
        <p><strong>Ubicación:</strong> ${cultivo.ubicacion}</p>
        <p><strong>Tamaño:</strong> ${cultivo.tamano}</p>
        <p><strong>Descripción:</strong> ${cultivo.descripcion}</p>
        <p><strong>Estado:</strong> ${cultivo.estado}</p>
        <p><strong>Fecha de Creación:</strong> ${cultivo.fecha_creacion}</p>
    `;
}

// Función para renderizar la tabla
function renderTable(cultivos) {
    tableBody.innerHTML = "";

    cultivos.forEach((cultivo) => {
        const row = document.createElement("tr");
        row.classList.add("table__row");

        row.innerHTML = `
            <td class="table__cell" data-Label="ID">${cultivo.cultivoId}</td>
            <td class="table__cell" data-Label="Nombre">${cultivo.nombre}</td>
            <td class="table__cell" data-Label="Tipo">${cultivo.tipo}</td>
            <td class="table__cell" data-Label="Ubicación">${cultivo.ubicacion}</td>
            <td class="table__cell" data-Label="Tamaño">${cultivo.tamano}</td>
            <td class="table__cell table__cell--status" data-Label="Estado">
                <span class="table__status table__status--${cultivo.estado === "habilitado" ? "enabled" : "disabled"}"></span>
                <span class="status-text">${cultivo.estado}</span>
            </td>
        `;

        // Agregar evento de clic para abrir el modal
        row.addEventListener("click", () => {
            openModal(cultivo, renderCultivoDetails);
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
    fetchCultivos(currentPage);
}

// Eventos de los botones de paginación
prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

// Renderizar la tabla inicial
fetchCultivos(currentPage);

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