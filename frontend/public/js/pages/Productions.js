import { productionsConfig } from '../config/productionsConfig.js';

// --- Obtener producciones desde la API ---
async function fetchProductionsFromAPI() {
    try {
        const response = await fetch('http://localhost:5000/producciones');
        if (!response.ok) throw new Error('Error al obtener producciones de la API');
        const data = await response.json();

        // Cargar catálogos locales para mapear nombres
        let usersMap = {}, insumosMap = {}, sensoresMap = {};
        try {
            const usersModule = await import('../data/usersData.js');
            if (usersModule && usersModule.users) {
                usersModule.users.forEach(u => { usersMap[String(u.id)] = u.nombre; });
            }
        } catch (e) {}
        try {
            const insumosModule = await import('../data/insumosData.js');
            if (insumosModule && insumosModule.insumos) {
                insumosModule.insumos.forEach(i => { insumosMap[String(i.id)] = i.nombre; });
            }
        } catch (e) {}
        try {
            const sensoresModule = await import('../data/sensorsData.js');
            if (sensoresModule && (sensoresModule.sensors || sensoresModule.sensorsData)) {
                (sensoresModule.sensors || sensoresModule.sensorsData).forEach(s => { sensoresMap[String(s.id)] = s.nombre || s.name; });
            }
        } catch (e) {}

        return data.map(prod => {
            // Mapear personal
            let personalNombres = [];
            if (prod.personal_ids) {
                personalNombres = String(prod.personal_ids)
                    .split(',')
                    .map(id => usersMap[String(id).trim()] || id.trim())
                    .filter(Boolean);
            }
            // Mapear insumos
            let insumosNombres = [];
            if (prod.insumos_ids) {
                insumosNombres = String(prod.insumos_ids)
                    .split(',')
                    .map(id => insumosMap[String(id).trim()] || id.trim())
                    .filter(Boolean);
            }
            // Mapear sensores
            let sensoresNombres = [];
            if (prod.sensores_ids) {
                sensoresNombres = String(prod.sensores_ids)
                    .split(',')
                    .map(id => sensoresMap[String(id).trim()] || id.trim())
                    .filter(Boolean);
            }
            return {
                id: prod.id || '',
                name: prod.nombre || '',
                crop: prod.nombre_cultivo || '',
                cycle: prod.nombre_ciclo || '',
                responsible: prod.nombre_usuario || '',
                investment: prod.inversion || prod.investment || '',
                startDate: prod.fecha_creacion || prod.startDate || '',
                status: prod.estado === 'habilitado' ? 'Activo' : 'Inactivo',
                area: prod.area || prod.tamano || '',
                workers: prod.personal || prod.workers || '',
                personal_asignado: personalNombres,
                personal_asignado_count: personalNombres.length,
                insumos_asignados: insumosNombres,
                insumos_asignados_count: insumosNombres.length,
                sensores_asignados: sensoresNombres,
                sensores_asignados_count: sensoresNombres.length,
                funcional: prod.funcional !== undefined ? prod.funcional : (prod.tipo ? (prod.tipo.toLowerCase() === 'funcional' ? 'Sí' : 'No') : ''),
                // Otros campos según necesidad
            };
        });
    } catch (e) {
        console.warn('Fallo la carga desde la API:', e.message);
        return [];
    }
}

