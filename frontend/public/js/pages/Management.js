document.addEventListener('DOMContentLoaded', function() {
    // Table and filter variables
    const tableBody = document.querySelector('.table__body');
    const allTableRows = Array.from(document.querySelectorAll('.table__body .table__row'));
    const filterButton = document.querySelector('.button--filter');
    const filtersPanel = document.querySelector('.filters');
    const filtersCloseButton = document.querySelector('.filters__close');
    const searchInput = document.querySelector('.filters__search');
    const statusSelect = document.querySelector('.filters__select[placeholder="Estado"]');
    const cycleSelect = document.querySelector('.filters__select[placeholder="Ciclo"]');
    const startDateInput = document.querySelector('.filters__date');
    const endDateInput = document.querySelectorAll('.filters__date')[1];
    const clearFiltersButton = document.querySelector('.button--clear');

    // Filtering functionality
    function formatDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    }

    function applyFilters() {
        console.log('Applying filters...');
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const statusFilter = statusSelect?.value || '';
        const cycleFilter = cycleSelect?.value || '';
        const startDate = startDateInput?.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput?.value ? new Date(endDateInput.value) : null;

        // Clone array for sorting
        const sortedRows = [...allTableRows];

        // Sort rows based on filter matches
        sortedRows.sort((a, b) => {
            const scoreA = getFilterMatchScore(a);
            const scoreB = getFilterMatchScore(b);
            return scoreB - scoreA; // Higher score first
        });

        // Reorder rows in DOM
        sortedRows.forEach(row => tableBody.appendChild(row));

        // Helper function to calculate match score
        function getFilterMatchScore(row) {
            let score = 0;
            const id = row.querySelector('.table__cell--id')?.textContent.toLowerCase();
            const name = row.querySelector('.table__cell--name')?.textContent.toLowerCase();
            const status = row.querySelector('.badge')?.textContent;
            const cycle = row.querySelector('.table__cell--cycle')?.textContent;
            const dateText = row.querySelector('.table__cell--date')?.textContent;
            const rowDate = dateText ? formatDate(dateText) : null;

            // Search term match
            if (!searchTerm || id?.includes(searchTerm) || name?.includes(searchTerm)) {
                score += 4;
            }

            // Status match
            if (!statusFilter || status === statusFilter) {
                score += 2;
            }

            // Cycle match
            if (!cycleFilter || cycle === cycleFilter) {
                score += 2;
            }

            // Date range match
            if ((!startDate || (rowDate && rowDate >= startDate)) &&
                (!endDate || (rowDate && rowDate <= endDate))) {
                score += 2;
            }

            return score;
        }

        changePage(1);
        updateTableState();
    }

    // Clear filters
    clearFiltersButton?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (statusSelect) statusSelect.selectedIndex = 0;
        if (cycleSelect) cycleSelect.selectedIndex = 0;
        if (startDateInput) startDateInput.value = '';
        if (endDateInput) endDateInput.value = '';
        
        // Restore original order if needed
        allTableRows.sort((a, b) => {
            const idA = a.querySelector('.table__cell--id')?.textContent;
            const idB = b.querySelector('.table__cell--id')?.textContent;
            return idA?.localeCompare(idB) || 0;
        }).forEach(row => tableBody.appendChild(row));
        
        changePage(1);
        updateTableState();
        filtersPanel?.classList.add('hidden');
    });

    // Add filter event listeners
    searchInput?.addEventListener('input', applyFilters);
    statusSelect?.addEventListener('change', applyFilters);
    cycleSelect?.addEventListener('change', applyFilters);
    startDateInput?.addEventListener('change', applyFilters);
    endDateInput?.addEventListener('change', applyFilters);

    // Filter panel toggle
    filterButton?.addEventListener('click', () => {
        filtersPanel?.classList.remove('hidden');
    });

    filtersCloseButton?.addEventListener('click', () => {
        filtersPanel?.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filters') && !e.target.closest('.button--filter')) {
            filtersPanel?.classList.add('hidden');
        }
    });

    // Tab navigation
    const tabs = document.querySelectorAll('.create-tab');
    const tabContents = document.querySelectorAll('.create-tab-content');
    
    if (tabs.length && tabContents.length) {
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('create-tab--active'));
                tabContents.forEach(c => c.classList.add('hidden'));
                
                // Add active class to current tab and content
                tab.classList.add('create-tab--active');
                tabContents[index].classList.remove('hidden');

                // Initialize sensor chart when switching to the sensors tab
                if (index === 1 && tabContents[index].querySelector('#sensorChart')) {
                    initSensorChart();
                }
            });
        });
    }
    
    // Dropdown toggles for sensors and insumos
    const dropdownButtons = document.querySelectorAll('.dropdown-button');
    
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const parent = event.currentTarget.closest('.form-field__dropdown-container');
            let dropdown;
            
            // Find the appropriate dropdown (could be immediately after or after another element)
            const parentSection = parent.closest('.form-section');
            if (parentSection) {
                if (parent.nextElementSibling && 
                   (parent.nextElementSibling.classList.contains('sensors-dropdown') || 
                    parent.nextElementSibling.classList.contains('insumos-dropdown'))) {
                    dropdown = parent.nextElementSibling;
                } else {
                    dropdown = parentSection.querySelector('.sensors-dropdown, .insumos-dropdown');
                }
                
                if (dropdown) {
                    dropdown.classList.toggle('open');
                }
            }
        });
    });
    
    // Form actions
    const actionButtons = document.querySelectorAll('.form-field__action-button');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // This would typically open a modal or form to add a new item
            // For mockup purposes, just show an alert
            alert('Acción para agregar un nuevo elemento');
        });
    });
    
    // Remove buttons for insumos
    const removeButtons = document.querySelectorAll('.insumo-card__remove');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.insumo-card');
            if (card) {
                // In a real application, you would send a request to remove the item
                // For mockup purposes, just hide the card
                card.style.display = 'none';
            }
        });
    });
    
    // Input Usage Form Modal Functionality
    const modal = document.getElementById('usageFormModal');
    const openFormBtn = document.getElementById('openUsageFormBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelUsageBtn');
    const usageForm = document.getElementById('insumoUsageForm');
    const quantityInput = document.getElementById('usageQuantity');
    const unitValueInput = document.getElementById('unitValue');
    const totalValueInput = document.getElementById('totalValue');
    
    // Open modal
    if (openFormBtn) {
        openFormBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
    }
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('show');
        usageForm.reset();
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Calculate total value when quantity or unit value changes
    function calculateTotal() {
        if (quantityInput && unitValueInput && totalValueInput) {
            const quantity = parseFloat(quantityInput.value) || 0;
            const unitValue = parseFloat(unitValueInput.value) || 0;
            const total = quantity * unitValue;
            totalValueInput.value = total.toFixed(0);
        }
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('input', calculateTotal);
    }
    
    if (unitValueInput) {
        unitValueInput.addEventListener('input', calculateTotal);
    }
    
    // Form submission
    if (usageForm) {
        usageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the data to your backend
            // For mockup purposes, just show success message and close the modal
            alert('Uso de insumo registrado correctamente');
            closeModal();
        });
    }
    

    // Tabla y Paginación
    const paginationButtons = document.querySelectorAll('.pagination__button');
    const paginationPrev = document.querySelector('.pagination__button--prev');
    const paginationNext = document.querySelector('.pagination__button--next');
    const paginationCurrentPage = document.querySelector('.pagination__current-page');
    const paginationItemsPerPage = document.querySelector('.pagination__items-per-page');
    const paginationTotalItems = document.querySelector('.pagination__total-items');
    
    // Configuración de paginación
    const ITEMS_PER_PAGE = 6; // Número máximo de elementos por página
    
    // Obtener todas las filas de la tabla
    const totalItems = allTableRows.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Actualizar información de paginación en el DOM
    if (paginationItemsPerPage) {
        paginationItemsPerPage.textContent = ITEMS_PER_PAGE;
    }
    
    if (paginationTotalItems) {
        paginationTotalItems.textContent = totalItems;
    }
    
    // Generar botones de paginación dinámicamente si no existen
    const paginationControls = document.querySelector('.pagination__controls');
    if (paginationControls) {
        // Limpiar botones existentes, manteniendo los de navegación
        const prevButton = paginationControls.querySelector('.pagination__button--prev');
        const nextButton = paginationControls.querySelector('.pagination__button--next');
        
        paginationControls.innerHTML = '';
        
        if (prevButton) {
            paginationControls.appendChild(prevButton.cloneNode(true));
        }
        
        // Crear botones numéricos
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = 'pagination__button';
            button.textContent = i;
            
            if (i === 1) {
                button.classList.add('pagination__button--active');
            }
            
            paginationControls.appendChild(button);
        }
        
        if (nextButton) {
            paginationControls.appendChild(nextButton.cloneNode(true));
        }
        
        // Actualizar referencias
        const updatedButtons = document.querySelectorAll('.pagination__button');
        updatedButtons.forEach(button => {
            if (!button.classList.contains('pagination__button--prev') && 
                !button.classList.contains('pagination__button--next')) {
                button.addEventListener('click', () => {
                    const pageNumber = parseInt(button.textContent);
                    changePage(pageNumber);
                });
            }
        });
        
        // Actualizar navegación
        const updatedPrev = document.querySelector('.pagination__button--prev');
        const updatedNext = document.querySelector('.pagination__button--next');
        
        if (updatedPrev) {
            updatedPrev.addEventListener('click', () => {
                const activeButton = document.querySelector('.pagination__button--active');
                if (activeButton) {
                    const currentPage = parseInt(activeButton.textContent);
                    if (currentPage > 1) {
                        changePage(currentPage - 1);
                    }
                }
            });
        }
        
        if (updatedNext) {
            updatedNext.addEventListener('click', () => {
                const activeButton = document.querySelector('.pagination__button--active');
                if (activeButton) {
                    const currentPage = parseInt(activeButton.textContent);
                    if (currentPage < totalPages) {
                        changePage(currentPage + 1);
                    }
                }
            });
        }
    }

    // Función para cambiar de página
    function changePage(pageNumber) {
        const visibleRows = allTableRows.filter(row => !row.classList.contains('hidden'));
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        visibleRows.forEach((row, index) => {
            row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });

        // Update pagination UI
        document.querySelectorAll('.pagination__button').forEach(btn => {
            btn.classList.remove('pagination__button--active');
            if (btn.textContent === pageNumber.toString()) {
                btn.classList.add('pagination__button--active');
            }
        });

        if (paginationCurrentPage) {
            paginationCurrentPage.textContent = pageNumber;
        }
    }

    // Variables globales para la tabla
    const tableCheckboxHeader = document.querySelector('.table__checkbox-header');
    const tableCheckboxes = document.querySelectorAll('.table__checkbox');
    const selectedCountElement = document.querySelector('.actions-bar__count--selected');
    const totalCountElement = document.querySelector('.actions-bar__count--total');
    const enableButton = document.querySelector('.button--enable');
    const disableButton = document.querySelector('.button--disable');
    const deleteButton = document.querySelector('.button--delete');
    const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');
    const confirmModal = document.getElementById('confirmacionModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const acceptConfirmBtn = document.getElementById('acceptConfirmBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const closeConfirmModalBtn = document.getElementById('closeConfirmModal');
    let pendingCallback = null;

    // Función principal para actualizar el estado de los checkboxes y contadores
    function updateTableState() {
        const visibleCheckboxes = Array.from(tableCheckboxes).filter(checkbox => {
            const row = checkbox.closest('.table__row');
            return row && !row.classList.contains('hidden');
        });

        const checkedBoxes = visibleCheckboxes.filter(cb => cb.checked);
        const totalChecked = checkedBoxes.length;
        const totalVisible = visibleCheckboxes.length;

        // Actualizar contadores
        if (selectedCountElement) selectedCountElement.textContent = totalChecked;
        if (totalCountElement) totalCountElement.textContent = tableCheckboxes.length;

        // Actualizar estado del checkbox principal y de la barra de acciones
        if (tableCheckboxHeader) {
            tableCheckboxHeader.checked = totalChecked > 0 && totalChecked === totalVisible;
            tableCheckboxHeader.indeterminate = totalChecked > 0 && totalChecked < totalVisible;
        }
        
        if (actionsBarCheckbox) {
            actionsBarCheckbox.checked = totalChecked > 0 && totalChecked === totalVisible;
            actionsBarCheckbox.indeterminate = totalChecked > 0 && totalChecked < totalVisible;
        }

        // Actualizar estado de botones
        const hasChecked = totalChecked > 0;
        if (enableButton) enableButton.disabled = !hasChecked;
        if (disableButton) disableButton.disabled = !hasChecked;
        if (deleteButton) deleteButton.disabled = !hasChecked;
    }

    // Event listener para checkbox principal y de la barra de acciones
    function setupCheckboxListener(checkbox) {
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                const isChecked = checkbox.checked;
                const visibleCheckboxes = Array.from(tableCheckboxes).filter(checkbox => {
                    const row = checkbox.closest('.table__row');
                    return row && !row.classList.contains('hidden');
                });
                
                visibleCheckboxes.forEach(checkbox => checkbox.checked = isChecked);
                updateTableState();
            });
        }
    }

    setupCheckboxListener(tableCheckboxHeader);
    setupCheckboxListener(actionsBarCheckbox);

    // Event listeners para los checkboxes individuales
    tableCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTableState);
    });

    // Funciones del modal de confirmación
    function openConfirmModal() {
        confirmModal.classList.add('show');
    }

    function closeConfirmModal() {
        confirmModal.classList.remove('show');
        pendingCallback = null;
    }

    function confirmAction(message, callback) {
        confirmMessage.textContent = message;
        pendingCallback = callback;
        openConfirmModal();
    }

    // Event listeners para el modal
    closeConfirmModalBtn?.addEventListener('click', closeConfirmModal);
    cancelConfirmBtn?.addEventListener('click', closeConfirmModal);
    acceptConfirmBtn?.addEventListener('click', () => {
        if (pendingCallback) pendingCallback();
        closeConfirmModal();
    });

    // Función para actualizar el estado de un elemento
    function updateElementStatus(row, newStatus) {
        const statusCell = row.querySelector('.badge');
        const actionButtons = row.querySelector('.table__cell--actions');
        
        if (newStatus === 'active') {
            statusCell.className = 'badge badge--active';
            statusCell.textContent = 'Activo';
            actionButtons.innerHTML = `
                <button class="table__action-button table__action-button--view">
                    <span class="material-symbols-outlined">visibility</span>
                </button>
                <button class="table__action-button table__action-button--edit">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="table__action-button table__action-button--disable">
                    <span class="material-symbols-outlined">power_settings_new</span>
                </button>
            `;
        } else {
            statusCell.className = 'badge badge--inactive';
            statusCell.textContent = 'Inactivo';
            actionButtons.innerHTML = `
                <button class="table__action-button table__action-button--view">
                    <span class="material-symbols-outlined">visibility</span>
                </button>
                <button class="table__action-button table__action-button--edit">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="table__action-button table__action-button--enable">
                    <span class="material-symbols-outlined">power_settings_new</span>
                </button>
            `;
        }
    }

    // Event listeners para botones de acción masiva
    enableButton?.addEventListener('click', () => {
        const selectedRows = Array.from(tableCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.closest('.table__row'));

        if (selectedRows.length === 0) {
            alert('No hay elementos seleccionados para habilitar.');
            return;
        }

        confirmAction(`¿Está seguro que desea habilitar ${selectedRows.length} elemento(s)?`, () => {
            selectedRows.forEach(row => updateElementStatus(row, 'active'));
            tableCheckboxes.forEach(cb => cb.checked = false);
            updateTableState();
        });
    });

    disableButton?.addEventListener('click', () => {
        const selectedRows = Array.from(tableCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.closest('.table__row'));

        if (selectedRows.length === 0) {
            alert('No hay elementos seleccionados para deshabilitar.');
            return;
        }

        confirmAction(`¿Está seguro que desea deshabilitar ${selectedRows.length} elemento(s)?`, () => {
            selectedRows.forEach(row => updateElementStatus(row, 'inactive'));
            tableCheckboxes.forEach(cb => cb.checked = false);
            updateTableState();
        });
    });

    // Event delegation para botones individuales
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.table__action-button--enable, .table__action-button--disable');
        if (!button) return;
        
        const row = button.closest('.table__row');
        const elementName = row.querySelector('.table__cell--name').textContent;
        const isEnabling = button.classList.contains('table__action-button--enable');
        
        confirmAction(
            `¿Está seguro que desea ${isEnabling ? 'habilitar' : 'deshabilitar'} "${elementName}"?`,
            () => updateElementStatus(row, isEnabling ? 'active' : 'inactive')
        );
    });

    // ============================
    // Report Generation Functions
    // ============================
    const reportButton = document.querySelector('.button--report');
    
    function generateCSVContent(rows, type = 'produccion') {
        const headers = type === 'produccion' ? 
            ['ID', 'Nombre', 'Cultivo', 'Ciclo', 'Responsable', 'Inversión', 'Fecha Inicio', 'Estado'] :
            ['ID', 'Nombre', 'Tipo', 'Miembros', 'Representante', 'Fecha Registro', 'Estado'];

        const csvRows = rows.map(row => {
            const base = [
                row.querySelector('.table__cell--id').textContent,
                `"${row.querySelector('.table__cell--name').textContent}"`,
            ];

            if (type === 'produccion') {
                return [...base,
                    row.querySelector('.table__cell--crop').textContent,
                    row.querySelector('.table__cell--cycle').textContent,
                    `"${row.querySelector('.table__cell--responsible').textContent}"`,
                    row.querySelector('.table__cell--investment').textContent.replace(/[$,]/g, ''),
                    row.querySelector('.table__cell--date').textContent,
                    row.querySelector('.badge').textContent
                ];
            } else {
                return [...base,
                    row.querySelector('.table__cell--type').textContent,
                    row.querySelector('.table__cell--members').textContent,
                    `"${row.querySelector('.table__cell--representative').textContent}"`,
                    row.querySelector('.table__cell--date').textContent,
                    row.querySelector('.badge').textContent
                ];
            }
        });

        return [headers, ...csvRows].map(row => row.join(',')).join('\n');
    }

    function downloadFile(content, filename, type = 'text/csv') {
        const blob = new Blob([content], { type: `${type};charset=utf-8;` });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    function generateReport() {
        const isProduccion = document.title.includes('Producción');
        const rows = Array.from(allTableRows).filter(row => 
            !row.classList.contains('hidden') && 
            (document.getElementById('includeInactive')?.checked || 
             row.querySelector('.badge--active'))
        );

        const format = document.getElementById('reportFormat').value;
        const date = new Date().toISOString().split('T')[0];
        const type = isProduccion ? 'producciones' : 'asociaciones';
        
        const csvContent = generateCSVContent(rows, isProduccion ? 'produccion' : 'asociacion');
        downloadFile(csvContent, `${type}_${date}.${format}`);
        
        closeConfirmModal();
    }

    // Add report button click handler
    reportButton?.addEventListener('click', () => {
        confirmMessage.textContent = '¿Desea generar el reporte?';
        pendingCallback = generateReport;
        openConfirmModal();
    });

    // Inicializar estado
    updateTableState();
    changePage(1);
});

