import { cropsConfig } from '../config/cropsConfig.js';

// Nueva función para cargar datos desde la API (si existe)
async function fetchCropsFromAPI() {
    try {
        const response = await fetch('http://localhost:5000/cultivos');
        if (!response.ok) throw new Error('Error al obtener cultivos de la API');
        const data = await response.json();
        // Si la respuesta contiene la clave 'cultivos', usarla; si no, usar el array directamente
        const cultivos = Array.isArray(data) ? data : (data.cultivos || []);
        // Mapear campos del backend a los del frontend
        return cultivos.map(cultivo => {
            // Normalizar estado para estilos
            let status = cultivo.estado || cultivo.status || '';
            // Acepta variantes comunes
            if (typeof status === 'string') {
                const estadoLower = status.trim().toLowerCase();
                if (["habilitado", "activo", "enabled"].includes(estadoLower)) {
                    status = 'Activo';
                } else if (["deshabilitado", "inhabilitado", "inactivo", "disabled"].includes(estadoLower)) {
                    status = 'Inhabilitado';
                }
            }
            // Usar id numérico real para operaciones backend
            return {
                id: cultivo.cultivoId || cultivo.id || '', // id numérico para backend
                idLabel: cultivo.id || cultivo.cultivoId || '', // id string para mostrar si lo tienes
                name: cultivo.nombre || cultivo.name || '',
                type: cultivo.tipo || cultivo.type || '',
                location: cultivo.ubicacion || cultivo.location || '',
                area: cultivo.tamano || cultivo.area || '',
                status,
                // image: cultivo.imagen || cultivo.image || '',
                description: cultivo.descripcion || cultivo.description || '',
                createdAt: cultivo.fecha_creacion || cultivo.fechaCreacion || cultivo.createdAt || '',
            };
        });
    } catch (e) {
        // Si falla la API, usar cropsData local
        console.warn('Fallo la carga desde la API, usando datos locales:', e.message);
        const { cropsData } = await import('../data/cropsData.js');
        return cropsData;
    }
}

