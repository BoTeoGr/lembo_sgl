import { sensorsConfig } from '../config/sensorsConfig.js';

// --- Obtener sensores desde la API ---
async function fetchSensorsFromAPI() {
    try {
        const response = await fetch('http://localhost:5000/sensor');
        if (!response.ok) throw new Error('Error al obtener sensores de la API');
        const data = await response.json();
        const sensoresArr = Array.isArray(data) ? data : (data.sensores || []);
        return sensoresArr.map(sensor => {
            let status = sensor.estado || '';
            if (typeof status === 'string') {
                const estadoLower = status.trim().toLowerCase();
                if (["habilitado"].includes(estadoLower)) {
                    status = 'habilitado';
                } else if (["deshabilitado"].includes(estadoLower)) {
                    status = 'deshabilitado';
                }
            }
            return {
                id: sensor.sensorId || sensor.id || '',
                nombre: sensor.nombre_sensor || sensor.nombre || '',
                tipo: sensor.tipo_sensor || sensor.tipo || '',
                descripcion: sensor.descripcion || '',
                ubicacion: sensor.ubicacion || '',
                estado: status,
                unidad_medida: sensor.unidad_medida || '',
                tiempo_escaneo: sensor.tiempo_escaneo || '',
                fecha_creacion: sensor.fecha_creacion || sensor.createdAt || '',
                imagen: sensor.imagen || '',
            };
        });
    } catch (e) {
        console.warn('Fallo la carga desde la API, usando datos locales:', e.message);
        return [];
    }
}

// --- Función para actualizar estado en backend ---
async function toggleSensorStatus(id, nuevoEstado) {
    await fetch(`http://localhost:5000/sensor/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
}

class Sensors {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredData = [];
        this.selectedSensors = new Set();
        this.init();
    }

    async init() {
        this.filteredData = await fetchSensorsFromAPI();
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
                this.updateSensorStatus('habilitado');
            });
        }

        if (disableButton) {
            disableButton.addEventListener('click', () => {
                this.updateSensorStatus('deshabilitado');
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

        // Acción ver sensor
        document.querySelector('.table__body').addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const row = btn.closest('tr');
            if (btn.classList.contains('table__action-button--view')) {
                const id = row.querySelector('.table__cell--id').textContent;
                const sensor = this.filteredData.find(s => String(s.id) === String(id));
                if (sensor) this.showSensorDetails(sensor);
                return;
            }
            // Acción editar sensor
            if (btn.classList.contains('table__action-button--edit')) {
                const id = row.querySelector('.table__cell--id').textContent;
                window.location.href = `actualizar-sensor.html?id=${id}`;
                return;
            }
            // Eventos de acción
            if (btn.classList.contains('table__action-button--enable')) {
                const id = row.querySelector('.table__cell--id').textContent;
                const sensor = this.filteredData.find(s => String(s.id) === String(id));
                if (sensor) {
                    sensor.estado = 'habilitado';
                    this.renderTable();
                    toggleSensorStatus(id, 'habilitado');
                }
            }
            if (btn.classList.contains('table__action-button--disable')) {
                const id = row.querySelector('.table__cell--id').textContent;
                const sensor = this.filteredData.find(s => String(s.id) === String(id));
                if (sensor) {
                    sensor.estado = 'deshabilitado';
                    this.renderTable();
                    toggleSensorStatus(id, 'deshabilitado');
                }
            }
        });

        // Cerrar modal
        document.getElementById('closeViewSensorModal').onclick = () => {
            document.getElementById('viewSensorModal').classList.remove('modal--active');
        };
        document.getElementById('closeViewSensorBtn').onclick = () => {
            document.getElementById('viewSensorModal').classList.remove('modal--active');
        };
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

        this.filteredData = this.filteredData.filter(sensor => {
            const matchesSearch = sensor.nombre.toLowerCase().includes(searchTerm) || 
                                sensor.id.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || sensor.estado === statusFilter;
            const matchesType = !typeFilter || sensor.tipo === typeFilter;
            const matchesLocation = !locationFilter || sensor.ubicacion === locationFilter;

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
        if (!this.selectedSensors.size) return;
        const ids = Array.from(this.selectedSensors);
        ids.forEach(id => {
            const sensor = this.filteredData.find(s => String(s.id) === String(id));
            if (sensor) sensor.estado = newStatus;
        });
        Promise.all(ids.map(id => toggleSensorStatus(id, newStatus)));
        this.renderTable();
        this.showNotification(`Sensores actualizados a "${newStatus}"`);
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
            row.innerHTML = `
                <td class="table__cell table__cell--checkbox">
                    <input type="checkbox" class="table__checkbox" data-id="${sensor.id}" ${this.selectedSensors.has(sensor.id) ? 'checked' : ''} />
                </td>
                <td class="table__cell table__cell--id">${sensor.id}</td>
                <td class="table__cell table__cell--name">${sensor.nombre}</td>
                <td class="table__cell table__cell--type">${sensor.tipo}</td>
                <td class="table__cell table__cell--unit">${sensor.unidad_medida || ''}</td>
                <td class="table__cell table__cell--scan-interval">${sensor.tiempo_escaneo || ''}</td>
                <td class="table__cell table__cell--estado">
                    <span class="badge badge--${sensor.estado === 'habilitado' ? 'active' : 'inactive'}">${sensor.estado === 'habilitado' ? 'Habilitado' : 'Deshabilitado'}</span>
                </td>
                <td class="table__cell table__cell--actions">
                    <button class="table__action-button table__action-button--view"><span class="material-symbols-outlined">visibility</span></button>
                <a href="../views/actualizar-sensor.html?id=${sensor.id}" class="table__action-button-wrapper">
                    <button class="table__action-button table__action-button--edit"><span class="material-symbols-outlined">edit</span></button>
                </a>

                    <button class="table__action-button table__action-button--${sensor.estado === 'habilitado' ? 'disable' : 'enable'}"><span class="material-symbols-outlined">power_settings_new</span></button>
                </td>
            `;
            tbody.appendChild(row);
        });
        this.updateActionsBar();
    }

    showSensorDetails(sensor) {
        document.getElementById('modalSensorId').textContent = sensor.id || '';
        document.getElementById('modalSensorNombre').textContent = sensor.nombre || '';
        document.getElementById('modalSensorTipo').textContent = sensor.tipo || '';
        document.getElementById('modalSensorDescripcion').textContent = sensor.descripcion || '';
        document.getElementById('modalSensorUnidadMedida').textContent = sensor.unidad_medida || '';
        document.getElementById('modalSensorTiempoEscaneo').textContent = sensor.tiempo_escaneo || '';
        document.getElementById('modalSensorFechaCreacion').textContent = sensor.fecha_creacion || '';
        document.getElementById('modalSensorEstado').textContent = sensor.estado || '';
        const imgElem = document.getElementById('modalSensorImagen');
        if (imgElem) {
            imgElem.src = sensor.imagen || '../imgs/default-sensor.jpg';
            imgElem.alt = sensor.nombre || 'Imagen de sensor';
        }
        document.getElementById('viewSensorModal').classList.add('modal--active');
    }

    editSensor(sensor) {
        // Implementar lógica para editar el sensor
        console.log('Editando sensor:', sensor);
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