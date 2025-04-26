// URL base para las peticiones al backend
const API_URL = 'http://localhost:5000';

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

// Variables para el modal de creación de usuario
const createUserBtn = document.getElementById('createUserBtn');
const createUserModal = document.getElementById('createUserModal');
const closeCreateUserModal = document.getElementById('closeCreateUserModal');
const createUserForm = document.getElementById('createUserForm');

// Objeto para almacenar datos del usuario en el modal
const modalUserData = {
    userTypeId: "",
    userName: "",
    userId: "",
    userTel: "",
    userEmail: "",
    userConfirmEmail: "",
    userRol: "",
    estado: "habilitado"
};

// Variables para el modal de creación de sensor
const createSensorBtn = document.getElementById('createSensorBtn');
const createSensorModal = document.getElementById('createSensorModal');
const closeCreateSensorModal = document.getElementById('closeCreateSensorModal');
const createSensorForm = document.getElementById('createSensorForm');

// Objeto para almacenar datos del sensor en el modal
const modalSensorData = {
    sensorType: "",
    sensorName: "",
    sensorUnit: "",
    sensorImage: "",
    sensorDescription: "",
    sensorScan: "",
    estado: "habilitado"
};

// Variables para el modal de creación de insumo
const createSupplyBtn = document.getElementById('createSupplyBtn');
const createSupplyModal = document.getElementById('createSupplyModal');
const closeCreateSupplyModal = document.getElementById('closeCreateSupplyModal');
const createSupplyForm = document.getElementById('createSupplyForm');

// Objeto para almacenar datos del insumo en el modal
const modalSupplyData = {
    insumeName: "",
    insumeType: "",
    insumeImage: "",
    insumeExtent: "",
    insumeDescription: "",
    insumePrice: "",
    insumeAmount: "",
    totalValue: "",
    insumeId: 1, // Valor por defecto para el usuario
    estado: "habilitado"
};

// Variables para el modal de creación de cultivo
const createCropBtn = document.getElementById('createCropBtn');
const createCropModal = document.getElementById('createCropModal');
const closeCreateCropModal = document.getElementById('closeCreateCropModal');
const createCropForm = document.getElementById('createCropForm');

// Objeto para almacenar datos del cultivo en el modal
const modalCropData = {
    cultiveName: "",
    cultiveType: "",
    cultiveImage: "",
    cultiveLocation: "",
    cultiveDescription: "",
    cultiveSize: "",
    usuario_id: 1, // Valor por defecto para el usuario
    estado: "habilitado"
};

// Variables para el modal de creación de ciclo de cultivo
const createCropCycleBtn = document.getElementById('createCropCycleBtn');
const createCropCycleModal = document.getElementById('createCropCycleModal');
const closeCreateCropCycleModal = document.getElementById('closeCreateCropCycleModal');
const createCropCycleForm = document.getElementById('createCropCycleForm');

// Objeto para almacenar datos del ciclo de cultivo en el modal
const modalCropCycleData = {
    cycleName: "",
    cycleDescription: "",
    cycleStartDate: "",
    cycleEndDate: "",
    cycleUpdates: "",
    usuario_id: 1, // Valor por defecto para el usuario
    estado: "habilitado"
};

// Guardar el array global de insumos al cargar el formulario
let allSuppliesGlobal = [];

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

// Función para actualizar el select de insumos disponibles
function updateAvailableSuppliesSelect() {
    const supplySelect = document.getElementById("supply");
    // Filtra los insumos que NO están en la lista de seleccionados
    const availableSupplies = allSuppliesGlobal.filter(supply =>
        !productionData.insumos_ids.includes(String(supply.id))
    );
    supplySelect.innerHTML = '<option value="">Seleccionar insumo</option>';
    availableSupplies.forEach(supply => {
        supplySelect.innerHTML += `
            <option value="${supply.id}">
                ${supply.nombre}
            </option>
        `;
    });
}

