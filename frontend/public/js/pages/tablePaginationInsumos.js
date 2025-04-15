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
const apiUrl = "http://localhost:5000/insumos"; // Cambia esta URL según tu backend

// Función para obtener los insumos desde la API
async function fetchInsumos(page) {
    try {
        const response = await fetch(`${apiUrl}?page=${page}&limit=${rowsPerPage}`);
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.insumos || data.insumos.length === 0) {
            showAlert("No se encontraron insumos.", true);
            tableBody.innerHTML = "<tr><td colspan='5'>No hay insumos disponibles.</td></tr>";
            return;
        }

        renderTable(data.insumos);
        totalPages = data.totalPages;
        elementsCount.textContent = data.totalInsumos;
        updatePaginationInfo();
    } catch (error) {
        console.error("Error al obtener los insumos:", error);
        showAlert("Error al cargar los insumos. Intenta nuevamente.", true);
    }
}

// Función para renderizar los datos de un insumo en el modal
function renderInsumoDetails(container, insumo) {
    container.innerHTML = `
        <p><strong>Nombre:</strong> ${insumo.insumoId}</p>
        <p><strong>Nombre:</strong> ${insumo.nombre}</p>
        <p><strong>Tipo:</strong> ${insumo.tipo}</p>
        <p><strong>Unidad de Medida:</strong> ${insumo.unidadMedida}</p>
        <p><strong>Valor Unitario:</strong> ${insumo.valorUnitario}</p>
        <p><strong>Cantidad:</strong> ${insumo.cantidad}</p>
        <p><strong>Valor Total:</strong> ${insumo.valorTotal}</p>
        <p><strong>Descripción:</strong> ${insumo.descripcion}</p>
        <p><strong>Estado:</strong> ${insumo.estado}</p>
    `;
}

// Función para renderizar la tabla
function renderTable(insumos) {
    tableBody.innerHTML = "";

    insumos.forEach((insumo) => {
        const row = document.createElement("tr");
        row.classList.add("table__row");

        row.innerHTML = `
            <td class="table__cell" data-Label="Nombre">${insumo.insumoId}</td>
            <td class="table__cell" data-Label="Nombre">${insumo.nombre}</td>
            <td class="table__cell" data-Label="Tipo">${insumo.tipo}</td>
            <td class="table__cell" data-Label="Cantidad">${insumo.cantidad}</td>
            <td class="table__cell" data-Label="Estado">${insumo.estado}</td>
        `;

        row.addEventListener("click", () => {
            openModal(insumo, renderInsumoDetails);
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
    fetchInsumos(currentPage);
}

// Eventos de los botones de paginación
prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

// Renderizar la tabla inicial
fetchInsumos(currentPage);

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