function generateReport() {
    const format = document.getElementById('reportFormat').value;
    const includeInactive = document.getElementById('includeInactive').checked;
    const includeDetails = document.getElementById('includeDetails').checked;
    
    // Get table data
    const tableRows = document.querySelectorAll('.table__row:not(.table__row--header)');
    const reportData = [];
    
    tableRows.forEach(row => {
        const isInactive = row.querySelector('.badge--inactive');
        if (!includeInactive && isInactive) return;
        
        const data = {
            id: row.querySelector('.table__cell--id').textContent,
            nombre: row.querySelector('.table__cell--name').textContent,
            tipo: row.querySelector('.table__cell--type').textContent,
            miembros: row.querySelector('.table__cell--members').textContent,
            representante: row.querySelector('.table__cell--representative').textContent,
            fecha: row.querySelector('.table__cell--date').textContent,
            estado: row.querySelector('.badge').textContent
        };
        
        if (includeDetails) {
            data.detalles = "Información detallada de la asociación";
        }
        
        reportData.push(data);
    });

    // Simulate file download
    const fileName = `reporte_asociaciones.${format}`;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

document.addEventListener('DOMContentLoaded', () => {
    const generateReportBtn = document.getElementById('generateReportBtn');
    const reportModal = document.getElementById('reportModal');
    const closeReportModal = document.getElementById('closeReportModal');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const reportButton = document.querySelector('.button--report');

    reportButton.addEventListener('click', () => {
        reportModal.classList.add('modal--visible');
    });

    generateReportBtn.addEventListener('click', () => {
        generateReport();
        reportModal.classList.remove('modal--visible');
    });

    [closeReportModal, cancelReportBtn].forEach(element => {
        element.addEventListener('click', () => {
            reportModal.classList.remove('modal--visible');
        });
    });
});
