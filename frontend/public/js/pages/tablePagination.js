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
const apiUrl = "http://localhost:5000/users";

// Función para obtener los usuarios desde la API
async function fetchUsers(page) {
    try {
        // Realizar la solicitud a la API con la página actual y el número de filas por página
        const response = await fetch(`${apiUrl}?page=${page}&limit=${rowsPerPage}`);
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();

        // Verificar si hay datos
        if (!data.usuarios || data.usuarios.length === 0) {
            showAlert("No se encontraron usuarios.", true);
            tableBody.innerHTML = "<tr><td colspan='5'>No hay usuarios disponibles.</td></tr>";
            return;
        }

        // Actualizar la tabla y la información de la paginación
        renderTable(data.usuarios);
        totalPages = data.totalPages; // Total de páginas devuelto por la API
        elementsCount.textContent = data.totalUsuarios; // Total de usuarios
        updatePaginationInfo();
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        showAlert("Error al cargar los usuarios. Intenta nuevamente.", true);
    }
}

// Función para renderizar los datos de un usuario en el modal
function renderUserDetails(container, user) {
    container.innerHTML = `
        <p><strong>Nombre:</strong> ${user.id}</p>
        <p><strong>Nombre:</strong> ${user.nombre}</p>
        <p><strong>Nombre:</strong> ${user.tipo_documento}</p>
        <p><strong>ID:</strong> ${user.numero_documento}</p>
        <p><strong>Tipo de Usuario:</strong> ${user.rol}</p>
        <p><strong>Teléfono:</strong> ${user.correo}</p>
        <p><strong>Estado:</strong> ${user.estado}</p>
        <p><strong>Teléfono:</strong> ${user.telefono}</p>
        <p><strong>Fecha de creacion del usuario:</strong> ${user.fecha_creacion}</p>
    `;
}
// Función para renderizar la tabla
function renderTable(users) {
    // Limpiar el cuerpo de la tabla
    tableBody.innerHTML = "";

    // Agregar las filas correspondientes a los usuarios
    users.forEach((user) => {
        const row = document.createElement("tr");
        row.classList.add("table__row");

        row.innerHTML = `
            <td class="table__cell" data-Label="ID">${user.id}</td>
            <td class="table__cell" data-Label="Nombre">${user.nombre}</td>
            <td class="table__cell" data-Label="ID">${user.numero_documento}</td>
            <td class="table__cell" data-Label="Tipo de Usuario">${user.rol}</td>
            <td class="table__cell table__cell--status" data-Label="Estado">
                <span class="table__status table__status--${user.estado === "habilitado" ? "enabled" : "disabled"}"></span>
                <span class="status-text">${user.estado}</span>
            </td>
        `;
    // Agregar evento de clic para abrir el modal
    row.addEventListener("click", () => {
        openModal(user, renderUserDetails);
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
    fetchUsers(currentPage);
}

// Eventos de los botones de paginación
prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

// Renderizar la tabla inicial
fetchUsers(currentPage);

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