// Función para inicializar el formulario
async function initializeForm() {
  try {
    // Cargar todos los datos necesarios con un límite alto para obtener todos los items
    const [cropsData, cyclesData, sensorsData, suppliesData, usersData] = await Promise.all([
      getAllItems('/cultivos', 100),
      getAllItems('/ciclo_cultivo', 100),
      getAllItems('/sensor', 100),
      getAllItems('/insumos', 100),
      getAllItems('/usuarios', 100)
    ]);

    console.log('Datos cargados:', { cropsData, cyclesData, sensorsData, suppliesData, usersData });

    // Extraer los arrays de los datos paginados
    const crops = cropsData.cultivos || [];
    const cycles = cyclesData.ciclos || [];
    const sensors = sensorsData.sensores || [];
    const supplies = suppliesData || [];
    const users = usersData.usuarios || [];

    // Llenar los selectores
    fillSelect("crop", crops, "Seleccionar cultivo", NAME_FIELDS.crop, ID_FIELDS.crop);
    fillSelect("cropCycle", cycles, "Seleccionar ciclo", NAME_FIELDS.cycle, ID_FIELDS.cycle);
    fillSelect("sensor", sensors, "Seleccionar sensor", NAME_FIELDS.sensor, ID_FIELDS.sensor);
    allSuppliesGlobal = Array.isArray(supplies) ? supplies : (supplies.insumos || []);
    updateAvailableSuppliesSelect();
    fillSelect("supply", supplies, "Seleccionar insumo", NAME_FIELDS.supply, ID_FIELDS.supply);
    
    // Mostrar todos los usuarios sin filtrar por rol
    fillSelect("responsible", users, "Seleccionar responsable", NAME_FIELDS.user, ID_FIELDS.user);

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

// Función para validar el formulario
function validateForm() {
    // Validar campos requeridos básicos
    const requiredFields = [
        'productionName',
        'productionType',
        'location',
        'description',
        'crop',
        'cropCycle',
        'responsible'
    ];

    // Verificar campos requeridos
    const basicFieldsValid = requiredFields.every(field => {
        const element = document.getElementById(field);
        return element && element.value.trim() !== "";
    });

    // Verificar sensores e insumos
    const hasSufficientSensors = productionData.sensores_ids.length >= 3;

    // El formulario es válido solo si todos los campos están completos
    const isValid = basicFieldsValid && hasSufficientSensors;

    // Habilitar/deshabilitar el botón de crear
    const createBtn = document.getElementById("createBtn");
    createBtn.disabled = !isValid;

    return isValid;
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

    // Mostrar mensaje si aún no se alcanza el mínimo de sensores
    if (productionData.sensores_ids.length < 3) {
        showToast("Sensores", `Necesitas agregar ${3 - productionData.sensores_ids.length} sensor(es) más`, "warning");
    }

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

    // Buscar el objeto completo en el array global y pasarlo a updateSelectedSupplies
    const selectedSuppliesFull = productionData.insumos_ids.map(id => {
        return allSuppliesGlobal.find(s => String(s.id) === String(id));
    });
    if (typeof window.updateSelectedSupplies === 'function') {
        window.updateSelectedSupplies(selectedSuppliesFull);
        if (typeof window.showSupplyUsageFormById === 'function') {
            window.showSupplyUsageFormById(selectedSupply.value);
        }
    }
    updateAvailableSuppliesSelect();
}

function removeSelectedItem(button, type) {
    const card = button.closest('.item-card');
    const itemId = type === 'sensor' ? card.dataset.sensorId : card.dataset.supplyId;
    if (type === 'sensor') {
        productionData.sensores_ids = productionData.sensores_ids.filter(id => id !== itemId);
        document.getElementById("addSensor").disabled = productionData.sensores_ids.length >= 3;
        if (productionData.sensores_ids.length < 3) {
            showToast("Sensores", `Necesitas agregar ${3 - productionData.sensores_ids.length} sensor(es) más`, "warning");
        }
    } else {
        productionData.insumos_ids = productionData.insumos_ids.filter(id => id !== itemId);
        updateAvailableSuppliesSelect();
    }
    card.remove();
    validateForm();
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

// Hacer la función removeSelectedItem global para que pueda ser llamada desde el HTML
window.removeSelectedItem = removeSelectedItem;

// Event listeners para el modal
createUserBtn.addEventListener('click', () => {
    createUserModal.classList.remove('hidden');
});

closeCreateUserModal.addEventListener('click', () => {
    createUserModal.classList.add('hidden');
});

// Event listeners para el formulario del modal
document.getElementById('modal-tipo-documento').addEventListener('change', (e) => {
    modalUserData.userTypeId = e.target.value;
});

// Bloquear números en el campo de nombre
document.getElementById('modal-nombre').addEventListener('keydown', function (e) {
    if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        console.log("Número bloqueado");
    }
});

document.getElementById('modal-nombre').addEventListener('input', (e) => {
    modalUserData.userName = e.target.value;
});

// Solo permitir números en el campo de documento
document.getElementById('modal-numero-documento').addEventListener('keydown', function (e) {
    if (
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
        return; //No bloquear estas teclas
    }

    //Bloquear cualquier tecla que NO sea un número
    if (e.key < "0" || e.key > "9") {
        e.preventDefault();
        console.log("Solo se permite números");
    }
});

document.getElementById('modal-numero-documento').addEventListener('input', (e) => {
    modalUserData.userId = e.target.value;
});

// Solo permitir números en el campo de teléfono
document.getElementById('modal-telefono').addEventListener('keydown', function (e) {
    if (
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
        return; //No bloquear estas teclas
    }

    //Bloquear cualquier tecla que NO sea un número
    if (e.key < "0" || e.key > "9") {
        e.preventDefault();
        console.log("Solo se permite números");
    }
});

document.getElementById('modal-telefono').addEventListener('input', (e) => {
    modalUserData.userTel = e.target.value;
});

document.getElementById('modal-correo').addEventListener('input', (e) => {
    modalUserData.userEmail = e.target.value;
});

document.getElementById('modal-confirmar-correo').addEventListener('input', (e) => {
    modalUserData.userConfirmEmail = e.target.value;
});

document.getElementById('modal-rol').addEventListener('change', (e) => {
    modalUserData.userRol = e.target.value;
});

document.querySelectorAll('input[name="modal-estado-habilitado"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        modalUserData.estado = e.target.value;
    });
});

