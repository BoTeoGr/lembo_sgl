// URL base para las peticiones al backend
const API_URL = 'http://localhost:5000';

// Objeto para almacenar los datos del uso de insumos
const supplyUsageData = {
    fecha_uso: "",
    cantidad: 0,
    responsable_id: "",
    valor_unitario: 0,
    valor_total: 0,
    observaciones: "",
    insumo_id: "",
    produccion_id: "",
    cantidad_disponible: 0
};

// Array para almacenar todos los usos de insumos
let supplyUsages = [];

// Array para almacenar los insumos seleccionados
let selectedSupplies = [];

// Array global para almacenar todos los insumos traídos del backend
let allSupplies = [];

// Función para obtener todos los items de un endpoint
async function getAllItems(endpoint, limit = 100) {
    try {
        const response = await fetch(`${API_URL}${endpoint}?page=1&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener datos de ${endpoint}:`, error);
        return { error };
    }
}

// Función para llenar un select con opciones (corregida para mapear propiedades)
function fillSelect(elementId, items, defaultText, nameField, idField = 'id') {
    const select = document.getElementById(elementId);
    if (!select) {
        console.error(`No se encontró el elemento con id: ${elementId}`);
        return;
    }

    select.innerHTML = `<option value="">${defaultText}</option>`;
    
    if (!Array.isArray(items)) {
        console.error(`Los datos para ${elementId} no son un array:`, items);
        return;
    }

    items.forEach(item => {
        // Normalizar propiedades para insumos
        let id = item[idField];
        let name = item[nameField];
        // Si es insumo, normalizar cantidad y valor_unitario
        if (elementId === 'supply' || elementId === 'supplyUsageResponsible') {
            // Si viene como insumeAmount o insumePrice, los mapeamos
            if (item.insumeAmount !== undefined && item.cantidad === undefined) {
                item.cantidad = parseInt(item.insumeAmount);
            }
            if (item.insumePrice !== undefined && item.valor_unitario === undefined) {
                item.valor_unitario = parseFloat(item.insumePrice);
            }
        }
        if (id && name) {
            select.innerHTML += `<option value="${id}">${name}</option>`;
        }
    });
}

// Función para inicializar el formulario de uso de insumos
async function initializeSupplyUsageForm() {
    try {
        // Cargar usuarios para el selector de responsables
        const usersData = await getAllItems('/usuarios', 100);
        const users = usersData.usuarios || [];
        fillSelect("supplyUsageResponsible", users, "Seleccionar responsable", "nombre", "id");

        // Cargar insumos del backend
        const suppliesData = await getAllItems('/insumos', 100);
        allSupplies = Array.isArray(suppliesData) ? suppliesData : (suppliesData.insumos || []);
        // Normalizar propiedades de los insumos
        allSupplies = allSupplies.map(supply => ({
            ...supply,
            cantidad: supply.cantidad !== undefined ? supply.cantidad : (supply.insumeAmount !== undefined ? parseInt(supply.insumeAmount) : 0),
            valor_unitario: supply.valor_unitario !== undefined ? supply.valor_unitario : (supply.insumePrice !== undefined ? parseFloat(supply.insumePrice) : 0),
            nombre: supply.nombre || supply.insumeName || ''
        }));
        // Llenar el select de insumos
        fillSelect("supply", allSupplies, "Seleccionar insumo", "nombre", "id");

        // Configurar event listeners
        setupSupplyUsageEventListeners();
    } catch (error) {
        console.error("Error al inicializar el formulario de uso de insumos:", error);
        showToast("Error", "No se pudieron cargar los datos iniciales", "error");
    }
}

// Función para configurar los event listeners
function setupSupplyUsageEventListeners() {
    // Event listener para el cambio de cantidad
    document.getElementById('supplyUsageQuantity').addEventListener('input', calculateTotalValue);
    
    // Event listener para el botón de registrar uso
    document.getElementById('addSupplyUsage').addEventListener('click', addSupplyUsage);
}

// Función para mostrar el formulario de uso de insumo
function showSupplyUsageForm(supply) {
    console.log('Objeto supply recibido en showSupplyUsageForm:', supply);
    const supplyUsageForm = document.getElementById('supplyUsageForm');
    supplyUsageForm.classList.remove('hidden');

    // Compatibilidad de nombres de propiedades
    const cantidad = supply.cantidad !== undefined ? supply.cantidad : (supply.insumeAmount !== undefined ? supply.insumeAmount : 0);
    const valorUnitario = supply.valor_unitario !== undefined ? supply.valor_unitario : (supply.insumePrice !== undefined ? supply.insumePrice : 0);

    document.getElementById('supplyName').textContent = supply.nombre || supply.insumeName || '';
    document.getElementById('availableQuantity').textContent = cantidad;
    document.getElementById('unitValue').textContent = `$${valorUnitario}`;

    // Establecer la cantidad máxima y el valor unitario
    const quantityInput = document.getElementById('supplyUsageQuantity');
    quantityInput.max = cantidad;
    quantityInput.placeholder = `Máximo: ${cantidad}`;
    quantityInput.value = '';

    // Guardar los datos del insumo
    supplyUsageData.cantidad_disponible = cantidad;
    supplyUsageData.valor_unitario = valorUnitario;
    supplyUsageData.insumo_id = supply.id;

    calculateTotalValue();
}

// Función para calcular el valor total
function calculateTotalValue() {
    const quantity = parseFloat(document.getElementById('supplyUsageQuantity').value) || 0;
    const unitValue = supplyUsageData.valor_unitario;
    const totalValue = quantity * unitValue;
    
    // Actualizar el valor total en el formulario
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    
    // Actualizar los datos
    supplyUsageData.valor_total = totalValue;
    supplyUsageData.cantidad = quantity;
}