// --- Cambiar estado de producción en backend ---
async function toggleProductionStatus(id, nuevoEstado) {
    await fetch(`http://localhost:5000/producciones/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
}

class Productions {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredData = [];
        this.filteredDataOriginal = [];
        this.selectedProductions = new Set();
        this.loadData();
    }

    async loadData() {
        const data = await fetchProductionsFromAPI();
        this.filteredData = [...data];
        this.filteredDataOriginal = [...data]; // Guardar copia original para filtros
        this.renderTable();
        this.updatePagination();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Filtros (puedes agregar lógica de filtros aquí si lo deseas)
        const filterButton = document.querySelector('.button--filter');
        const filtersClose = document.querySelector('.filters__close');
        const filtersSearch = document.querySelector('.filters__search');
        const clearBtn = document.querySelector('.button--clear');
        const enableBtn = document.querySelector('.button--enable');
        const disableBtn = document.querySelector('.button--disable');
        const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');
        const tableCheckboxHeader = document.querySelector('.table__checkbox-header');
        const filtersFuncional = document.querySelector('.filters__select--funcional');

        // Mostrar/ocultar filtros
        if (filterButton && document.querySelector('.filters')) {
            filterButton.addEventListener('click', () => {
                document.querySelector('.filters').classList.remove('hidden');
            });
        }
        if (filtersClose && document.querySelector('.filters')) {
            filtersClose.addEventListener('click', () => {
                document.querySelector('.filters').classList.add('hidden');
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (filtersSearch) filtersSearch.value = '';
                if (filtersFuncional) filtersFuncional.value = '';
                this.filteredData = [...this.filteredDataOriginal];
                this.currentPage = 1;
                this.renderTable();
                this.updatePagination();
            });
        }
        // --- Lógica de filtros combinados ---
        const applyFilters = () => {
            let data = [...this.filteredDataOriginal];
            // Filtro búsqueda
            const searchValue = filtersSearch ? filtersSearch.value.toLowerCase() : '';
            if (searchValue) {
                data = data.filter(prod =>
                    prod.id.toLowerCase().includes(searchValue) ||
                    prod.name.toLowerCase().includes(searchValue)
                );
            }
            // Filtro funcional
            const funcionalValue = filtersFuncional ? filtersFuncional.value : '';
            if (funcionalValue) {
                data = data.filter(prod => String(prod.funcional).toLowerCase() === funcionalValue.toLowerCase());
            }
            this.filteredData = data;
            this.currentPage = 1;
            this.renderTable();
            this.updatePagination();
        };
        if (filtersSearch) {
            filtersSearch.addEventListener('input', applyFilters);
        }
        if (filtersFuncional) {
            filtersFuncional.addEventListener('change', applyFilters);
        }
        // Habilitar/deshabilitar masivo
        if (enableBtn) {
            enableBtn.addEventListener('click', () => {
                const ids = Array.from(this.selectedProductions);
                if (ids.length === 0) return;
                this.updateStatus(ids, 'Activo');
            });
        }
        if (disableBtn) {
            disableBtn.addEventListener('click', () => {
                const ids = Array.from(this.selectedProductions);
                if (ids.length === 0) return;
                this.updateStatus(ids, 'Inactivo');
            });
        }
        // Checkbox de barra de selección
        if (actionsBarCheckbox) {
            actionsBarCheckbox.addEventListener('change', (e) => {
                const checked = e.target.checked;
                document.querySelectorAll('.table__checkbox').forEach(cb => {
                    cb.checked = checked;
                    const row = cb.closest('tr');
                    if (row) {
                        const id = row.querySelector('.table__cell--id').textContent;
                        if (checked) this.selectedProductions.add(id);
                        else this.selectedProductions.delete(id);
                    }
                });
                this.updateSelectionCount();
            });
        }
        // Checkbox de cabecera de tabla
        if (tableCheckboxHeader) {
            tableCheckboxHeader.addEventListener('change', (e) => {
                const checked = e.target.checked;
                document.querySelectorAll('.table__checkbox').forEach(cb => {
                    cb.checked = checked;
                    const row = cb.closest('tr');
                    if (row) {
                        const id = row.querySelector('.table__cell--id').textContent;
                        if (checked) this.selectedProductions.add(id);
                        else this.selectedProductions.delete(id);
                    }
                });
                this.updateSelectionCount();
            });
        }
        // Evento de paginación
        document.querySelector('.pagination__controls')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            if (btn.classList.contains('pagination__button--prev')) {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTable();
                    this.updatePagination();
                }
            } else if (btn.classList.contains('pagination__button--next')) {
                const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderTable();
                    this.updatePagination();
                }
            } else if (btn.classList.contains('pagination__button')) {
                const pageNumber = Number(btn.textContent);
                if (!isNaN(pageNumber)) {
                    this.currentPage = pageNumber;
                    this.renderTable();
                    this.updatePagination();
                }
            }
        });
        // Evento de acción en la tabla
        document.querySelector('.table__body')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const row = btn.closest('tr');
            const id = row.querySelector('.table__cell--id').textContent;
            if (btn.classList.contains('table__action-button--view')) {
                const prod = this.filteredData.find(p => String(p.id) === String(id));
                if (prod) this.showProduccionDetails(prod);
                return;
            }
            if (btn.classList.contains('table__action-button--enable')) {
                this.updateStatus([id], 'Activo');
            } else if (btn.classList.contains('table__action-button--disable')) {
                this.updateStatus([id], 'Inactivo');
            }
        });
        // Cerrar modal
        const closeBtn = document.getElementById('closeViewProduccionModal');
        const modal = document.getElementById('viewModal') || document.getElementById('viewProduccionModal');
        if (closeBtn && modal) {
            closeBtn.onclick = () => {
                modal.classList.remove('modal--active');
            };
        }
        // Cerrar modal al hacer click fuera del contenido
        if (modal) {
            modal.addEventListener('mousedown', function(e) {
                // Solo cerrar si el click es directamente sobre el fondo del modal
                if (e.target === modal) {
                    modal.classList.remove('modal--active');
                }
            });
        }

        // --- Reporte funcional ---
        // Selección de elementos del modal CORRECTO para Producciones
        const reportModal = document.getElementById('reportModalProduccion');
        const reportBtn = document.querySelector('.button--report');
        const cancelReportBtn = document.getElementById('cancelReportBtnProduccion');
        const generateReportBtn = document.getElementById('generateReportBtnProduccion');
        const closeReportModal = document.getElementById('closeReportModalProduccion');

        if (reportBtn && reportModal) {
            reportBtn.addEventListener('click', () => {
                reportModal.classList.add('modal--active');
                reportModal.style.display = '';
                reportModal.style.alignItems = '';
                reportModal.style.justifyContent = '';
            });
        }
        if (cancelReportBtn && reportModal) {
            cancelReportBtn.addEventListener('click', () => {
                reportModal.classList.remove('modal--active');
                reportModal.style.display = '';
            });
        }
        if (closeReportModal && reportModal) {
            closeReportModal.addEventListener('click', () => {
                reportModal.classList.remove('modal--active');
                reportModal.style.display = '';
            });
        }
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const format = document.getElementById('reportFormatProduccion').value;
                const includeInactive = document.getElementById('includeInactiveProduccion').checked;
                const includeDetails = document.getElementById('includeDetailsProduccion').checked;
                const includeSensors = document.getElementById('includeSensorsProduccion').checked;
                const includeSupplies = document.getElementById('includeSuppliesProduccion').checked;
                // Filtrar datos según opciones
                let data = this.filteredData;
                if (!includeInactive) {
                    data = data.filter(p => p.status === 'Activo');
                }
                // Seleccionar columnas
                let columns = [
                    { header: 'ID', key: 'id' },
                    { header: 'Nombre', key: 'name' },
                    { header: 'Cultivo', key: 'crop' },
                    { header: 'Ciclo', key: 'cycle' },
                    { header: 'Responsable', key: 'responsible' },
                    { header: 'Inversión', key: 'investment' },
                    { header: 'Fecha de Inicio', key: 'startDate' },
                    { header: 'Estado', key: 'status' }
                ];
                if (includeDetails) {
                    columns.push(
                        { header: 'Área', key: 'area' },
                        { header: 'Personal', key: 'personal_asignado' }
                    );
                }
                if (includeSensors) {
                    columns.push({ header: 'Sensores Asignados', key: 'sensores_asignados' });
                }
                if (includeSupplies) {
                    columns.push({ header: 'Insumos Asignados', key: 'insumos_asignados' });
                }
                // Normalizar datos para exportar
                const reportData = data.map(p => {
                    const row = { ...p };
                    if (Array.isArray(row.personal_asignado)) row.personal_asignado = row.personal_asignado.join(', ');
                    if (Array.isArray(row.sensores_asignados)) row.sensores_asignados = row.sensores_asignados.join(', ');
                    if (Array.isArray(row.insumos_asignados)) row.insumos_asignados = row.insumos_asignados.join(', ');
                    return row;
                });
                // Usar ReportGenerator global como en otros módulos
                if (window.ReportGenerator && typeof window.ReportGenerator.generateReport === 'function') {
                    window.ReportGenerator.generateReport({
                        columns,
                        data: reportData,
                        format,
                        filename: 'reporte_producciones_' + new Date().toISOString().slice(0,10)
                    });
                } else {
                    alert('No se encontró el módulo de generación de reportes.');
                }
                reportModal.classList.remove('modal--active');
                reportModal.style.display = '';
            });
        }
    }

    updateStatus(ids, status) {
        // Llamar al backend para actualizar cada producción
        Promise.all(ids.map(id => toggleProductionStatus(id, status === 'Activo' ? 'habilitado' : 'deshabilitado')))
            .then(async () => {
                // Volver a cargar todos los datos desde la API para reflejar el estado real
                await this.loadData();
                this.selectedProductions.clear();
                this.updateSelectionCount();
            });
    }

    updateSelectionCount() {
        const total = document.querySelectorAll('.table__checkbox').length;
        const selected = document.querySelectorAll('.table__checkbox:checked').length;
        document.querySelector('.actions-bar__count--selected').textContent = selected;
        document.querySelector('.actions-bar__count--total').textContent = total;
        // Actualiza el set de seleccionados
        this.selectedProductions.clear();
        document.querySelectorAll('.table__checkbox:checked').forEach(cb => {
            const row = cb.closest('tr');
            if (row) {
                const id = row.querySelector('.table__cell--id').textContent;
                this.selectedProductions.add(id);
            }
        });
    }

    renderTable() {
        const tbody = document.querySelector('.table__body');
        tbody.innerHTML = '';
        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const currentPageData = this.filteredData.slice(startIdx, endIdx);
        currentPageData.forEach(production => {
            const row = document.createElement('tr');
            row.className = 'table__row';
            row.innerHTML = `
                <td class="table__cell table__cell--checkbox">
                    <input type="checkbox" class="table__checkbox" ${this.selectedProductions.has(production.id) ? 'checked' : ''} />
                </td>
            `;
            productionsConfig.tableColumns.forEach(column => {
                const cell = document.createElement('td');
                cell.className = `table__cell ${column.class}`;
                if (column.key === 'status') {
                    cell.innerHTML = `
                        <span class="badge badge--${production[column.key].toLowerCase() === 'activo' ? 'active' : 'inactive'}">
                            ${production[column.key]}
                        </span>
                    `;
                } else {
                    cell.textContent = production[column.key] || '-';
                }
                row.appendChild(cell);
            });
            const actionsCell = document.createElement('td');
            actionsCell.className = 'table__cell table__cell--actions';
            actionsCell.innerHTML = `
                <button class="table__action-button table__action-button--view">
                    <span class="material-symbols-outlined">visibility</span>
                </button>
                <button class="table__action-button table__action-button--edit">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="table__action-button table__action-button--${production.status.toLowerCase() === 'activo' ? 'disable' : 'enable'}">
                    <span class="material-symbols-outlined">power_settings_new</span>
                </button>
            `;
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
        this.updateSelectionCount();
    }

    updatePagination() {
        const totalItems = this.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        const paginationControls = document.querySelector('.pagination__controls');
        if (!paginationControls) return;
        let controlsHTML = `<button class="pagination__button pagination__button--prev ${this.currentPage === 1 ? 'disabled' : ''}"><span class="material-symbols-outlined">navigate_before</span></button>`;
        for (let i = 1; i <= totalPages; i++) {
            controlsHTML += `<button class="pagination__button ${i === this.currentPage ? 'pagination__button--active' : ''}">${i}</button>`;
        }
        controlsHTML += `<button class="pagination__button pagination__button--next ${this.currentPage === totalPages ? 'disabled' : ''}"><span class="material-symbols-outlined">navigate_next</span></button>`;
        paginationControls.innerHTML = controlsHTML;

        // Actualizar info de paginación
        const info = document.querySelector('.pagination__info');
        if (info) {
            const start = totalItems === 0 ? 0 : ((this.currentPage - 1) * this.itemsPerPage) + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            info.innerHTML = `Página <span class="pagination__current-page">${this.currentPage}</span> de <span class="pagination__total-pages">${totalPages}</span> | Mostrando <span class="pagination__items-per-page">${end - start + 1}</span> de <span class="pagination__total-items">${totalItems}</span> producciones (${start} - ${end})`;
        }
    }

    showProduccionDetails(prod) {
        // Información General
        document.getElementById('viewId').textContent = prod.id || '';
        document.getElementById('viewName').textContent = prod.nombre || '';
        document.getElementById('viewStatus').textContent = prod.estado === 'habilitado' ? 'Activo' : 'Inactivo';
        document.getElementById('viewCropType').textContent = prod.tipo || '';
        document.getElementById('viewArea').textContent = prod.ubicacion || '';

        // Personal
        const personalIds = prod.personal_ids ? prod.personal_ids.split(',').map(id => id.trim()) : [];
        const personalNombres = personalIds.map(id => {
            const user = this.usersMap[id];
            return user ? user.nombre : `Usuario ${id}`;
        });
        
        document.getElementById('viewResponsible').textContent = personalNombres[0] || 'No asignado';
        document.getElementById('viewSupervisor').textContent = personalNombres[1] || 'No asignado';
        document.getElementById('viewTechnician').textContent = personalNombres[2] || 'No asignado';
        document.getElementById('viewWorkers').textContent = `${personalNombres.length} personas`;

        // Insumos y Sensores
        const insumosIds = prod.insumos_ids ? prod.insumos_ids.split(',').map(id => id.trim()) : [];
        const sensoresIds = prod.sensores_ids ? prod.sensores_ids.split(',').map(id => id.trim()) : [];
        
        const insumosNombres = insumosIds.map(id => {
            const insumo = this.insumosMap[id];
            return insumo ? insumo.nombre : `Insumo ${id}`;
        });
        
        const sensoresNombres = sensoresIds.map(id => {
            const sensor = this.sensoresMap[id];
            return sensor ? sensor.nombre_sensor : `Sensor ${id}`;
        });

        document.getElementById('viewInsumos').textContent = insumosNombres.join(', ') || 'No hay insumos asignados';
        document.getElementById('viewSensores').textContent = sensoresNombres.join(', ') || 'No hay sensores asignados';

        // Fechas
        const fechaCreacion = new Date(prod.fecha_creacion);
        const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        document.getElementById('viewStartDate').textContent = fechaFormateada;
        document.getElementById('viewEndDate').textContent = 'En curso';
        document.getElementById('viewDuration').textContent = 'En curso';
        document.getElementById('viewDaysLeft').textContent = 'En curso';

        // Financiero
        const inversionFormateada = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(prod.inversion_total || 0);

        const metaFormateada = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(prod.meta_ganancias || 0);

        const roi = prod.inversion_total ? ((prod.meta_ganancias - prod.inversion_total) / prod.inversion_total * 100).toFixed(2) : 0;

        document.getElementById('viewInvestment').textContent = inversionFormateada;
        document.getElementById('viewExpectedReturn').textContent = metaFormateada;
        document.getElementById('viewROI').textContent = `${roi}%`;
        document.getElementById('viewCostPerHectare').textContent = 'Calculando...';

        // Mostrar el modal
        const modal = document.getElementById('viewModal');
        if (modal) {
            modal.classList.add('modal--active');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Productions();
});