// Función para validar los datos del usuario en el modal
function validateModalUserData() {
    const requiredFields = [
        { field: "userTypeId", label: "Tipo de documento" },
        { field: "userName", label: "Nombre" },
        { field: "userId", label: "Número de documento" },
        { field: "userTel", label: "Teléfono" },
        { field: "userEmail", label: "Correo electrónico" },
        { field: "userConfirmEmail", label: "Confirmación de correo" },
        { field: "userRol", label: "Rol" },
        { field: "estado", label: "Estado" }
    ];

    for (const field of requiredFields) {
        if (!modalUserData[field.field]) {
            showToast(`Por favor, complete el campo ${field.label}`, "", "error");
            return false;
        }
    }

    // Validar que los correos coincidan
    if (modalUserData.userEmail !== modalUserData.userConfirmEmail) {
        showToast("Error", "Los correos electrónicos no coinciden", "error");
        return false;
    }

    // Validar que el tipo de documento sea válido
    const validDocumentTypes = ["ti", "cc", "ce", "ppt", "pep"];
    if (!validDocumentTypes.includes(modalUserData.userTypeId)) {
        showToast("Error", "Tipo de documento no válido", "error");
        return false;
    }

    if (modalUserData.estado === "deshabilitado") {
        showToast("Error", "Cambia el estado para crear el usuario", "error");
        return false;
    }

    return true;
}

