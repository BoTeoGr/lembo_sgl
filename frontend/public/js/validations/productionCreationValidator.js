// URL base para las peticiones al backend
const API_URL = "http://localhost:5000";

// Mapeo de campos ID para cada tipo de entidad
const ID_FIELDS = {
  crop: 'cultivoId',
  sensor: 'id',
  supply: 'id',
  user: 'id',
  cycle: 'id'
};

// Mapeo de campos nombre para cada tipo de entidad
const NAME_FIELDS = {
  crop: 'nombre',
  sensor: 'nombre_sensor',
  supply: 'nombre',
  user: 'nombre',
  cycle: 'nombre'
};

// Objeto para almacenar los datos de la producción
const productionData = {
  nombre: "",
  tipo: "",
  imagen: "",
  ubicacion: "",
  descripcion: "",
  inversion: 0,
  usuario_id: "",
  cantidad: 0,
  estado: "habilitado",
  cultivo_id: "",
  ciclo_id: "",
  insumos_ids: [],
  sensores_ids: []
};

// Inicialización del formulario
document.addEventListener("DOMContentLoaded", async () => {
  await initializeForm();
  setupEventListeners();
});

// Función para obtener todos los items de un endpoint paginado
async function getAllItems(endpoint, limit = 100) {
  try {
    const response = await fetch(`${API_URL}${endpoint}?page=1&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Datos recibidos de ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error al obtener datos de ${endpoint}:`, error);
    return { error };
  }
}

// Función para inicializar el formulario
async function initializeForm() {
  try {
    // Cargar todos los datos necesarios con un límite alto para obtener todos los items
    const [cropsData, cyclesData, sensorsData, suppliesData, usersData] = await Promise.all([
      getAllItems('/cultivos', 100),
      getAllItems('/ciclos', 100),
      getAllItems('/sensores', 100),
      getAllItems('/insumos', 100),
      getAllItems('/usuarios', 100)
    ]);

    console.log('Datos cargados:', { cropsData, cyclesData, sensorsData, suppliesData, usersData });

    // Extraer los arrays de los datos paginados
    const crops = cropsData.cultivos || [];
    const cycles = cyclesData.ciclos || [];
    const sensors = sensorsData.sensores || [];
    const supplies = suppliesData || []; // Los insumos no vienen en un objeto anidado
    const users = usersData.usuarios || [];

    // Llenar los selectores
    fillSelect("crop", crops, "Seleccionar cultivo", NAME_FIELDS.crop, ID_FIELDS.crop);
    fillSelect("cropCycle", cycles, "Seleccionar ciclo", NAME_FIELDS.cycle, ID_FIELDS.cycle);
    fillSelect("sensor", sensors, "Seleccionar sensor", NAME_FIELDS.sensor, ID_FIELDS.sensor);
    fillSelect("supply", supplies, "Seleccionar insumo", NAME_FIELDS.supply, ID_FIELDS.supply);
    
    // Filtrar usuarios por rol si es posible
    const validUsers = Array.isArray(users) ? users.filter(u => u && (u.rol === "admin" || u.rol === "apoyo")) : [];
    fillSelect("responsible", validUsers, "Seleccionar responsable", NAME_FIELDS.user, ID_FIELDS.user);

  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);
    showToast("Error", "No se pudieron cargar los datos iniciales", "error");
  }
}

// Función auxiliar para llenar selectores
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

  const enabledItems = items.filter(item => item && item.estado === "habilitado");
  console.log(`Items habilitados para ${elementId}:`, enabledItems);
  
  enabledItems.forEach(item => {
    const id = item[idField];
    const name = item[nameField];
    if (id && name) {
      select.innerHTML += `<option value="${id}">${name}</option>`;
    } else {
      console.log(`Item inválido en ${elementId} (id: ${id}, name: ${name}):`, item);
      console.log('Campos disponibles:', Object.keys(item));
    }
  });
}

