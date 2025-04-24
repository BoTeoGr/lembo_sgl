import productionsData from '../data/productionsData.js';
import { productionsConfig } from '../config/productionsConfig.js';

class Productions {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredData = [...productionsData];
        this.selectedProductions = new Set();
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
                this.filteredData = [...productionsData];
                this.currentPage = 1;
                this.renderTable();
                this.updatePagination();
            });
        }
        // Buscador rápido
        if (filtersSearch) {
            filtersSearch.addEventListener('input', (e) => {
                const value = e.target.value.toLowerCase();
                this.filteredData = productionsData.filter(prod =>
                    prod.id.toLowerCase().includes(value) ||
                    prod.name.toLowerCase().includes(value)
                );
                this.currentPage = 1;
                this.renderTable();
                this.updatePagination();
            });
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
            if (btn.classList.contains('table__action-button--enable')) {
                this.updateStatus([id], 'Activo');
            } else if (btn.classList.contains('table__action-button--disable')) {
                this.updateStatus([id], 'Inactivo');
            }
        });
    }

    updateStatus(ids, status) {
        productionsData.forEach(prod => {
            if (ids.includes(prod.id)) prod.status = status;
        });
        this.renderTable();
        this.updatePagination();
        this.selectedProductions.clear();
        this.updateSelectionCount();
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
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Productions();
});