// Función para guardar los valores seleccionados actuales
function saveSelectedValues() {
    return {
        crop: document.getElementById('crop').value,
        cropCycle: document.getElementById('cropCycle').value,
        responsible: document.getElementById('responsible').value,
        sensor: document.getElementById('sensor').value,
        supply: document.getElementById('supply').value
    };
}

// Función para restaurar los valores seleccionados
function restoreSelectedValues(savedValues) {
    if (savedValues) {
        document.getElementById('crop').value = savedValues.crop;
        document.getElementById('cropCycle').value = savedValues.cropCycle;
        document.getElementById('responsible').value = savedValues.responsible;
        document.getElementById('sensor').value = savedValues.sensor;
        document.getElementById('supply').value = savedValues.supply;
    }
}

// Manejar el envío del formulario del modal
createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Guardar valores actuales
    const savedValues = saveSelectedValues();
    
    if (!validateModalUserData()) {
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modalUserData)
        });

        if (!response.ok) {
            throw new Error('Error al crear el usuario');
        }

        const data = await response.json();
        showToast("Éxito", "Usuario creado correctamente", "success");
        
        // Actualizar el select de responsables
        await initializeForm();
        
        // Cerrar el modal
        createUserModal.classList.add('hidden');
        
        // Limpiar el formulario
        createUserForm.reset();
        modalUserData.estado = "habilitado";
        
        // Después de crear el usuario exitosamente, restaurar los valores
        restoreSelectedValues(savedValues);
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Error", "No se pudo crear el usuario", "error");
    }
});

// Event listeners para el modal de sensor
createSensorBtn.addEventListener('click', () => {
    createSensorModal.classList.remove('hidden');
});

closeCreateSensorModal.addEventListener('click', () => {
    createSensorModal.classList.add('hidden');
});

// Event listeners para el formulario del modal de sensor
document.getElementById('modal-tipo-sensor').addEventListener('change', (e) => {
    modalSensorData.sensorType = e.target.value;
});

// Bloquear números en el campo de nombre del sensor
document.getElementById('modal-nombre-sensor').addEventListener('keydown', function (e) {
    if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        console.log("Número bloqueado");
    }
});

document.getElementById('modal-nombre-sensor').addEventListener('input', (e) => {
    modalSensorData.sensorName = e.target.value;
});

document.getElementById('modal-unidad-medida').addEventListener('change', (e) => {
    modalSensorData.sensorUnit = e.target.value;
});

document.getElementById('modal-imagen').addEventListener('change', (e) => {
    modalSensorData.sensorImage = e.target.value;
});

document.getElementById('modal-descripcion').addEventListener('input', (e) => {
    modalSensorData.sensorDescription = e.target.value;
});

document.getElementById('modal-tiempo-escaneo').addEventListener('change', (e) => {
    modalSensorData.sensorScan = e.target.value;
});

document.querySelectorAll('input[name="modal-estado-sensor"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        modalSensorData.estado = e.target.value;
    });
});