// Función para configurar los event listeners
function setupEventListeners() {
  const elements = {
    // Campos básicos
    productionName: document.getElementById("productionName"),
    productionType: document.getElementById("productionType"),
    location: document.getElementById("location"),
    description: document.getElementById("description"),
    investment: document.getElementById("investment"),
    quantity: document.getElementById("quantity"),
    
    // Selects principales
    crop: document.getElementById("crop"),
    cropCycle: document.getElementById("cropCycle"),
    responsible: document.getElementById("responsible"),

    // Botones de agregar items
    addSensor: document.getElementById("addSensor"),
    addSupply: document.getElementById("addSupply"),

    // Formulario principal
    productionForm: document.getElementById("productionForm")
  };

  // Verificar que todos los elementos existen
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Elemento no encontrado: ${key}`);
      continue;
    }

    if (key === "productionForm") {
      element.addEventListener("submit", createProduction);
    } else if (key === "addSensor") {
      element.addEventListener("click", addSelectedSensor);
    } else if (key === "addSupply") {
      element.addEventListener("click", addSelectedSupply);
    } else {
      element.addEventListener(element.tagName === "SELECT" ? "change" : "input", validateForm);
    }
  }
}

// Funciones para manejar la selección de sensores e insumos
function addSelectedSensor() {
  const sensorSelect = document.getElementById("sensor");
  const selectedSensor = sensorSelect.options[sensorSelect.selectedIndex];
  
  if (!selectedSensor.value) {
    showToast("Error", "Por favor seleccione un sensor", "error");
    return;
  }

  if (productionData.sensores_ids.includes(selectedSensor.value)) {
    showToast("Error", "Este sensor ya ha sido agregado", "error");
    return;
  }

  productionData.sensores_ids.push(selectedSensor.value);
  
  const selectedSensors = document.getElementById("selectedSensors");
  const sensorCard = document.createElement("div");
  sensorCard.className = "item-card";
  sensorCard.dataset.sensorId = selectedSensor.value;
  sensorCard.innerHTML = `
    <button type="button" class="remove-item" onclick="removeSelectedItem(this, 'sensor')">
      <i class="fas fa-times"></i>
    </button>
    <div class="item-info">
      <span class="item-name">${selectedSensor.text}</span>
    </div>
  `;
  
  selectedSensors.appendChild(sensorCard);
  validateForm();

  // Deshabilitar el botón si ya se seleccionaron 3 sensores
  document.getElementById("addSensor").disabled = productionData.sensores_ids.length >= 3;
}

function addSelectedSupply() {
  const supplySelect = document.getElementById("supply");
  const selectedSupply = supplySelect.options[supplySelect.selectedIndex];
  
  if (!selectedSupply.value) {
    showToast("Error", "Por favor seleccione un insumo", "error");
    return;
  }

  if (productionData.insumos_ids.includes(selectedSupply.value)) {
    showToast("Error", "Este insumo ya ha sido agregado", "error");
    return;
  }

  productionData.insumos_ids.push(selectedSupply.value);
  
  const selectedSupplies = document.getElementById("selectedSupplies");
  const supplyCard = document.createElement("div");
  supplyCard.className = "item-card";
  supplyCard.dataset.supplyId = selectedSupply.value;
  supplyCard.innerHTML = `
    <button type="button" class="remove-item" onclick="removeSelectedItem(this, 'supply')">
      <i class="fas fa-times"></i>
    </button>
    <div class="item-info">
      <span class="item-name">${selectedSupply.text}</span>
    </div>
  `;
  
  selectedSupplies.appendChild(supplyCard);
  validateForm();

  // Deshabilitar el botón si ya se seleccionaron 3 insumos
  document.getElementById("addSupply").disabled = productionData.insumos_ids.length >= 3;
}

function removeSelectedItem(button, type) {
  const card = button.closest('.item-card');
  const itemId = type === 'sensor' ? card.dataset.sensorId : card.dataset.supplyId;
  
  if (type === 'sensor') {
    productionData.sensores_ids = productionData.sensores_ids.filter(id => id !== itemId);
    // Habilitar el botón si hay menos de 3 sensores
    document.getElementById("addSensor").disabled = productionData.sensores_ids.length >= 3;
  } else {
    productionData.insumos_ids = productionData.insumos_ids.filter(id => id !== itemId);
    // Habilitar el botón si hay menos de 3 insumos
    document.getElementById("addSupply").disabled = productionData.insumos_ids.length >= 3;
  }
  
  card.remove();
  validateForm();
}

// Función para validar el formulario
function validateForm() {
  const requiredFields = [
    'productionName',
    'productionType',
    'location',
    'description',
    'investment',
    'quantity',
    'crop',
    'cropCycle',
    'responsible'
  ];

  let isValid = true;

  // Validar campos requeridos
  for (const field of requiredFields) {
    const element = document.getElementById(field);
    if (!element || !element.value.trim()) {
      isValid = false;
      break;
    }
  }

  // Validar sensores y suministros
  if (productionData.sensores_ids.length < 3) {
    isValid = false;
  }

  if (productionData.insumos_ids.length < 3) {
    isValid = false;
  }

  // Mostrar mensajes de validación específicos
  if (!isValid) {
    if (productionData.sensores_ids.length < 3) {
      showToast("Validación", "Se requieren al menos 3 sensores", "warning");
    }
    if (productionData.insumos_ids.length < 3) {
      showToast("Validación", "Se requieren al menos 3 insumos", "warning");
    }
  }

  const createBtn = document.getElementById("createBtn");
  createBtn.disabled = !isValid;

  return isValid;
}

// Función para crear la producción
async function createProduction(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    showToast("Error", "Por favor complete todos los campos requeridos", "error");
    return;
  }

  try {
    // Preparar los datos de la producción
    const productionWithImage = {
      nombre: document.getElementById('productionName').value,
      tipo: document.getElementById('productionType').value,
      imagen: 'imagen.png', // Usar imagen por defecto
      ubicacion: document.getElementById('location').value,
      descripcion: document.getElementById('description').value,
      inversion: parseFloat(document.getElementById('investment').value) || 0,
      cantidad: parseFloat(document.getElementById('quantity').value) || 0,
      estado: "habilitado",
      cultivo_id: parseInt(document.getElementById('crop').value) || 0,
      ciclo_id: parseInt(document.getElementById('cropCycle').value) || 0,
      usuario_id: parseInt(document.getElementById('responsible').value) || 0,
      // Convertir arrays a strings separados por comas
      insumos_ids: (productionData.insumos_ids || []).join(','),
      sensores_ids: (productionData.sensores_ids || []).join(',')
    };

    // Log de datos a enviar
    console.log('Datos a enviar:', productionWithImage);

    // Enviar la producción al servidor
    const response = await fetch(`${API_URL}/producciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productionWithImage)
    });

    const responseData = await response.json();
    
    // Log detallado de la respuesta
    console.log('Respuesta completa del servidor:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      responseData: JSON.stringify(responseData, null, 2)
    });
    
    if (!response.ok) {
      let errorMessage;
      
      if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else if (responseData && typeof responseData === 'object') {
        errorMessage = responseData.error || responseData.message || JSON.stringify(responseData);
      } else {
        errorMessage = "Error desconocido al crear la producción";
      }
      
      throw new Error(errorMessage);
    }

    showToast("Éxito", "Producción creada correctamente", "success");
    setTimeout(() => {
      window.location.href = "listar-producciones.html";
    }, 2000);

  } catch (error) {
    // Log detallado del error
    console.error("Error detallado al crear la producción:", {
      errorMessage: error.message,
      errorObject: error,
      errorString: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    showToast("Error", error.message || "No se pudo crear la producción", "error");
  }
}

// Función para mostrar notificaciones
function showToast(title, message, type = "success") {
  const toast = document.getElementById("toast");
  const toastTitle = toast.querySelector(".toast__title");
  const toastMessage = toast.querySelector(".toast__message");
  
  toast.className = `toast toast--${type}`;
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  
  toast.classList.remove("hidden");
  
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// Hacer la función removeSelectedItem global para que pueda ser llamada desde el HTML
window.removeSelectedItem = removeSelectedItem;