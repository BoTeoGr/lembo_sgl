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
const apiUrl = "http://localhost:5000/ciclos-cultivos"; // Cambia esta URL según tu backend

// Función para obtener los ciclos de cultivo desde la API
async function fetchCiclosCultivo(page) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&limit=${rowsPerPage}`);
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Verificar si hay datos
        if (!data.ciclos || data.ciclos.length === 0) {
            showAlert("No se encontraron ciclos de cultivo.", true);
            tableBody.innerHTML = "<tr><td colspan='6'>No hay ciclos de cultivo disponibles.</td></tr>";
            return;
        }

        // Actualizar la tabla y la información de la paginación
        renderTable(data.ciclos);
        currentPage = data.currentPage; // Cambiado de data.page a data.currentPage
        totalPages = data.totalPages;
        elementsCount.textContent = data.totalCiclos;
        updatePaginationInfo();
    } catch (error) {
        console.error("Error al obtener los ciclos de cultivo:", error);
        showAlert("Error al cargar los ciclos de cultivo. Intenta nuevamente.", true);
    }
}

// Función para renderizar los datos de un ciclo de cultivo en el modal
function renderCicloDetails(container, ciclo) {
    container.innerHTML = `
        <p><strong>ID:</strong> ${ciclo.id}</p>
        <p><strong>Nombre:</strong> ${ciclo.nombre}</p>
        <p><strong>Descripción:</strong> ${ciclo.descripcion}</p>
        <p><strong>Periodo Inicio:</strong> ${ciclo.periodo_inicio}</p>
        <p><strong>Periodo Final:</strong> ${ciclo.periodo_final}</p>
        <p><strong>Novedades:</strong> ${ciclo.novedades || "Sin novedades"}</p>
        <p><strong>Estado:</strong> ${ciclo.estado}</p>
        <p><strong>Fecha de Creación:</strong> ${ciclo.fecha_creacion}</p>
    `;
}

// Función para renderizar la tabla
function renderTable(ciclos) {
    tableBody.innerHTML = "";

    ciclos.forEach((ciclo) => {
        const row = document.createElement("tr");
        row.classList.add("table__row");

        row.innerHTML = `
            <td class="table__cell" data-Label="ID">${ciclo.id}</td>
            <td class="table__cell" data-Label="Nombre">${ciclo.nombre}</td>
            <td class="table__cell" data-Label="Periodo Inicio">${ciclo.periodo_inicio}</td>
            <td class="table__cell" data-Label="Periodo Final">${ciclo.periodo_final}</td>
            <td class="table__cell" data-Label="Estado">
                <span class="table__status table__status--${ciclo.estado === "habilitado" ? "enabled" : "disabled"}"></span>
                <span class="status-text">${ciclo.estado}</span>
            </td>
        `;

        // Agregar evento de clic para abrir el modal
        row.addEventListener("click", () => {
            openModal(ciclo, renderCicloDetails);
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
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        fetchCiclosCultivo(currentPage);
    }
}

// Eventos de los botones de paginación
prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

// Renderizar la tabla inicial
fetchCiclosCultivo(currentPage);

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