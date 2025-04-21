document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const filterButton = document.querySelector('.button--filter');
    const filtersPanel = document.querySelector('.filters');
    const filtersCloseButton = document.querySelector('.filters__close');
    
    const tableCheckboxHeader = document.querySelector('.table__checkbox-header');
    const tableCheckboxes = document.querySelectorAll('.table__checkbox');
    const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');
    
    const selectedCountElement = document.querySelector('.actions-bar__count--selected');
    const totalCountElement = document.querySelector('.actions-bar__count--total');
    const actionsBar = document.querySelector('.actions-bar');
    
    const viewButtons = document.querySelectorAll('.table__action-button--view');
    const viewModal = document.getElementById('viewModal');
    const viewModalCloseButton = viewModal ? viewModal.querySelector('.modal__close') : null;
    const modalTabs = viewModal ? viewModal.querySelectorAll('.modal__tab') : [];
    
    const reportButton = document.querySelector('.button--report');
    const reportModal = document.getElementById('reportModal');
    const reportModalCloseButton = document.getElementById('closeReportModal');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    
    // Configuración de la paginación
    const rowsPerPage = 6; // Número de filas por página
    let currentPage = 1; // Página actual
    let totalPages = 0; // Total de páginas
    
    // Elementos de paginación
    const tableBody = document.querySelector(".table__body");
    const prevPageButton = document.querySelector(".pagination__button--prev");
    const nextPageButton = document.querySelector(".pagination__button--next");
    const paginationInfo = document.querySelector(".pagination__info");
    const elementsCount = document.querySelector(".table__count-number");
    
    // Obtener todas las filas de la tabla
    const allRows = Array.from(tableBody.querySelectorAll('.table__row'));
    
    // Inicialización de contadores
    if (totalCountElement) {
        totalCountElement.textContent = tableCheckboxes.length;
    }
    
    if (elementsCount) {
        elementsCount.textContent = allRows.length;
    }
    
    // Calcular el número total de páginas
    totalPages = Math.ceil(allRows.length / rowsPerPage);
    
    // Función para actualizar el contador de elementos seleccionados
    function updateSelectedCount() {
        const selectedCheckboxes = document.querySelectorAll('.table__checkbox:checked');
        if (selectedCountElement) {
            selectedCountElement.textContent = selectedCheckboxes.length;
        }
        
        // Mostrar/ocultar barra de acciones según selección
        if (actionsBar) {
            if (selectedCheckboxes.length > 0) {
                actionsBar.style.display = 'flex';
            } else {
                actionsBar.style.display = 'none';
            }
        }
        
        // Actualizar estado del checkbox en la barra de acciones
        if (actionsBarCheckbox) {
            actionsBarCheckbox.checked = selectedCheckboxes.length > 0 && selectedCheckboxes.length === tableCheckboxes.length;
            actionsBarCheckbox.indeterminate = selectedCheckboxes.length > 0 && selectedCheckboxes.length < tableCheckboxes.length;
        }
        
        // Actualizar estado del checkbox en el encabezado de la tabla
        if (tableCheckboxHeader) {
            tableCheckboxHeader.checked = selectedCheckboxes.length > 0 && selectedCheckboxes.length === tableCheckboxes.length;
            tableCheckboxHeader.indeterminate = selectedCheckboxes.length > 0 && selectedCheckboxes.length < tableCheckboxes.length;
        }
    }
    
    // Mostrar/ocultar panel de filtros
    if (filterButton && filtersPanel) {
        filterButton.addEventListener('click', function() {
            filtersPanel.classList.toggle('hidden');
        });
    }
    
    if (filtersCloseButton && filtersPanel) {
        filtersCloseButton.addEventListener('click', function() {
            filtersPanel.classList.add('hidden');
        });
    }
    
    // Manejo de selección de elementos
    if (tableCheckboxHeader) {
        tableCheckboxHeader.addEventListener('change', function() {
            const isChecked = this.checked;
            const visibleCheckboxes = document.querySelectorAll('.table__row:not([style*="display: none"]) .table__checkbox');
            visibleCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateSelectedCount();
        });
    }
    
    if (actionsBarCheckbox) {
        actionsBarCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            const visibleCheckboxes = document.querySelectorAll('.table__row:not([style*="display: none"]) .table__checkbox');
            visibleCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            if (tableCheckboxHeader) {
                tableCheckboxHeader.checked = isChecked;
            }
            updateSelectedCount();
        });
    }
    
    tableCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });
    
    // Inicializar estado de la barra de acciones
    updateSelectedCount();
    
    // Modal de visualización
    if (viewButtons.length > 0 && viewModal) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Si el botón contiene un enlace, no abrir el modal
                if (e.target.closest('a')) {
                    return;
                }
                
                e.preventDefault();
                
                // Obtener datos de la fila para mostrar en el modal
                const row = this.closest('.table__row');
                const id = row.querySelector('.table__cell--id').textContent;
                const name = row.querySelector('.table__cell--name') ? row.querySelector('.table__cell--name').textContent : '';
                
                // Actualizar contenido del modal
                const viewIdElements = viewModal.querySelectorAll('#viewId');
                viewIdElements.forEach(element => {
                    element.textContent = id;
                });
                
                const viewNameElement = viewModal.querySelector('#viewName');
                if (viewNameElement) {
                    viewNameElement.textContent = name;
                }
                
                // Mostrar el modal
                viewModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Evitar scroll en el body
            });
        });
        
        // Cerrar modal con el botón de cierre
        if (viewModalCloseButton) {
            viewModalCloseButton.addEventListener('click', function() {
                viewModal.style.display = 'none';
                document.body.style.overflow = ''; // Restaurar scroll
            });
        }
        
        // Cerrar modal haciendo clic fuera del contenido
        viewModal.addEventListener('click', function(e) {
            if (e.target === viewModal) {
                viewModal.style.display = 'none';
                document.body.style.overflow = ''; // Restaurar scroll
            }
        });
        
        // Cambio de pestañas en el modal
        modalTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remover clase activa de todas las pestañas
                modalTabs.forEach(t => t.classList.remove('modal__tab--active'));
                
                // Añadir clase activa a la pestaña actual
                this.classList.add('modal__tab--active');
                
                // Obtener el panel correspondiente
                const panelId = this.getAttribute('data-tab');
                const panels = viewModal.querySelectorAll('.modal__panel');
                
                // Ocultar todos los paneles
                panels.forEach(panel => {
                    panel.classList.remove('modal__panel--active');
                });
                
                // Mostrar el panel correspondiente
                const activePanel = viewModal.querySelector(`.modal__panel[data-panel="${panelId}"]`);
                if (activePanel) {
                    activePanel.classList.add('modal__panel--active');
                }
            });
        });
    }
    
    // Modal de reporte
    if (reportButton && reportModal) {
        reportButton.addEventListener('click', function() {
            reportModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evitar scroll en el body
        });
        
        // Cerrar modal con el botón de cierre
        if (reportModalCloseButton) {
            reportModalCloseButton.addEventListener('click', function() {
                reportModal.style.display = 'none';
                document.body.style.overflow = ''; // Restaurar scroll
            });
        }
        
        // Cerrar modal con el botón cancelar
        if (cancelReportBtn) {
            cancelReportBtn.addEventListener('click', function() {
                reportModal.style.display = 'none';
                document.body.style.overflow = ''; // Restaurar scroll
            });
        }
        
        // Cerrar modal haciendo clic fuera del contenido
        reportModal.addEventListener('click', function(e) {
            if (e.target === reportModal) {
                reportModal.style.display = 'none';
                document.body.style.overflow = ''; // Restaurar scroll
            }
        });
    }
    
    // Botones de habilitar/deshabilitar
    const enableButtons = document.querySelectorAll('.table__action-button--enable');
    const disableButtons = document.querySelectorAll('.table__action-button--disable');
    
    enableButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;
            
            const row = this.closest('.table__row');
            const statusCell = row.querySelector('.table__cell--status');
            if (statusCell) {
                const badge = statusCell.querySelector('.badge');
                if (badge) {
                    badge.className = 'badge badge--active';
                    badge.textContent = 'Activo';
                }
            }
            
            // Cambiar botón de habilitar por deshabilitar
            this.classList.remove('table__action-button--enable');
            this.classList.add('table__action-button--disable');
            this.innerHTML = '<span class="material-symbols-outlined">power_settings_new</span>';
        });
    });
    
    disableButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;
            
            const row = this.closest('.table__row');
            const statusCell = row.querySelector('.table__cell--status');
            if (statusCell) {
                const badge = statusCell.querySelector('.badge');
                if (badge) {
                    badge.className = 'badge badge--inactive';
                    badge.textContent = 'Inactivo';
                }
            }
            
            // Cambiar botón de deshabilitar por habilitar
            this.classList.remove('table__action-button--disable');
            this.classList.add('table__action-button--enable');
            this.innerHTML = '<span class="material-symbols-outlined">power_settings_new</span>';
        });
    });
    
    // Botones de acción masiva
    const enableAllButton = document.querySelector('.button--enable');
    const disableAllButton = document.querySelector('.button--disable');
    
    if (enableAllButton) {
        enableAllButton.addEventListener('click', function() {
            const selectedRows = Array.from(document.querySelectorAll('.table__checkbox:checked')).map(checkbox => checkbox.closest('.table__row'));
            
            selectedRows.forEach(row => {
                const statusCell = row.querySelector('.table__cell--status');
                if (statusCell) {
                    const badge = statusCell.querySelector('.badge');
                    if (badge) {
                        badge.className = 'badge badge--active';
                        badge.textContent = 'Activo';
                    }
                }
                
                // Actualizar botón de acción
                const actionButton = row.querySelector('.table__action-button--enable');
                if (actionButton) {
                    actionButton.classList.remove('table__action-button--enable');
                    actionButton.classList.add('table__action-button--disable');
                    actionButton.innerHTML = '<span class="material-symbols-outlined">power_settings_new</span>';
                }
            });
        });
    }
    
    if (disableAllButton) {
        disableAllButton.addEventListener('click', function() {
            const selectedRows = Array.from(document.querySelectorAll('.table__checkbox:checked')).map(checkbox => checkbox.closest('.table__row'));
            
            selectedRows.forEach(row => {
                const statusCell = row.querySelector('.table__cell--status');
                if (statusCell) {
                    const badge = statusCell.querySelector('.badge');
                    if (badge) {
                        badge.className = 'badge badge--inactive';
                        badge.textContent = 'Inactivo';
                    }
                }
                
                // Actualizar botón de acción
                const actionButton = row.querySelector('.table__action-button--disable');
                if (actionButton) {
                    actionButton.classList.remove('table__action-button--disable');
                    actionButton.classList.add('table__action-button--enable');
                    actionButton.innerHTML = '<span class="material-symbols-outlined">power_settings_new</span>';
                }
            });
        });
    }
    
    // Funciones de paginación
    
    // Función para mostrar las filas correspondientes a la página actual
    function displayRows() {
        // Ocultar todas las filas
        allRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // Calcular índices de inicio y fin para la página actual
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, allRows.length);
        
        // Mostrar las filas correspondientes a la página actual
        for (let i = startIndex; i < endIndex; i++) {
            if (allRows[i]) {
                allRows[i].style.display = '';
            }
        }
        
        // Actualizar información de paginación
        updatePaginationInfo();
    }
    
    // Función para actualizar la información de paginación
    function updatePaginationInfo() {
        if (paginationInfo) {
            paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        }
        
        // Habilitar/deshabilitar botones de paginación
        if (prevPageButton) {
            prevPageButton.disabled = currentPage === 1;
        }
        
        if (nextPageButton) {
            nextPageButton.disabled = currentPage === totalPages;
        }
    }
    
    // Función para cambiar de página
    function changePage(direction) {
        currentPage += direction;
        
        // Asegurarse de que la página actual esté dentro de los límites
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        displayRows();
        
        // Desmarcar todas las casillas de verificación
        tableCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        if (tableCheckboxHeader) {
            tableCheckboxHeader.checked = false;
            tableCheckboxHeader.indeterminate = false;
        }
        
        updateSelectedCount();
    }
    
    // Eventos de los botones de paginación
    if (prevPageButton) {
        prevPageButton.addEventListener('click', () => changePage(-1));
    }
    
    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => changePage(1));
    }
    
    // Inicializar la paginación
    displayRows();
});