// Función para validar los datos del sensor en el modal
function validateModalSensorData() {
    const requiredFields = [
        { field: "sensorType", label: "Tipo de sensor" },
        { field: "sensorName", label: "Nombre del sensor" },
        { field: "sensorUnit", label: "Unidad de medida" },
        { field: "sensorImage", label: "Imagen" },
        { field: "sensorDescription", label: "Descripción" },
        { field: "sensorScan", label: "Tiempo de escaneo" },
        { field: "estado", label: "Estado" }
    ];

    for (const field of requiredFields) {
        if (!modalSensorData[field.field]) {
            showToast(`Por favor, complete el campo ${field.label}`, "", "error");
            return false;
        }
    }

    // Validar que el tipo de sensor sea válido
    const validSensorTypes = [
        "Sensor de contacto",
        "Sensor de distancia",
        "Sensores de luz",
    ];
    if (!validSensorTypes.includes(modalSensorData.sensorType)) {
        showToast("Error", "Tipo de sensor no válido", "error");
        return false;
    }

    // Validar que la unidad de medida sea válida
    const validUnits = ["Temperatura", "Distancia", "Presión"];
    if (!validUnits.includes(modalSensorData.sensorUnit)) {
        showToast("Error", "Unidad de medida no válida", "error");
        return false;
    }

    // Validar que el tiempo de escaneo sea válido
    const validScanTimes = [
        "Sensores lentos",
        "Sensores de velocidad media",
        "Sensores rápidos",
    ];
    if (!validScanTimes.includes(modalSensorData.sensorScan)) {
        showToast("Error", "Tiempo de escaneo no válido", "error");
        return false;
    }

    if (modalSensorData.estado === "deshabilitado") {
        showToast("Error", "Cambia el estado para crear el sensor", "error");
        return false;
    }

    return true;
}

// Manejar el envío del formulario del modal de sensor
createSensorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Guardar valores actuales
    const savedValues = saveSelectedValues();
    
    if (!validateModalSensorData()) {
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/sensor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modalSensorData)
        });

        if (!response.ok) {
            throw new Error('Error al crear el sensor');
        }

        const data = await response.json();
        showToast("Éxito", "Sensor creado correctamente", "success");
        
        // Actualizar el select de sensores
        await initializeForm();
        
        // Cerrar el modal
        createSensorModal.classList.add('hidden');
        
        // Limpiar el formulario
        createSensorForm.reset();
        modalSensorData.estado = "habilitado";
        
        // Después de crear el sensor exitosamente, restaurar los valores
        restoreSelectedValues(savedValues);
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Error", error.message || "No se pudo crear el sensor", "error");
    }
});

// Event listeners para el modal de insumo
createSupplyBtn.addEventListener('click', () => {
    createSupplyModal.classList.remove('hidden');
});

closeCreateSupplyModal.addEventListener('click', () => {
    createSupplyModal.classList.add('hidden');
});

// Bloquear números en el campo de nombre
document.getElementById('modal-nombre-insumo').addEventListener('keydown', function (e) {
    if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        console.log("Número bloqueado");
    }
});

// Solo permitir números en el campo de valor unitario
document.getElementById('modal-valor-unitario').addEventListener('keydown', function (e) {
    if (
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "."
    ) {
        return;
    }
    if (e.key < "0" || e.key > "9") {
        e.preventDefault();
        console.log("Solo se permite números");
    }
});

// Solo permitir números en el campo de cantidad
document.getElementById('modal-cantidad').addEventListener('keydown', function (e) {
    if (
        e.key === "Backspace" ||
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
        return;
    }
    if (e.key < "0" || e.key > "9") {
        e.preventDefault();
        console.log("Solo se permite números");
    }
});

// Event listeners para el formulario del modal de insumo
document.getElementById('modal-nombre-insumo').addEventListener('input', (e) => {
    modalSupplyData.insumeName = e.target.value;
    console.log('Nombre actualizado:', modalSupplyData.insumeName);
});

document.getElementById('modal-tipo-insumo').addEventListener('input', (e) => {
    modalSupplyData.insumeType = e.target.value;
    console.log('Tipo actualizado:', modalSupplyData.insumeType);
});

document.getElementById('modal-imagen-insumo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        modalSupplyData.insumeImage = file.name;
        console.log('Imagen actualizada:', modalSupplyData.insumeImage);
    }
});

document.getElementById('modal-medida-insumo').addEventListener('change', (e) => {
    modalSupplyData.insumeExtent = e.target.value;
    console.log('Unidad de medida actualizada:', modalSupplyData.insumeExtent);
});

document.getElementById('modal-valor-unitario').addEventListener('input', (e) => {
    modalSupplyData.insumePrice = e.target.value;
    console.log('Valor unitario actualizado:', modalSupplyData.insumePrice);
    calculateTotal();
});