// Función para actualizar la lista de insumos seleccionados
window.updateSelectedSupplies = function(supplies) {
    selectedSupplies = supplies;
    const supplySelect = document.getElementById('supply');
    const supplyUsageForm = document.getElementById('supplyUsageForm');
    const supplySelectContainer = supplySelect.parentElement;

    if (supplies.length > 0) {
        supplySelectContainer.classList.remove('hidden');
        supplySelect.innerHTML = '<option value="">Seleccionar insumo</option>';
        supplies.forEach(supply => {
            supplySelect.innerHTML += `
                <option value="${supply.id}" data-unit-value="${supply.valor_unitario}" data-quantity="${supply.cantidad}">
                    ${supply.nombre} - Disponible: ${supply.cantidad} - Valor unitario: $${supply.valor_unitario}
                </option>
            `;
        });
        supplyUsageForm.classList.add('hidden');
    } else {
        supplySelectContainer.classList.add('hidden');
        supplyUsageForm.classList.add('hidden');
    }
};

// Función para actualizar el campo de inversión
function updateInvestmentField() {
    const totalInvestment = supplyUsages.reduce((sum, usage) => sum + (usage.valor_total || 0), 0);
    const investmentInput = document.getElementById('totalInvestment');
    if (investmentInput) {
        investmentInput.value = totalInvestment.toFixed(2);
    }
    // Calcular la meta de ganancias estimada (30% más)
    const estimatedProfitInput = document.getElementById('estimatedProfit');
    if (estimatedProfitInput) {
        const estimatedProfit = totalInvestment * 1.3;
        estimatedProfitInput.value = estimatedProfit.toFixed(2);
    }
}

// Función para agregar un uso de insumo
async function addSupplyUsage() {
    // Obtener los valores del formulario
    const fechaUso = document.getElementById('supplyUsageDate').value;
    const cantidad = document.getElementById('supplyUsageQuantity').value;
    const responsableId = document.getElementById('supplyUsageResponsible').value;
    const observaciones = document.getElementById('supplyUsageObservations').value;

    // Validar que todos los campos sean obligatorios
    if (!fechaUso || !cantidad || !responsableId || !supplyUsageData.insumo_id) {
        showToast("Error", "Todos los campos son obligatorios", "error");
        return;
    }

    supplyUsageData.fecha_uso = fechaUso;
    supplyUsageData.cantidad = parseFloat(cantidad);
    supplyUsageData.responsable_id = responsableId;
    supplyUsageData.observaciones = observaciones;
    
    // Validar que la cantidad no exceda la disponible
    if (supplyUsageData.cantidad > supplyUsageData.cantidad_disponible) {
        showToast("Error", "La cantidad excede la disponible", "error");
        return;
    }
    
    try {
        // Actualizar la cantidad disponible del insumo
        const supply = selectedSupplies.find(s => s.id === supplyUsageData.insumo_id);
        if (supply) {
            const newQuantity = supply.cantidad - supplyUsageData.cantidad;
            const newTotalValue = supply.valor_unitario * newQuantity;
            
            // Actualizar el insumo en el backend
            const response = await fetch(`${API_URL}/insumos/${supply.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cantidad: newQuantity,
                    valor_total: newTotalValue
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al actualizar el insumo');
            }
            
            // Actualizar los datos locales
            supply.cantidad = newQuantity;
            supply.valor_total = newTotalValue;
            
            // Guardar el uso registrado en el array
            supplyUsages.push({
                insumo_id: supply.id,
                nombre: supply.nombre,
                cantidad: supplyUsageData.cantidad,
                valor_unitario: supply.valor_unitario,
                valor_total: supplyUsageData.valor_total
            });
            // Actualizar el campo de inversión
            updateInvestmentField();
            
            // Limpiar el formulario
            clearSupplyUsageForm();
            
            showToast("Éxito", "Uso de insumo registrado correctamente", "success");
        }
    } catch (error) {
        console.error("Error al registrar el uso de insumo:", error);
        showToast("Error", "No se pudo registrar el uso de insumo", "error");
    }
}

// Función para limpiar el formulario
function clearSupplyUsageForm() {
    document.getElementById('supplyUsageDate').value = '';
    document.getElementById('supplyUsageQuantity').value = '';
    document.getElementById('supplyUsageResponsible').value = '';
    document.getElementById('supplyUsageObservations').value = '';
    document.getElementById('supplyUsageForm').classList.add('hidden');
}

// Inicializar el formulario cuando el documento esté listo
document.addEventListener('DOMContentLoaded', initializeSupplyUsageForm); 

function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastDescription = document.getElementById("toastDescription");
    const toastIcon = document.getElementById("toastIcon");
    
    // Configurar el icono según el tipo
    toastIcon.className = type === "success" 
        ? "fas fa-check-circle"
        : type === "error" 
            ? "fas fa-exclamation-circle" 
            : "fas fa-info-circle";
    
    // Configurar el color según el tipo
    toast.className = `toast toast--${type}`;
    
    // Establecer el contenido
    toastTitle.textContent = title;
    toastDescription.textContent = message;
    
    // Mostrar el toast
    toast.classList.remove("hidden");
    
    // Reiniciar la animación de la barra de progreso
    const toastProgress = toast.querySelector(".toast-progress");
    toastProgress.style.animation = "none";
    toastProgress.offsetHeight; // Trigger reflow
    toastProgress.style.animation = "progress 3s linear";
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// Función global para mostrar el formulario de uso de un insumo por id
window.showSupplyUsageFormById = function(insumoId) {
    const supply = selectedSupplies.find(s => String(s.id) === String(insumoId));
    if (supply) {
        showSupplyUsageForm(supply);
    }
};