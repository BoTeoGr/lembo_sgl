// Objeto para almacenar los datos de la producción
const productionData = {
    id: '',
    name: '',
    responsible: '',
    crop: '',
    cycle: '',
    sensors: [],
    supplies: [],
    totalInvestment: 0,
    profitGoal: 0,
    startDate: '',
    endDate: ''
};

// Función para generar ID de producción
function generateProductionId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // El número secuencial debería venir del backend
    const sequence = '0001';
    return `PROD-${day}${month}${year}-${sequence}`;
}

// Establecer fecha actual por defecto
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('productionId').value = generateProductionId();

    // Cargar datos iniciales
    loadResponsibles();
    loadCrops();
    loadCycles();
    loadSensors();
    loadSupplies();
});

// Validación del nombre de producción
const productionNameInput = document.getElementById('productionName');
productionNameInput.addEventListener('input', validateProductionName);

function validateProductionName() {
    const name = productionNameInput.value;
    const nameRegex = /^(?=.*[a-zA-Z])[a-zA-ZÀ-ÿ\s\-]{3,100}$/;
    
    if (!nameRegex.test(name)) {
        showError(productionNameInput, 'El nombre debe tener entre 3 y 100 caracteres y contener al menos una letra');
        return false;
    }
    
    clearError(productionNameInput);
    return true;
}

// Validación de fechas
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

endDateInput.addEventListener('change', validateDates);

function validateDates() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (endDate <= startDate) {
        showError(endDateInput, 'La fecha de fin debe ser posterior a la fecha de inicio');
        return false;
    }
    
    clearError(endDateInput);
    return true;
}

// Validación de sensores
const sensorsSelect = document.getElementById('sensors');
sensorsSelect.addEventListener('change', validateSensors);

function validateSensors() {
    const selectedSensors = Array.from(sensorsSelect.selectedOptions);
    if (selectedSensors.length > 3) {
        showError(sensorsSelect, 'No se pueden seleccionar más de 3 sensores');
        return false;
    }
    clearError(sensorsSelect);
    return true;
}

// Gestión de insumos y cálculos
const suppliesTableBody = document.getElementById('suppliesTableBody');
const addSupplyRowButton = document.querySelector('.button--add-row');

addSupplyRowButton.addEventListener('click', addSupplyRow);

function addSupplyRow() {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <select class="form__select supply-select">
                <option value="">Seleccionar insumo</option>
                ${loadSupplyOptions()}
            </select>
        </td>
        <td><input type="date" class="form__input supply-date" /></td>
        <td><input type="number" class="form__input supply-quantity" min="0" /></td>
        <td><input type="number" class="form__input supply-unit-price" min="0" /></td>
        <td><input type="text" class="form__input supply-total" disabled /></td>
        <td>
            <button type="button" class="button button--delete">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    suppliesTableBody.appendChild(row);
    
    // Añadir listeners para cálculos
    const quantityInput = row.querySelector('.supply-quantity');
    const unitPriceInput = row.querySelector('.supply-unit-price');
    [quantityInput, unitPriceInput].forEach(input => {
        input.addEventListener('input', () => calculateRowTotal(row));
    });
    
    // Botón eliminar
    row.querySelector('.button--delete').addEventListener('click', () => {
        row.remove();
        updateTotals();
    });
}

function calculateRowTotal(row) {
    const quantity = parseFloat(row.querySelector('.supply-quantity').value) || 0;
    const unitPrice = parseFloat(row.querySelector('.supply-unit-price').value) || 0;
    const total = quantity * unitPrice;
    row.querySelector('.supply-total').value = total.toFixed(2);
    updateTotals();
}

function updateTotals() {
    let totalInvestment = 0;
    document.querySelectorAll('.supply-total').forEach(input => {
        totalInvestment += parseFloat(input.value) || 0;
    });
    
    document.getElementById('totalInvestment').value = `$${totalInvestment.toFixed(2)}`;
    // Calcular meta de ganancias (ejemplo: 30% sobre la inversión)
    const profitGoal = totalInvestment * 1.3;
    document.getElementById('profitGoal').value = `$${profitGoal.toFixed(2)}`;
}

// Validación del formulario completo
const form = document.getElementById('productionForm');
const createButton = document.getElementById('createProduction');
const saveDraftButton = document.getElementById('saveDraft');

form.addEventListener('change', validateForm);

function validateForm() {
    const isValid = validateProductionName() &&
                   validateDates() &&
                   validateSensors() &&
                   document.getElementById('responsible').value &&
                   document.getElementById('crop').value &&
                   document.getElementById('cycle').value;
    
    createButton.disabled = !isValid;
}

// Manejo de modales para agregar nuevos registros
const addButtons = {
    addResponsible: document.getElementById('addResponsible'),
    addCrop: document.getElementById('addCrop'),
    addCycle: document.getElementById('addCycle'),
    addSensor: document.getElementById('addSensor'),
    addSupply: document.getElementById('addSupply')
};

Object.entries(addButtons).forEach(([key, button]) => {
    button.addEventListener('click', () => openModal(key));
});

function openModal(type) {
    const modal = document.getElementById('addModal');
    const modalBody = modal.querySelector('.modal__body');
    
    // Cargar formulario correspondiente según el tipo
    modalBody.innerHTML = getModalForm(type);
    
    modal.classList.remove('hidden');
}

// Funciones para cargar datos (simuladas)
function loadResponsibles() {
    // Simular carga de responsables desde el backend
}

function loadCrops() {
    // Simular carga de cultivos desde el backend
}

function loadCycles() {
    // Simular carga de ciclos desde el backend
}

function loadSensors() {
    // Simular carga de sensores desde el backend
}

function loadSupplies() {
    // Simular carga de insumos desde el backend
}

// Funciones auxiliares
function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
}

function clearError(element) {
    const errorDiv = element.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showToast(title, message, type = 'success') {
    // Implementación del toast
}