document.getElementById('modal-cantidad').addEventListener('input', (e) => {
    modalSupplyData.insumeAmount = e.target.value;
    console.log('Cantidad actualizada:', modalSupplyData.insumeAmount);
    calculateTotal();
});

document.getElementById('modal-descripcion-insumo').addEventListener('input', (e) => {
    modalSupplyData.insumeDescription = e.target.value;
    console.log('Descripción actualizada:', modalSupplyData.insumeDescription);
});

document.querySelectorAll('input[name="modal-estado-insumo"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        modalSupplyData.estado = e.target.value;
        console.log('Estado actualizado:', modalSupplyData.estado);
    });
});

// Función para calcular el valor total
function calculateTotal() {
    const price = parseFloat(modalSupplyData.insumePrice) || 0;
    const amount = parseInt(modalSupplyData.insumeAmount) || 0;
    const total = price * amount;
    modalSupplyData.totalValue = total.toString();
    document.getElementById('modal-valor-total').value = total;
}

// Función para validar los datos del insumo en el modal
function validateModalSupplyData() {
    console.log('Validando datos:', modalSupplyData);
    
    const requiredFields = [
        { field: "insumeName", label: "Nombre" },
        { field: "insumeType", label: "Tipo de insumo" },
        { field: "insumeImage", label: "Imagen" },
        { field: "insumeExtent", label: "Unidad de medida" },
        { field: "insumeDescription", label: "Descripción" },
        { field: "insumePrice", label: "Valor unitario" },
        { field: "insumeAmount", label: "Cantidad" },
        { field: "totalValue", label: "Valor total" },
        { field: "estado", label: "Estado" }
    ];

    for (const field of requiredFields) {
        if (!modalSupplyData[field.field]) {
            console.log(`Campo vacío: ${field.field}`);
            showToast(`Por favor, complete el campo ${field.label}`, "", "error");
            return false;
        }
    }

    // Validar que la unidad de medida sea válida
    const validUnits = ["peso", "volumen", "superficie", "concentración", "litro", "kilo"];
    if (!validUnits.includes(modalSupplyData.insumeExtent)) {
        showToast("Error", "Unidad de medida no válida", "error");
        return false;
    }

    // Validar que los valores numéricos sean válidos
    if (isNaN(parseFloat(modalSupplyData.insumePrice)) || parseFloat(modalSupplyData.insumePrice) <= 0) {
        showToast("Error", "El valor unitario debe ser un número mayor a 0", "error");
        return false;
    }

    if (isNaN(parseInt(modalSupplyData.insumeAmount)) || parseInt(modalSupplyData.insumeAmount) <= 0) {
        showToast("Error", "La cantidad debe ser un número mayor a 0", "error");
        return false;
    }

    if (modalSupplyData.estado === "deshabilitado") {
        showToast("Error", "Cambia el estado para crear el insumo", "error");
        return false;
    }

    return true;
}

