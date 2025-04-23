import ViewModal from '../components/ViewModal.js';
import productionsData from '../data/productionsData.js';
import { productionsConfig } from '../config/productionsConfig.js';

class Productions {
    constructor() {
        this.viewModal = new ViewModal();
        this.initializeEventListeners();
        this.renderTable();
    }

    initializeEventListeners() {
        // Eventos de los botones de acción
        document.querySelectorAll('.table__action-button--view').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                const productionId = row.querySelector('.table__cell--id').textContent;
                this.viewModal.open(productionId);
            });
        });

        // Eventos de los checkboxes
        document.querySelectorAll('.table__checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectionCount());
        });

        document.querySelector('.table__checkbox-header').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.table__checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
            this.updateSelectionCount();
        });
    }

    updateSelectionCount() {
        const total = document.querySelectorAll('.table__checkbox').length;
        const selected = document.querySelectorAll('.table__checkbox:checked').length;
        
        document.querySelector('.actions-bar__count--selected').textContent = selected;
        document.querySelector('.actions-bar__count--total').textContent = total;
    }

    renderTable() {
        const tbody = document.querySelector('.table__body');
        tbody.innerHTML = '';

        productionsData.forEach(production => {
            const row = document.createElement('tr');
            row.className = 'table__row';
            
            // Checkbox
            row.innerHTML = `
                <td class="table__cell table__cell--checkbox">
                    <input type="checkbox" class="table__checkbox" />
                </td>
            `;

            // Columnas según la configuración
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

            // Botones de acción
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
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Productions();
});