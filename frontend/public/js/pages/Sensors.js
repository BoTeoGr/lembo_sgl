import { sensorsConfig } from '../config/sensorsConfig.js';
import { sensorsData } from '../data/sensorsData.js';

class Sensors {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredData = [...sensorsData];
        this.selectedSensors = new Set();
        this.renderTable();
        this.updatePagination();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Filtros
        const filterButton = document.querySelector('.button--filter');
        const filtersClose = document.querySelector('.filters__close');
        const filtersSearch = document.querySelector('.filters__search');
        const filtersSelect = document.querySelectorAll('.filters__select');
        const clearButton = document.querySelector('.button--clear');
        const checkboxHeader = document.querySelector('.table__checkbox-header');
        const enableButton = document.querySelector('.button--enable');
        const disableButton = document.querySelector('.button--disable');
        const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');

        if (filterButton) {
            filterButton.addEventListener('click', () => {
                document.querySelector('.filters').classList.toggle('hidden');
            });
        }

        if (filtersClose) {
            filtersClose.addEventListener('click', () => {
                document.querySelector('.filters').classList.add('hidden');
            });
        }

        if (filtersSearch) {
            filtersSearch.addEventListener('input', () => {
                this.filterData();
            });
        }

        filtersSelect.forEach(select => {
            select.addEventListener('change', () => {
                this.filterData();
            });
        });

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        if (checkboxHeader) {
            checkboxHeader.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.table__checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                    this.updateSelectedSensors(checkbox);
                });
                this.updateActionsBar();
            });
        }

        if (enableButton) {
            enableButton.addEventListener('click', () => {
                this.updateSensorStatus('Activo');
            });
        }

        if (disableButton) {
            disableButton.addEventListener('click', () => {
                this.updateSensorStatus('Inactivo');
            });
        }

        // Evento para seleccionar/deseleccionar todos desde la barra superior
        if (actionsBarCheckbox) {
            actionsBarCheckbox.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.table__checkbox');
                const rows = document.querySelectorAll('.table__row');
                if (e.target.checked) {
                    // Seleccionar TODOS los sensores filtrados (todas las páginas)
                    this.filteredData.forEach(sensor => {
                        this.selectedSensors.add(sensor.id);
                    });
                    // Marcar solo los visibles
                    checkboxes.forEach((checkbox, i) => {
                        checkbox.checked = true;
                    });
                } else {
                    // Deseleccionar todos
                    this.selectedSensors.clear();
                    checkboxes.forEach((checkbox, i) => {
                        checkbox.checked = false;
                    });
                }
                // Sincronizar el checkbox del encabezado de la tabla
                const headerCheckbox = document.querySelector('.table__checkbox-header');
                if (headerCheckbox) headerCheckbox.checked = e.target.checked;
                this.updateActionsBar();
            });
        }

        // Inicializar eventos de paginación
        this.setupPaginationEvents();

        // Modal de reporte
        document.querySelector('.button--report').addEventListener('click', () => {
            this.showReportModal();
        });

        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.generateReport();
        });

        document.getElementById('cancelReportBtn').addEventListener('click', () => {
            this.hideReportModal();
        });
    }

    setupPaginationEvents() {
        const prevButton = document.querySelector('.pagination__button--prev');
        const nextButton = document.querySelector('.pagination__button--next');
        const pageButtons = document.querySelectorAll('.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTable();
                    this.updatePagination();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTable();
                    this.updatePagination();
                }
            });
        }

        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const pageNumber = parseInt(button.textContent);
                if (pageNumber !== this.currentPage) {
                    this.currentPage = pageNumber;
                    this.renderTable();
                    this.updatePagination();
                }
            });
        });
    }

    filterData() {
        const searchTerm = document.querySelector('.filters__search').value.toLowerCase();
        const statusFilter = document.querySelector('.filters__select[placeholder="Estado"]').value;
        const typeFilter = document.querySelector('.filters__select[placeholder="Tipo de Sensor"]').value;
        const locationFilter = document.querySelector('.filters__select[placeholder="Ubicación"]').value;

        this.filteredData = sensorsData.filter(sensor => {
            const matchesSearch = sensor.name.toLowerCase().includes(searchTerm) || 
                                sensor.id.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || sensor.status === statusFilter;
            const matchesType = !typeFilter || sensor.type === typeFilter;
            const matchesLocation = !locationFilter || sensor.location === locationFilter;

            return matchesSearch && matchesStatus && matchesType && matchesLocation;
        });

        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    clearFilters() {
        document.querySelector('.filters__search').value = '';
        document.querySelectorAll('.filters__select').forEach(select => {
            select.value = '';
        });
        this.filterData();
    }

    updateSelectedSensors(checkbox) {
        const row = checkbox.closest('.table__row');
        const sensorId = row.querySelector('.table__cell--id').textContent;
        
        if (checkbox.checked) {
            this.selectedSensors.add(sensorId);
        } else {
            this.selectedSensors.delete(sensorId);
        }
        
        this.updateActionsBar();
    }

    updateActionsBar() {
        const selectedCount = this.selectedSensors.size;
        const totalCount = this.filteredData.length;
        
        const selectedCountElement = document.querySelector('.actions-bar__count--selected');
        const totalCountElement = document.querySelector('.actions-bar__count--total');
        const enableButton = document.querySelector('.button--enable');
        const disableButton = document.querySelector('.button--disable');
        const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');
        // Sincronizar el checkbox de la barra superior
        if (actionsBarCheckbox) {
            const checkboxes = document.querySelectorAll('.table__checkbox');
            const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
            actionsBarCheckbox.checked = allChecked;
        }
        if (selectedCountElement) {
            selectedCountElement.textContent = selectedCount;
        }
        
        if (totalCountElement) {
            totalCountElement.textContent = totalCount;
        }

        if (enableButton) {
            enableButton.disabled = selectedCount === 0;
        }

        if (disableButton) {
            disableButton.disabled = selectedCount === 0;
        }
    }

    updateSensorStatus(newStatus) {
        if (this.selectedSensors.size === 0) return;

        this.selectedSensors.forEach(sensorId => {
            const sensor = sensorsData.find(s => s.id === sensorId);
            if (sensor) {
                sensor.status = newStatus;
                sensor.lastUpdate = 'Hace 1 minuto';
            }
        });
        
        this.renderTable();
        // Limpiar selección visual y lógica
        this.selectedSensors.clear();
        this.updateActionsBar();
        // Desmarcar todos los checkboxes
        document.querySelectorAll('.table__checkbox').forEach(cb => cb.checked = false);
        const headerCheckbox = document.querySelector('.table__checkbox-header');
        if (headerCheckbox) headerCheckbox.checked = false;
        const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');
        if (actionsBarCheckbox) actionsBarCheckbox.checked = false;
        // Mostrar notificación de éxito
        this.showNotification(`Estado actualizado exitosamente a "${newStatus}"`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification notification--success';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification--fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    renderTable() {
        const tbody = document.querySelector('.table__body');
        tbody.innerHTML = '';

        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const currentPageData = this.filteredData.slice(startIdx, endIdx);

        currentPageData.forEach(sensor => {
            const row = document.createElement('tr');
            row.className = 'table__row';
            let badgeClass = '';
            if (sensor.status.toLowerCase() === 'activo') {
                badgeClass = 'badge badge--active';
            } else if (sensor.status.toLowerCase() === 'inactivo') {
                badgeClass = 'badge badge--inactive';
            } else {
                badgeClass = 'badge';
            }
            row.innerHTML = `
                <td class="table__cell table__cell--checkbox">
                    <input type="checkbox" class="table__checkbox" ${this.selectedSensors.has(sensor.id) ? 'checked' : ''} />
                </td>
                <td class="table__cell table__cell--id">${sensor.id}</td>
                <td class="table__cell table__cell--name">${sensor.name}</td>
                <td class="table__cell table__cell--type">${sensor.type}</td>
                <td class="table__cell table__cell--unit">${sensor.unit || ''}</td>
                <td class="table__cell table__cell--scan-interval">${sensor.scanInterval || ''}</td>
                <td class="table__cell table__cell--status">
                    <span class="${badgeClass}">${sensor.status}</span>
                </td>
                <td class="table__cell table__cell--actions">
                    <button class="table__action-button table__action-button--view">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <button class="table__action-button table__action-button--edit">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="table__action-button table__action-button--${sensor.status === 'Activo' ? 'disable' : 'enable'}">
                        <span class="material-symbols-outlined">power_settings_new</span>
                    </button>
                </td>
            `;

            // Agregar event listeners para los checkboxes
            const checkbox = row.querySelector('.table__checkbox');
            checkbox.checked = this.selectedSensors.has(sensor.id);
            checkbox.addEventListener('change', () => {
                this.updateSelectedSensors(checkbox);
            });

            // Botones de acción individuales
            const actionButtons = row.querySelectorAll('.table__action-button');
            actionButtons.forEach(button => {
                if (button.classList.contains('table__action-button--enable')) {
                    button.addEventListener('click', () => {
                        this.toggleSensorStatus(sensor, 'Activo');
                    });
                } else if (button.classList.contains('table__action-button--disable')) {
                    button.addEventListener('click', () => {
                        this.toggleSensorStatus(sensor, 'Inactivo');
                    });
                } else if (button.classList.contains('table__action-button--view')) {
                    button.addEventListener('click', () => {
                        this.showSensorDetails(sensor);
                    });
                } else if (button.classList.contains('table__action-button--edit')) {
                    button.addEventListener('click', () => {
                        this.editSensor(sensor);
                    });
                }
            });

            tbody.appendChild(row);
        });

        this.updateActionsBar();
    }

    showSensorDetails(sensor) {
        // Implementar lógica para mostrar detalles del sensor
        console.log('Mostrando detalles del sensor:', sensor);
    }

    editSensor(sensor) {
        // Implementar lógica para editar el sensor
        console.log('Editando sensor:', sensor);
    }

    toggleSensorStatus(sensor, newStatus) {
        if (!sensor) return;
        sensor.status = newStatus;
        sensor.lastUpdate = 'Hace 1 minuto';
        this.renderTable();
        this.showNotification(`Sensor actualizado exitosamente a "${newStatus}"`);
    }

    updatePagination() {
        const totalItems = this.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        // Actualizar información de paginación
        document.querySelector('.pagination__current-page').textContent = this.currentPage;
        document.querySelector('.pagination__items-per-page').textContent = this.itemsPerPage;
        document.querySelector('.pagination__total-items').textContent = totalItems;
        
        // Actualizar botones de página
        const paginationControls = document.querySelector('.pagination__controls');
        paginationControls.innerHTML = `
            <button class="pagination__button pagination__button--prev ${this.currentPage === 1 ? 'disabled' : ''}">
                <span class="material-symbols-outlined">navigate_before</span>
            </button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            paginationControls.innerHTML += `
                <button class="pagination__button ${i === this.currentPage ? 'pagination__button--active' : ''}">
                    ${i}
                </button>
            `;
        }
        
        paginationControls.innerHTML += `
            <button class="pagination__button pagination__button--next ${this.currentPage === totalPages ? 'disabled' : ''}">
                <span class="material-symbols-outlined">navigate_next</span>
            </button>
        `;
        
        // Volver a configurar los eventos de paginación
        this.setupPaginationEvents();
    }

    showReportModal() {
        document.getElementById('reportModal').classList.add('modal--active');
    }

    hideReportModal() {
        document.getElementById('reportModal').classList.remove('modal--active');
    }

    generateReport() {
        const format = document.getElementById('reportFormat').value;
        const includeInactive = document.getElementById('includeInactive').checked;
        const includeReadings = document.getElementById('includeReadings').checked;
        const includeMaintenance = document.getElementById('includeMaintenance').checked;
        const includeAlerts = document.getElementById('includeAlerts').checked;
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;

        // Aquí iría la lógica para generar el reporte
        console.log('Generando reporte con las siguientes opciones:', {
            format,
            includeInactive,
            includeReadings,
            includeMaintenance,
            includeAlerts,
            startDate,
            endDate
        });

        this.hideReportModal();
    }
}

// Inicializar la clase cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Sensors();
});