// Manejar el envío del formulario del modal de insumo
createSupplyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Guardar valores actuales
    const savedValues = saveSelectedValues();
    
    // Asegurarse de que todos los campos estén actualizados antes de validar
    modalSupplyData.insumeName = document.getElementById('modal-nombre-insumo').value;
    modalSupplyData.insumeType = document.getElementById('modal-tipo-insumo').value;
    modalSupplyData.insumeExtent = document.getElementById('modal-medida-insumo').value;
    modalSupplyData.insumePrice = document.getElementById('modal-valor-unitario').value;
    modalSupplyData.insumeAmount = document.getElementById('modal-cantidad').value;
    modalSupplyData.insumeDescription = document.getElementById('modal-descripcion-insumo').value;
    
    const estadoRadio = document.querySelector('input[name="modal-estado-insumo"]:checked');
    if (estadoRadio) {
        modalSupplyData.estado = estadoRadio.value;
    }

    if (!validateModalSupplyData()) {
        return;
    }

    try {
        // Convertir los valores numéricos a números
        const dataToSend = {
            ...modalSupplyData,
            insumePrice: parseFloat(modalSupplyData.insumePrice),
            insumeAmount: parseInt(modalSupplyData.insumeAmount),
            totalValue: parseFloat(modalSupplyData.totalValue)
        };

        console.log('Datos a enviar:', dataToSend);

        const response = await fetch('http://localhost:5000/insumos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear el insumo');
        }

        const data = await response.json();
        showToast("Éxito", "Insumo creado correctamente", "success");
        
        // Actualizar el select de insumos
        await initializeForm();
        
        // Cerrar el modal
        createSupplyModal.classList.add('hidden');
        
        // Limpiar el formulario
        createSupplyForm.reset();
        modalSupplyData.estado = "habilitado";
        
        // Después de crear el insumo exitosamente, restaurar los valores
        restoreSelectedValues(savedValues);
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Error", error.message || "No se pudo crear el insumo", "error");
    }
});

// Event listeners para el modal de cultivo
createCropBtn.addEventListener('click', () => {
    createCropModal.classList.remove('hidden');
});

closeCreateCropModal.addEventListener('click', () => {
    createCropModal.classList.add('hidden');
});

// Bloquear números en el campo de nombre
document.getElementById('modal-nombre-cultivo').addEventListener('keydown', function (e) {
    if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        console.log("Número bloqueado");
    }
});

// Event listeners para el formulario del modal de cultivo
document.getElementById('modal-nombre-cultivo').addEventListener('input', (e) => {
    modalCropData.cultiveName = e.target.value;
});

document.getElementById('modal-tipo-cultivo').addEventListener('input', (e) => {
    modalCropData.cultiveType = e.target.value;
});

document.getElementById('modal-imagen-cultivo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        modalCropData.cultiveImage = file.name;
    }
});

document.getElementById('modal-ubicacion-cultivo').addEventListener('input', (e) => {
    modalCropData.cultiveLocation = e.target.value;
});

document.getElementById('modal-tamano-cultivo').addEventListener('input', (e) => {
    modalCropData.cultiveSize = e.target.value;
});

document.getElementById('modal-descripcion-cultivo').addEventListener('input', (e) => {
    modalCropData.cultiveDescription = e.target.value;
});

document.querySelectorAll('input[name="modal-estado-cultivo"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        modalCropData.estado = e.target.value;
    });
});

// Función para validar los datos del cultivo en el modal
function validateModalCropData() {
    const requiredFields = [
        { field: "cultiveName", label: "Nombre" },
        { field: "cultiveType", label: "Tipo de cultivo" },
        { field: "cultiveImage", label: "Imagen" },
        { field: "cultiveLocation", label: "Ubicación" },
        { field: "cultiveDescription", label: "Descripción" },
        { field: "cultiveSize", label: "Tamaño" },
        { field: "estado", label: "Estado" }
    ];

    for (const field of requiredFields) {
        if (!modalCropData[field.field]) {
            showToast(`Por favor, complete el campo ${field.label}`, "", "error");
            return false;
        }
    }

    // Validar que el tamaño sea un número válido
    if (isNaN(parseFloat(modalCropData.cultiveSize)) || parseFloat(modalCropData.cultiveSize) <= 0) {
        showToast("Error", "El tamaño debe ser un número mayor a 0", "error");
        return false;
    }

    if (modalCropData.estado === "deshabilitado") {
        showToast("Error", "Cambia el estado para crear el cultivo", "error");
        return false;
    }

    return true;
}