// --- Función para actualizar estado en backend ---
async function toggleCultivoStatus(id, nuevoEstado) {
    await fetch(`http://localhost:5000/cultivos/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
}

class Crops {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = cropsConfig.table.itemsPerPage || 10;
        this.filteredData = [];
        this.selectedCrops = new Set();
        // Cargar datos de la API o local
        this.loadData();
    }

    async loadData() {
        const data = await fetchCropsFromAPI();
        this.filteredData = [...data];
        this.renderTable();
        this.updatePagination();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Filtros (puedes agregar lógica de filtros aquí si lo deseas)
        const filterButton = document.querySelector('.button--filter');
        const filtersClose = document.querySelector('.filters__close');
        const filtersSearch = document.querySelector('.filters__search');
        if (filterButton && filtersClose) {
            filterButton.addEventListener('click', () => {
                document.querySelector('.filters').classList.toggle('hidden');
            });
            filtersClose.addEventListener('click', () => {
                document.querySelector('.filters').classList.add('hidden');
            });
        }
        if (filtersSearch) {
            filtersSearch.addEventListener('input', () => {
                this.filterData();
            });
        }
        this.setupPaginationEvents();
        // --- Selección masiva: imita lógica de Sensores ---
        const checkboxHeader = document.querySelector('.table__checkbox-header');
        const actionsBarCheckbox = document.querySelector('.actions-bar__checkbox');
        // Encabezado de la tabla
        if (checkboxHeader) {
            checkboxHeader.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.table__checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                    this.updateSelectedCrops(checkbox, checkbox.dataset.id);
                });
                // Sincroniza el de la barra
                if (actionsBarCheckbox) actionsBarCheckbox.checked = e.target.checked;
                this.updateHeaderCheckbox();
            });
        }
        // Checkbox de la barra superior
        if (actionsBarCheckbox) {
            actionsBarCheckbox.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.table__checkbox');
                if (e.target.checked) {
                    // Selecciona todos los filtrados
                    this.filteredData.forEach(crop => {
                        this.selectedCrops.add(crop.id);
                    });
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = true;
                        this.updateSelectedCrops(checkbox, checkbox.dataset.id);
                    });
                } else {
                    // Deselecciona todos
                    this.selectedCrops.clear();
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false;
                        this.updateSelectedCrops(checkbox, checkbox.dataset.id);
                    });
                }
                // Sincroniza el de la cabecera
                if (checkboxHeader) checkboxHeader.checked = e.target.checked;
                this.updateHeaderCheckbox();
            });
        }
        // Botón habilitar seleccionados (nuevo selector, compatible con múltiples botones)
        document.querySelectorAll('.button--enable').forEach(enableBtn => {
            enableBtn.addEventListener('click', () => {
                if (!this.selectedCrops) return;
                this.filteredData.forEach(crop => {
                    if (this.selectedCrops.has(crop.id)) {
                        crop.status = 'Activo';
                    }
                });
                this.renderTable();
            });
        });
        // Botón deshabilitar seleccionados (nuevo selector, compatible con múltiples botones)
        document.querySelectorAll('.button--disable').forEach(disableBtn => {
            disableBtn.addEventListener('click', () => {
                if (!this.selectedCrops) return;
                this.filteredData.forEach(crop => {
                    if (this.selectedCrops.has(crop.id)) {
                        crop.status = 'Inhabilitado';
                    }
                });
                this.renderTable();
            });
        });

        // --- MODAL DE REPORTE ---
        // Definir referencias una sola vez fuera de cualquier bloque condicional
        const reportModal = document.getElementById('reportModal');
        const openReportBtn = document.querySelector('.button--report');
        const closeReportModal = document.getElementById('closeReportModal');
        const cancelReportBtn = document.getElementById('cancelReportBtn');
        const generateReportBtn = document.getElementById('generateReportBtn');
        // --- MODAL DE VISUALIZAR CULTIVO ---
        const viewCropModal = document.getElementById('viewCropModal');
        const closeViewCropModal = document.getElementById('closeViewCropModal');
        const closeViewCropBtn = document.getElementById('closeViewCropBtn');
        setTimeout(() => {
            // Abrir modal
            if (openReportBtn) {
                openReportBtn.addEventListener('click', () => {
                    reportModal.classList.add('modal--active');
                });
            }
            // Cerrar modal (icono X)
            if (closeReportModal) {
                closeReportModal.addEventListener('click', () => {
                    reportModal.classList.remove('modal--active');
                });
            }
            // Cerrar modal (botón cancelar)
            if (cancelReportBtn) {
                cancelReportBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    reportModal.classList.remove('modal--active');
                });
            }
            // Generar reporte real
            if (generateReportBtn) {
                generateReportBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const format = document.getElementById('reportFormat').value;
                    const includeInactive = document.getElementById('includeInactive').checked;
                    const includeDetails = document.getElementById('includeDetails').checked;
                    const includeSensors = document.getElementById('includeSensors').checked;
                    const includeSupplies = document.getElementById('includeSupplies').checked;
                    // Filtra los cultivos a incluir
                    let crops = this.filteredData;
                    if (!includeInactive) {
                        crops = crops.filter(crop => crop.status === 'Activo');
                    }
                    // Genera los datos del reporte
                    let csv = 'Nombre,Tipo,Tamaño,Ubicación,Estado';
                    if (includeDetails) csv += ',Detalles';
                    if (includeSensors) csv += ',Sensores';
                    if (includeSupplies) csv += ',Insumos';
                    csv += '\n';
                    crops.forEach(crop => {
                        let row = `${crop.name},${crop.type},${crop.area},${crop.location},${crop.status}`;
                        if (includeDetails) row += ',"Detalles de ejemplo"';
                        if (includeSensors) row += ',"Sensores de ejemplo"';
                        if (includeSupplies) row += ',"Insumos de ejemplo"';
                        csv += row + '\n';
                    });
                    if (format === 'csv') {
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'reporte_cultivos.csv';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    } else if (format === 'excel') {
                        // Genera un archivo Excel simple usando CSV
                        const blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'reporte_cultivos.xlsx';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    } else if (format === 'pdf') {
                        // Genera un PDF simple usando window.print()
                        const win = window.open('', '_blank');
                        win.document.write('<html><head><title>Reporte de Cultivos</title></head><body>');
                        win.document.write('<h2>Reporte de Cultivos</h2>');
                        win.document.write('<pre>' + csv + '</pre>');
                        win.document.write('</body></html>');
                        win.document.close();
                        win.print();
                    }
                    reportModal.classList.remove('modal--active');
                });
            }
            // --- Cerrar modal de visualizar cultivo ---
            if (closeViewCropModal) {
                closeViewCropModal.addEventListener('click', () => {
                    viewCropModal.classList.remove('modal--active');
                });
            }
            if (closeViewCropBtn) {
                closeViewCropBtn.addEventListener('click', () => {
                    viewCropModal.classList.remove('modal--active');
                });
            }
        }, 0);
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
        pageButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
                const pageNumber = Number(button.textContent);
                if (!isNaN(pageNumber)) {
                    this.currentPage = pageNumber;
                    this.renderTable();
                    this.updatePagination();
                }
            });
        });
    }

    filterData() {
        const searchTerm = document.querySelector('.filters__search').value.toLowerCase();
        this.filteredData = this.filteredData.filter(crop =>
            crop.name.toLowerCase().includes(searchTerm) ||
            String(crop.id).toLowerCase().includes(searchTerm)
        );
        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    renderTable() {
        const tbody = document.querySelector('.table__body');
        tbody.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPageData = this.filteredData.slice(startIndex, endIndex);

        currentPageData.forEach(crop => {
            const row = document.createElement('tr');
            row.className = 'table__row';

            let badgeClass = '';
            if (crop.status === 'Activo') {
                badgeClass = 'badge badge--active';
            } else if (crop.status === 'Inhabilitado') {
                badgeClass = 'badge badge--inactive';
            } else {
                badgeClass = 'badge';
            }

            row.innerHTML = `
                <td class="table__cell table__cell--checkbox">
                    <input type="checkbox" class="table__checkbox" data-id="${crop.id}" ${this.selectedCrops && this.selectedCrops.has(crop.id) ? 'checked' : ''} />
                </td>
                <td class="table__cell table__cell--id">${crop.id}</td>
                <td class="table__cell table__cell--name">${crop.name}</td>
                <td class="table__cell table__cell--type">${crop.type}</td>
                <td class="table__cell table__cell--area">${crop.area}</td>
                <td class="table__cell table__cell--location">${crop.location}</td>
                <td class="table__cell table__cell--status">
                    <span class="${badgeClass}">${crop.status}</span>
                </td>
                <td class="table__cell table__cell--actions">
                    <button class="table__action-button table__action-button--view" title="Ver detalles">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <a href="../views/actualizar-cultivo.html?id=${crop.id}" class="table__action-button-wrapper">
                        <button class="table__action-button table__action-button--edit" title="Editar">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </a>

                    <button class="table__action-button table__action-button--toggle-status ${crop.status === 'Activo' ? 'table__action-button--disable' : 'table__action-button--enable'}" data-id="${crop.id}" title="${crop.status === 'Activo' ? 'Deshabilitar' : 'Habilitar'}">
                        <span class="material-symbols-outlined">power_settings_new</span>
                    </button>
                </td>
            `;
            const checkbox = row.querySelector('.table__checkbox');
            checkbox.addEventListener('change', () => {
                this.updateSelectedCrops(checkbox, checkbox.dataset.id);
            });
            row.querySelector('.table__action-button--toggle-status').addEventListener('click', async () => {
                const nuevoEstado = crop.status === 'Activo' ? 'Inhabilitado' : 'Activo';
                crop.status = nuevoEstado;
                console.log('PUT cultivo', crop.id, 'nuevo estado:', nuevoEstado); // log de depuración
                await toggleCultivoStatus(crop.id, nuevoEstado);
                this.renderTable();
            });
            // --- Botón Visualizar ---
            row.querySelector('.table__action-button--view').addEventListener('click', () => {
                this.showCropModal(crop);
            });
            tbody.appendChild(row);
        });
    }

    showCropModal(crop) {
        // Imagen por defecto o la del cultivo si existe
        const imageElem = document.getElementById('modalCropImage');
        if (crop.image || crop.imagen) {
            imageElem.src = crop.image || crop.imagen;
        } else {
            imageElem.src = '../imgs/default-cultivo.jpg';
        }
        // Rellena el modal con los datos del cultivo
        document.getElementById('modalCropId').textContent = crop.id || '';
        document.getElementById('modalCropName').textContent = crop.name || '';
        document.getElementById('modalCropType').textContent = crop.type || '';
        document.getElementById('modalCropArea').textContent = crop.area || '';
        document.getElementById('modalCropLocation').textContent = crop.location || '';
        document.getElementById('modalCropStatus').textContent = crop.status || '';
        document.getElementById('modalCropDescription').textContent = crop.description || crop.descripcion || '-';
        document.getElementById('modalCropCreated').textContent = crop.createdAt || crop.fecha_creacion || crop.fechaCreacion || '-';
        // Muestra el modal
        document.getElementById('viewCropModal').classList.add('modal--active');
    }

    updatePagination() {
        const totalItems = this.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        document.querySelector('.pagination__current-page').textContent = this.currentPage;
        document.querySelector('.pagination__items-per-page').textContent = this.itemsPerPage;
        document.querySelector('.pagination__total-items').textContent = totalItems;
        const paginationControls = document.querySelector('.pagination__controls');
        let controlsHTML = `<button class="pagination__button pagination__button--prev ${this.currentPage === 1 ? 'disabled' : ''}"><span class="material-symbols-outlined">navigate_before</span></button>`;
        for (let i = 1; i <= totalPages; i++) {
            controlsHTML += `<button class="pagination__button ${i === this.currentPage ? 'pagination__button--active' : ''}">${i}</button>`;
        }
        controlsHTML += `<button class="pagination__button pagination__button--next ${this.currentPage === totalPages ? 'disabled' : ''}"><span class="material-symbols-outlined">navigate_next</span></button>`;
        paginationControls.innerHTML = controlsHTML;
        this.setupPaginationEvents();
    }

    updateSelectedCrops(checkbox, id) {
        if (!this.selectedCrops) this.selectedCrops = new Set();
        if (checkbox.checked) {
            this.selectedCrops.add(id);
        } else {
            this.selectedCrops.delete(id);
        }
        this.updateSelectedCount();
        this.updateHeaderCheckbox();
    }

    updateHeaderCheckbox() {
        const checkboxes = document.querySelectorAll('.table__checkbox');
        const headerCheckbox = document.querySelector('.actions-bar__checkbox');
        if (!headerCheckbox) return;
        const allChecked = Array.from(checkboxes).length > 0 && Array.from(checkboxes).every(cb => cb.checked);
        headerCheckbox.checked = allChecked;
    }

    updateSelectedCount() {
        const selected = this.selectedCrops ? this.selectedCrops.size : 0;
        const total = document.querySelectorAll('.table__checkbox').length;
        const selectedSpan = document.querySelector('.actions-bar__count--selected');
        const totalSpan = document.querySelector('.actions-bar__count--total');
        if (selectedSpan) selectedSpan.textContent = selected;
        if (totalSpan) totalSpan.textContent = total;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Crops();
});