// Manejar el envío del formulario del modal de cultivo
createCropForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Guardar valores actuales
    const savedValues = saveSelectedValues();
    
    if (!validateModalCropData()) {
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/cultivos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modalCropData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear el cultivo');
        }

        const data = await response.json();
        showToast("Éxito", "Cultivo creado correctamente", "success");
        
        // Actualizar el select de cultivos
        await initializeForm();
        
        // Cerrar el modal
        createCropModal.classList.add('hidden');
        
        // Limpiar el formulario
        createCropForm.reset();
        modalCropData.estado = "habilitado";
        
        // Después de crear el cultivo exitosamente, restaurar los valores
        restoreSelectedValues(savedValues);
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Error", error.message || "No se pudo crear el cultivo", "error");
    }
});

// Event listeners para el modal de ciclo de cultivo
createCropCycleBtn.addEventListener('click', () => {
    createCropCycleModal.classList.remove('hidden');
});

closeCreateCropCycleModal.addEventListener('click', () => {
    createCropCycleModal.classList.add('hidden');
});

// Bloquear números en el campo de nombre
document.getElementById('modal-nombre-ciclo').addEventListener('keydown', function (e) {
    if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        console.log("Número bloqueado");
    }
});

// Event listeners para el formulario del modal de ciclo de cultivo
document.getElementById('modal-nombre-ciclo').addEventListener('input', (e) => {
    modalCropCycleData.cycleName = e.target.value;
});

document.getElementById('modal-descripcion-ciclo').addEventListener('input', (e) => {
    modalCropCycleData.cycleDescription = e.target.value;
});

document.getElementById('modal-periodo-inicio').addEventListener('input', (e) => {
    modalCropCycleData.cycleStartDate = e.target.value;
});

document.getElementById('modal-periodo-final').addEventListener('input', (e) => {
    modalCropCycleData.cycleEndDate = e.target.value;
});

document.getElementById('modal-novedades-ciclo').addEventListener('input', (e) => {
    modalCropCycleData.cycleUpdates = e.target.value;
});

document.querySelectorAll('input[name="modal-estado-ciclo"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        modalCropCycleData.estado = e.target.value;
    });
});

// Función para validar los datos del ciclo de cultivo en el modal
function validateModalCropCycleData() {
    const requiredFields = [
        { field: "cycleName", label: "Nombre" },
        { field: "cycleDescription", label: "Descripción" },
        { field: "cycleStartDate", label: "Periodo de inicio" },
        { field: "cycleEndDate", label: "Periodo final" },
        { field: "cycleUpdates", label: "Novedades" },
        { field: "estado", label: "Estado" }
    ];

    for (const field of requiredFields) {
        if (!modalCropCycleData[field.field]) {
            showToast(`Por favor, complete el campo ${field.label}`, "", "error");
            return false;
        }
    }

    // Validar que la fecha de inicio sea anterior a la fecha final
    const startDate = new Date(modalCropCycleData.cycleStartDate);
    const endDate = new Date(modalCropCycleData.cycleEndDate);
    if (startDate >= endDate) {
        showToast("Error", "La fecha de inicio debe ser anterior a la fecha final", "error");
        return false;
    }

    if (modalCropCycleData.estado === "deshabilitado") {
        showToast("Error", "Cambia el estado para crear el ciclo de cultivo", "error");
        return false;
    }

    return true;
}

// Manejar el envío del formulario del modal de ciclo de cultivo
createCropCycleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Guardar valores actuales
    const savedValues = saveSelectedValues();
    
    if (!validateModalCropCycleData()) {
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/ciclo_cultivo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modalCropCycleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear el ciclo de cultivo');
        }

        const data = await response.json();
        showToast("Éxito", "Ciclo de cultivo creado correctamente", "success");
        
        // Actualizar el select de ciclos de cultivo
        await initializeForm();
        
        // Cerrar el modal
        createCropCycleModal.classList.add('hidden');
        
        // Limpiar el formulario
        createCropCycleForm.reset();
        modalCropCycleData.estado = "habilitado";
        
        // Después de crear el ciclo exitosamente, restaurar los valores
        restoreSelectedValues(savedValues);
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Error", error.message || "No se pudo crear el ciclo de cultivo", "error");
    }
});