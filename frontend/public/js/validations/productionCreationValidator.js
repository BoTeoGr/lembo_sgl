// URL base para las peticiones al backend
const API_URL = "http://localhost:5000";

// Objeto para almacenar los datos de la producción
const productionData = {
  id: "",
  nombre: "",
  tipo: "",
  imagen: "",
  ubicacion: "",
  descripcion: "",
  usuario_id: "",
  cantidad: 0,
  estado: "habilitado",
  cultivo_id: "",
  ciclo_id: "",
  insumos_ids: [],
  sensores_ids: [],
  fecha_creacion: "",
};

// Función para asegurar que los datos sean un array
function ensureArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    // Buscar propiedades comunes que podrían contener arrays
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      // Buscar cualquier propiedad que sea un array
      const possibleArrays = Object.values(data).filter((val) =>
        Array.isArray(val)
      );
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      } else {
        // Si no hay arrays, convertir a array si es un objeto único
        return [data];
      }
    }
  }

  // Si no es un objeto o es null/undefined, devolver array vacío
  return [];
}

// Función para generar ID de producción
function generateProductionId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const sequence = "0001"; // El número secuencial debería venir del backend
  return `PROD-${day}${month}${year}-${sequence}`;
}

// Inicialización del formulario
document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  setupEventListeners();
  initializeChart();
});

// Función para inicializar el formulario
async function initializeForm() {
  // Establecer fecha actual por defecto
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").value = today;
  document.getElementById("productionId").value = generateProductionId();

  // Cargar datos iniciales desde el backend
  await loadResponsibles();
  await loadCrops();
  await loadCycles();
  await loadSensors();
  await loadSupplies();
}

// Función para configurar los event listeners
function setupEventListeners() {
  // Validación de campos
  document
    .getElementById("productionName")
    .addEventListener("input", validateProductionName);
  document.getElementById("endDate").addEventListener("change", validateDates);
  document
    .getElementById("sensors")
    .addEventListener("change", validateSensors);

  // Botones de acción
  document.getElementById("saveDraftBtn").addEventListener("click", saveDraft);
  document
    .getElementById("createBtn")
    .addEventListener("click", createProduction);
  document
    .getElementById("addSupplyRowBtn")
    .addEventListener("click", () => openModal("supplyRowModal"));

  // Modales
  setupModalListeners();

  // Formularios de modales
  document
    .getElementById("responsibleForm")
    .addEventListener("submit", saveResponsible);
  document.getElementById("cropForm").addEventListener("submit", saveCrop);
  document.getElementById("cycleForm").addEventListener("submit", saveCycle);
  document.getElementById("sensorForm").addEventListener("submit", saveSensor);
  document.getElementById("supplyForm").addEventListener("submit", saveSupply);
  document
    .getElementById("supplyRowForm")
    .addEventListener("submit", saveSupplyRow);

  // Cálculo de valor total en modal de insumo
  const supplyQuantityInput = document.getElementById("supplyQuantity");
  const supplyUnitValueInput = document.getElementById("supplyUnitValue");
  supplyQuantityInput.addEventListener("input", calculateSupplyTotal);
  supplyUnitValueInput.addEventListener("input", calculateSupplyTotal);

  // Validación del formulario completo
  document
    .getElementById("productionForm")
    .addEventListener("change", validateForm);
}

// Función para inicializar el gráfico de sensores
function initializeChart() {
  const ctx = document.getElementById("sensorChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [
        {
          label: "Temperatura",
          data: [22, 24, 27, 23, 25, 28],
          borderColor: "#39a900",
          backgroundColor: "rgba(57, 169, 0, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Funciones de validación
function validateProductionName() {
  const productionNameInput = document.getElementById("productionName");
  const errorElement = document.getElementById("productionNameError");
  const name = productionNameInput.value.trim();
  const nameRegex = /^(?=.*[a-zA-Z])[a-zA-ZÀ-ÿ\s\-]{3,100}$/;

  if (!nameRegex.test(name)) {
    showError(
      errorElement,
      "El nombre debe tener entre 3 y 100 caracteres y contener al menos una letra"
    );
    return false;
  }

  hideError(errorElement);
  productionData.nombre = name;
  return true;
}

function validateDates() {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const errorElement = document.getElementById("dateError");

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (endDateInput.value && endDate <= startDate) {
    showError(
      errorElement,
      "La fecha de fin debe ser posterior a la fecha de inicio"
    );
    return false;
  }

  hideError(errorElement);
  productionData.startDate = startDateInput.value;
  productionData.endDate = endDateInput.value;
  return true;
}

function validateSensors() {
  const sensorsSelect = document.getElementById("sensors");
  const errorElement = document.getElementById("sensorsError");
  const selectedSensors = Array.from(sensorsSelect.selectedOptions).map(
    (option) => option.value
  );

  if (selectedSensors.length > 3) {
    showError(errorElement, "No se pueden seleccionar más de 3 sensores");
    return false;
  }

  hideError(errorElement);
  productionData.sensores_ids = selectedSensors;
  updateSelectedSensorsDisplay(); // Actualizar la visualización
  return true;
}

// Función para actualizar la visualización de sensores seleccionados
function updateSelectedSensorsDisplay() {
  const sensorsSelect = document.getElementById("sensors");
  const selectedSensorsDisplay = document.getElementById("selectedSensorsDisplay");

  // Obtener los sensores seleccionados
  const selectedSensors = Array.from(sensorsSelect.selectedOptions).map(
    (option) => ({ id: option.value, name: option.textContent })
  );

  // Limpiar la visualización actual
  selectedSensorsDisplay.innerHTML = "";

  // Mostrar los sensores seleccionados con opción de eliminar
  selectedSensors.forEach((sensor) => {
    const sensorItem = document.createElement("div");
    sensorItem.className = "selected-sensor-item";
    sensorItem.textContent = sensor.name;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-sensor-button";
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.addEventListener("click", () => removeSensor(sensor.id));

    sensorItem.appendChild(removeButton);
    selectedSensorsDisplay.appendChild(sensorItem);
  });
}

// Función para eliminar un sensor de la selección
function removeSensor(sensorId) {
  const sensorsSelect = document.getElementById("sensors");

  // Desmarcar el sensor en el select
  Array.from(sensorsSelect.options).forEach((option) => {
    if (option.value === sensorId) {
      option.selected = false;
    }
  });

  // Actualizar la visualización y validar
  validateSensors();
}

function validateForm() {
  const isValid =
    validateProductionName() &&
    validateDates() &&
    validateSensors() &&
    document.getElementById("responsible").value &&
    document.getElementById("crop").value &&
    document.getElementById("cropCycle").value;

  document.getElementById("createBtn").disabled = !isValid;
  return isValid;
}

// Funciones para cargar datos desde el backend
async function loadResponsibles() {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error("Error al cargar responsables");
    }

    let responsibles = await response.json();

    // Asegurarse de que responsibles sea un array
    responsibles = ensureArray(responsibles);
    console.log("Responsables procesados:", responsibles);

    const responsibleSelect = document.getElementById("responsible");
    const supplyResponsibleSelect = document.getElementById(
      "supplyResponsible"
    );

    // Limpiar opciones existentes
    responsibleSelect.innerHTML =
      '<option value="">Seleccionar responsable</option>';
    if (supplyResponsibleSelect) {
      supplyResponsibleSelect.innerHTML =
        '<option value="">Seleccionar responsable</option>';
    }

    // Ahora responsibles es seguramente un array
    responsibles.forEach((responsible) => {
      const option = document.createElement("option");
      option.value = responsible.id;
      option.textContent = responsible.nombre;

      const optionClone = option.cloneNode(true);

      responsibleSelect.appendChild(option);
      if (supplyResponsibleSelect) {
        supplyResponsibleSelect.appendChild(optionClone);
      }
    });
  } catch (error) {
    console.error("Error al cargar responsables:", error);
    showToast("Error", "No se pudieron cargar los responsables", "error");

    // Cargar datos de respaldo en caso de error
    const backupResponsibles = [
      { id: "1", nombre: "Juan Pérez" },
      { id: "2", nombre: "María López" },
      { id: "3", nombre: "Carlos Rodríguez" },
    ];

    const responsibleSelect = document.getElementById("responsible");
    const supplyResponsibleSelect = document.getElementById(
      "supplyResponsible"
    );

    backupResponsibles.forEach((responsible) => {
      const option = document.createElement("option");
      option.value = responsible.id;
      option.textContent = responsible.nombre;

      const optionClone = option.cloneNode(true);

      responsibleSelect.appendChild(option);
      if (supplyResponsibleSelect) {
        supplyResponsibleSelect.appendChild(optionClone);
      }
    });
  }
}

async function loadCrops() {
  try {
    const response = await fetch(`${API_URL}/cultivos`);
    if (!response.ok) {
      throw new Error("Error al cargar cultivos");
    }

    let crops = await response.json();

    // Asegurarse de que crops sea un array
    crops = ensureArray(crops);
    console.log("Cultivos procesados:", crops);

    const cropSelect = document.getElementById("crop");

    // Limpiar opciones existentes
    cropSelect.innerHTML = '<option value="">Seleccionar cultivo</option>';

    crops.forEach((crop) => {
      const option = document.createElement("option");
      option.value = crop.id;
      option.textContent = crop.nombre;
      cropSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar cultivos:", error);
    showToast("Error", "No se pudieron cargar los cultivos", "error");

    // Cargar datos de respaldo en caso de error
    const backupCrops = [
      { id: "1", nombre: "Maíz" },
      { id: "2", nombre: "Frijol" },
      { id: "3", nombre: "Tomate" },
    ];

    const cropSelect = document.getElementById("crop");

    backupCrops.forEach((crop) => {
      const option = document.createElement("option");
      option.value = crop.id;
      option.textContent = crop.nombre;
      cropSelect.appendChild(option);
    });
  }
}

async function loadCycles() {
  try {
    const response = await fetch(`${API_URL}/ciclo_cultivo`);
    if (!response.ok) {
      throw new Error("Error al cargar ciclos");
    }

    let cycles = await response.json();

    // Asegurarse de que cycles sea un array
    cycles = ensureArray(cycles);
    console.log("Ciclos procesados:", cycles);

    const cycleSelect = document.getElementById("cropCycle");

    // Limpiar opciones existentes
    cycleSelect.innerHTML = '<option value="">Seleccionar ciclo</option>';

    cycles.forEach((cycle) => {
      const option = document.createElement("option");
      option.value = cycle.id;
      option.textContent = cycle.nombre;
      cycleSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar ciclos:", error);
    showToast("Error", "No se pudieron cargar los ciclos de cultivo", "error");

    // Cargar datos de respaldo en caso de error
    const backupCycles = [
      { id: "1", nombre: "Primavera-Verano" },
      { id: "2", nombre: "Otoño-Invierno" },
      { id: "3", nombre: "Anual" },
    ];

    const cycleSelect = document.getElementById("cropCycle");

    backupCycles.forEach((cycle) => {
      const option = document.createElement("option");
      option.value = cycle.id;
      option.textContent = cycle.nombre;
      cycleSelect.appendChild(option);
    });
  }
}

async function loadSensors() {
  try {
    const response = await fetch(`${API_URL}/sensor`);
    if (!response.ok) {
      throw new Error("Error al cargar sensores");
    }

    let sensors = await response.json();

    // Asegurarse de que sensors sea un array
    sensors = ensureArray(sensors);
    console.log("Sensores procesados:", sensors);

    const sensorsSelect = document.getElementById("sensors");

    // Limpiar opciones existentes
    sensorsSelect.innerHTML = "";

    sensors.forEach((sensor) => {
      const option = document.createElement("option");
      option.value = sensor.id;
      option.textContent = sensor.nombre_sensor;
      sensorsSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar sensores:", error);
    showToast("Error", "No se pudieron cargar los sensores", "error");

    // Cargar datos de respaldo en caso de error
    const backupSensors = [
      { id: "1", nombre_sensor: "Sensor de humedad" },
      { id: "2", nombre_sensor: "Sensor de temperatura" },
      { id: "3", nombre_sensor: "Sensor de pH" },
      { id: "4", nombre_sensor: "Sensor de luz" },
      { id: "5", nombre_sensor: "Sensor de CO2" },
    ];

    const sensorsSelect = document.getElementById("sensors");

    backupSensors.forEach((sensor) => {
      const option = document.createElement("option");
      option.value = sensor.id;
      option.textContent = sensor.nombre_sensor;
      sensorsSelect.appendChild(option);
    });
  }
}

async function loadSupplies() {
  try {
    const response = await fetch(`${API_URL}/insumos`);
    if (!response.ok) {
      throw new Error("Error al cargar insumos");
    }

    let supplies = await response.json();

    // Asegurarse de que supplies sea un array
    supplies = ensureArray(supplies);
    console.log("Insumos procesados:", supplies);

    const suppliesSelect = document.getElementById("supplies");
    const supplySelect = document.getElementById("supplySelect");

    // Limpiar opciones existentes
    suppliesSelect.innerHTML = "";
    if (supplySelect) {
      supplySelect.innerHTML = '<option value="">Seleccionar insumo</option>';
    }

    supplies.forEach((supply) => {
      const option = document.createElement("option");
      option.value = supply.id;
      option.textContent = supply.nombre;
      option.dataset.price = supply.valor_unitario;

      const optionClone = option.cloneNode(true);

      suppliesSelect.appendChild(option);
      if (supplySelect) {
        supplySelect.appendChild(optionClone);
      }
    });
  } catch (error) {
    console.error("Error al cargar insumos:", error);
    showToast("Error", "No se pudieron cargar los insumos", "error");

    // Cargar datos de respaldo en caso de error
    const backupSupplies = [
      { id: "1", nombre: "Fertilizante NPK", valor_unitario: 45.5 },
      { id: "2", nombre: "Semillas certificadas", valor_unitario: 120.0 },
      { id: "3", nombre: "Insecticida orgánico", valor_unitario: 85.75 },
      { id: "4", nombre: "Fungicida", valor_unitario: 65.3 },
      { id: "5", nombre: "Herbicida", valor_unitario: 78.9 },
    ];

    const suppliesSelect = document.getElementById("supplies");
    const supplySelect = document.getElementById("supplySelect");

    backupSupplies.forEach((supply) => {
      const option = document.createElement("option");
      option.value = supply.id;
      option.textContent = supply.nombre;
      option.dataset.price = supply.valor_unitario;

      const optionClone = option.cloneNode(true);

      suppliesSelect.appendChild(option);
      if (supplySelect) {
        supplySelect.appendChild(optionClone);
      }
    });
  }
}

// Funciones para manejar modales
function setupModalListeners() {
  const modalTriggers = [
    { trigger: "addResponsibleBtn", modal: "responsibleModal" },
    { trigger: "addCropBtn", modal: "cropModal" },
    { trigger: "addCycleBtn", modal: "cycleModal" },
    { trigger: "addSensorBtn", modal: "sensorModal" },
    { trigger: "addSupplyBtn", modal: "supplyModal" },
    { trigger: "addSupplyRowBtn", modal: "supplyRowModal" },
  ];

  modalTriggers.forEach((item) => {
    const btn = document.getElementById(item.trigger);
    const modal = document.getElementById(item.modal);
    const closeBtn = modal.querySelector(".close-modal");

    btn.addEventListener("click", () => {
      openModal(item.modal);
    });

    closeBtn.addEventListener("click", () => {
      closeModal(item.modal);
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(item.modal);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("hidden");

  // Si es el modal de insumo, inicializar la fecha actual
  if (modalId === "supplyRowModal") {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("supplyDate").value = today;

    // Inicializar el valor unitario cuando se selecciona un insumo
    document
      .getElementById("supplySelect")
      .addEventListener("change", function () {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.dataset.price) {
          document.getElementById("supplyUnitValue").value =
            selectedOption.dataset.price;
          calculateSupplyTotal();
        }
      });
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("hidden");

  // Resetear formulario al cerrar
  const form = modal.querySelector("form");
  if (form) {
    form.reset();
  }
}

// Funciones para guardar datos de modales
async function saveResponsible(e) {
  e.preventDefault();

  const nombre = document.getElementById("newResponsibleName").value;
  const correo = document.getElementById("newResponsibleEmail").value;

  // Datos para enviar al backend
  const responsibleData = {
    tipo_documento: "cc", // Valor por defecto
    numero_documento: Date.now().toString(), // Generamos un número único
    nombre,
    telefono: "000-0000", // Valor por defecto
    correo,
    rol: "apoyo", // Valor por defecto
  };

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responsibleData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el responsable");
    }

    const result = await response.json();

    // Agregar el nuevo responsable a los selects
    const responsibleSelect = document.getElementById("responsible");
    const supplyResponsibleSelect =
      document.getElementById("supplyResponsible");

    const option = document.createElement("option");
    option.value = result.id || Date.now().toString();
    option.textContent = nombre;
    option.selected = true;

    const optionClone = option.cloneNode(true);

    responsibleSelect.appendChild(option);
    if (supplyResponsibleSelect) {
      supplyResponsibleSelect.appendChild(optionClone);
    }

    closeModal("responsibleModal");
    showToast(
      "Responsable agregado",
      `${nombre} ha sido agregado como responsable`
    );
  } catch (error) {
    console.error("Error al guardar responsable:", error);
    showToast("Error", "No se pudo guardar el responsable", "error");

    // Simulación en caso de error
    const newId = Date.now().toString();
    const responsibleSelect = document.getElementById("responsible");
    const supplyResponsibleSelect =
      document.getElementById("supplyResponsible");

    const option = document.createElement("option");
    option.value = newId;
    option.textContent = nombre;
    option.selected = true;

    const optionClone = option.cloneNode(true);

    responsibleSelect.appendChild(option);
    if (supplyResponsibleSelect) {
      supplyResponsibleSelect.appendChild(optionClone);
    }

    closeModal("responsibleModal");
    showToast(
      "Responsable agregado (local)",
      `${nombre} ha sido agregado como responsable`,
      "warning"
    );
  }
}

async function saveCrop(e) {
  e.preventDefault();

  const nombre = document.getElementById("newCropName").value;
  const descripcion = document.getElementById("newCropDescription").value;

  // Datos para enviar al backend
  const cropData = {
    nombre,
    tipo: "Otro", // Valor por defecto
    imagen: "default.jpg", // Valor por defecto
    ubicacion: "Sin especificar", // Valor por defecto
    descripcion,
    usuario_id: 1, // Usuario por defecto
    tamano: 100, // Valor por defecto
  };

  try {
    const response = await fetch(`${API_URL}/cultivos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cropData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el cultivo");
    }

    const result = await response.json();

    // Agregar el nuevo cultivo al select
    const cropSelect = document.getElementById("crop");

    const option = document.createElement("option");
    option.value = result.id || Date.now().toString();
    option.textContent = nombre;
    option.selected = true;

    cropSelect.appendChild(option);

    closeModal("cropModal");
    showToast("Cultivo agregado", `${nombre} ha sido agregado como cultivo`);
  } catch (error) {
    console.error("Error al guardar cultivo:", error);
    showToast("Error", "No se pudo guardar el cultivo", "error");

    // Simulación en caso de error
    const newId = Date.now().toString();
    const cropSelect = document.getElementById("crop");

    const option = document.createElement("option");
    option.value = newId;
    option.textContent = nombre;
    option.selected = true;

    cropSelect.appendChild(option);

    closeModal("cropModal");
    showToast(
      "Cultivo agregado (local)",
      `${nombre} ha sido agregado como cultivo`,
      "warning"
    );
  }
}

async function saveCycle(e) {
  e.preventDefault();

  const nombre = document.getElementById("newCycleName").value;
  const duracion = document.getElementById("newCycleDuration").value;

  // Calcular fechas de inicio y fin
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + parseInt(duracion));

  // Datos para enviar al backend
  const cycleData = {
    nombre,
    descripcion: `Ciclo de cultivo con duración de ${duracion} días`,
    periodo_inicio: today.toISOString().split("T")[0],
    periodo_final: endDate.toISOString().split("T")[0],
    novedades: "Ninguna",
    usuario_id: 1, // Usuario por defecto
  };

  try {
    const response = await fetch(`${API_URL}/ciclo_cultivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cycleData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el ciclo");
    }

    const result = await response.json();

    // Agregar el nuevo ciclo al select
    const cycleSelect = document.getElementById("cropCycle");

    const option = document.createElement("option");
    option.value = result.id || Date.now().toString();
    option.textContent = nombre;
    option.selected = true;

    cycleSelect.appendChild(option);

    closeModal("cycleModal");
    showToast(
      "Ciclo agregado",
      `${nombre} ha sido agregado como ciclo de cultivo`
    );
  } catch (error) {
    console.error("Error al guardar ciclo:", error);
    showToast("Error", "No se pudo guardar el ciclo de cultivo", "error");

    // Simulación en caso de error
    const newId = Date.now().toString();
    const cycleSelect = document.getElementById("cropCycle");

    const option = document.createElement("option");
    option.value = newId;
    option.textContent = nombre;
    option.selected = true;

    cycleSelect.appendChild(option);

    closeModal("cycleModal");
    showToast(
      "Ciclo agregado (local)",
      `${nombre} ha sido agregado como ciclo de cultivo`,
      "warning"
    );
  }
}

async function saveSensor(e) {
  e.preventDefault();

  const nombre_sensor = document.getElementById("newSensorName").value;
  const tipo_sensor = document.getElementById("newSensorType").value || "Otro";
  const unidad_medida = document.getElementById("newSensorUnit").value || "N/A";

  // Datos para enviar al backend
  const sensorData = {
    tipo_sensor,
    nombre_sensor,
    unidad_medida,
    imagen: "sensor_default.jpg",
    descripcion: `Sensor de ${tipo_sensor} para medir ${unidad_medida}`,
    tiempo_escaneo: "Sensores de velocidad media",
    usuario_id: 1, // Usuario por defecto
  };

  try {
    const response = await fetch(`${API_URL}/sensor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sensorData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el sensor");
    }

    const result = await response.json();

    // Agregar el nuevo sensor a los selects
    const sensorsSelect = document.getElementById("sensors");

    const option = document.createElement("option");
    option.value = result.id || Date.now().toString();
    option.textContent = nombre_sensor;
    option.selected = true;

    sensorsSelect.appendChild(option);

    closeModal("sensorModal");
    showToast("Sensor agregado", `${nombre_sensor} ha sido agregado como sensor`);

    // Validar sensores después de agregar uno nuevo
    validateSensors();
  } catch (error) {
    console.error("Error al guardar sensor:", error);
    showToast("Error", "No se pudo guardar el sensor", "error");

    // Simulación en caso de error
    const newId = Date.now().toString();
    const sensorsSelect = document.getElementById("sensors");

    const option = document.createElement("option");
    option.value = newId;
    option.textContent = nombre_sensor;
    option.selected = true;

    sensorsSelect.appendChild(option);

    closeModal("sensorModal");
    showToast(
      "Sensor agregado (local)",
      `${nombre_sensor} ha sido agregado como sensor`,
      "warning"
    );

    // Validar sensores después de agregar uno nuevo
    validateSensors();
  }
}

// Función para actualizar la visualización de sensores seleccionados
function updateSelectedSensorsDisplay() {
  const sensorsSelect = document.getElementById("sensors");
  const selectedSensorsDisplay = document.getElementById(
    "selectedSensorsDisplay"
  );

  // Obtener los sensores seleccionados
  const selectedSensors = Array.from(sensorsSelect.selectedOptions).map(
    (option) => option.textContent
  );

  // Limpiar la visualización actual
  selectedSensorsDisplay.innerHTML = "";

  // Mostrar los sensores seleccionados
  selectedSensors.forEach((sensor) => {
    const sensorItem = document.createElement("div");
    sensorItem.className = "selected-sensor-item";
    sensorItem.textContent = sensor;
    selectedSensorsDisplay.appendChild(sensorItem);
  });
}

async function saveSupply(e) {
  e.preventDefault();

  const nombre = document.getElementById("newSupplyName").value;
  const tipo = document.getElementById("newSupplyType").value || "Otro";
  const unidad_medida =
    document.getElementById("newSupplyUnit").value || "kilo";
  const valor_unitario = document.getElementById("newSupplyPrice").value;

  // Datos para enviar al backend
  const supplyData = {
    nombre,
    tipo,
    imagen: "insumo_default.jpg",
    unidad_medida,
    valor_unitario: parseFloat(valor_unitario),
    cantidad: 1, // Valor por defecto
    descripcion: `Insumo de tipo ${tipo}`,
    usuario_id: 1, // Usuario por defecto
  };

  try {
    const response = await fetch(`${API_URL}/insumos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplyData),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el insumo");
    }

    const result = await response.json();

    // Agregar el nuevo insumo a los selects
    const suppliesSelect = document.getElementById("supplies");
    const supplySelect = document.getElementById("supplySelect");

    const option = document.createElement("option");
    option.value = result.id || Date.now().toString();
    option.textContent = nombre;
    option.dataset.price = valor_unitario;
    option.selected = true;

    const optionClone = option.cloneNode(true);

    suppliesSelect.appendChild(option);
    if (supplySelect) {
      supplySelect.appendChild(optionClone);
    }

    closeModal("supplyModal");
    showToast("Insumo agregado", `${nombre} ha sido agregado como insumo`);
  } catch (error) {
    console.error("Error al guardar insumo:", error);
    showToast("Error", "No se pudo guardar el insumo", "error");

    // Simulación en caso de error
    const newId = Date.now().toString();
    const suppliesSelect = document.getElementById("supplies");
    const supplySelect = document.getElementById("supplySelect");

    const option = document.createElement("option");
    option.value = newId;
    option.textContent = nombre;
    option.dataset.price = valor_unitario;
    option.selected = true;

    const optionClone = option.cloneNode(true);

    suppliesSelect.appendChild(option);
    if (supplySelect) {
      supplySelect.appendChild(optionClone);
    }

    closeModal("supplyModal");
    showToast(
      "Insumo agregado (local)",
      `${nombre} ha sido agregado como insumo`,
      "warning"
    );
  }
}

function saveSupplyRow(e) {
  e.preventDefault();

  const supplyId = document.getElementById("supplySelect").value;
  const supplyName =
    document.getElementById("supplySelect").options[
      document.getElementById("supplySelect").selectedIndex
    ].text;
  const date = document.getElementById("supplyDate").value;
  const quantity = document.getElementById("supplyQuantity").value;
  const responsibleId = document.getElementById("supplyResponsible").value;
  const responsibleName =
    document.getElementById("supplyResponsible").options[
      document.getElementById("supplyResponsible").selectedIndex
    ].text;
  const unitValue = document.getElementById("supplyUnitValue").value;
  const totalValue = document.getElementById("supplyTotalValue").value;
  const observations = document.getElementById("supplyObservations").value;

  // Agregar a la lista de insumos de la producción
  if (!productionData.insumos_ids.includes(supplyId)) {
    productionData.insumos_ids.push(supplyId);
  }

  // Agregar fila a la tabla
  addSupplyRowToTable(
    supplyName,
    date,
    quantity,
    responsibleName,
    unitValue,
    totalValue
  );

  closeModal("supplyRowModal");
  showToast("Insumo agregado", `Se ha registrado el uso de ${supplyName}`);

  // Actualizar totales
  updateTotals();
}

// Función para calcular el valor total en el modal de insumo
function calculateSupplyTotal() {
  const quantity =
    parseFloat(document.getElementById("supplyQuantity").value) || 0;
  const unitValue =
    parseFloat(document.getElementById("supplyUnitValue").value) || 0;
  const total = quantity * unitValue;
  document.getElementById("supplyTotalValue").value = total.toFixed(2);
}

// Función para agregar fila a la tabla de insumos
function addSupplyRowToTable(
  supplyName,
  date,
  quantity,
  responsible,
  unitValue,
  totalValue
) {
  const suppliesTableBody = document.getElementById("suppliesTableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
        <td class="production-supplies__cell">${supplyName}</td>
        <td class="production-supplies__cell">${formatDate(date)}</td>
        <td class="production-supplies__cell">${quantity}</td>
        <td class="production-supplies__cell">${responsible}</td>
        <td class="production-supplies__cell">$${parseFloat(unitValue).toFixed(
          2
        )}</td>
        <td class="production-supplies__cell">$${parseFloat(totalValue).toFixed(
          2
        )}</td>
        <td class="production-supplies__cell">
            <button type="button" class="supplies-table__action">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

  // Agregar evento para eliminar fila
  row
    .querySelector(".supplies-table__action")
    .addEventListener("click", function () {
      row.remove();
      updateTotals();
    });

  suppliesTableBody.appendChild(row);
}

// Función para actualizar totales de inversión y meta
function updateTotals() {
  let totalInvestment = 0;

  // Sumar todos los valores totales de la tabla
  document.querySelectorAll("#suppliesTableBody tr").forEach((row) => {
    const totalCell = row.cells[5].textContent;
    totalInvestment += parseFloat(totalCell.replace("$", "")) || 0;
  });

  // Actualizar campo de inversión
  document.getElementById("investment").value = `$${totalInvestment.toFixed(
    2
  )}`;

  // Calcular meta de ganancias (ejemplo: 30% sobre la inversión)
  const profitGoal = totalInvestment * 1.3;
  document.getElementById("goal").value = `$${profitGoal.toFixed(2)}`;

  // Actualizar objeto de datos
  productionData.totalInvestment = totalInvestment;
  productionData.profitGoal = profitGoal;
}

// Funciones para guardar y crear producción
async function saveDraft() {
  // Recopilar todos los datos del formulario
  collectFormData();

  // Guardar en localStorage para recuperar después
  localStorage.setItem("productionDraft", JSON.stringify(productionData));

  showToast("Borrador guardado", "El borrador se ha guardado correctamente");
}

async function createProduction(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast(
      "Error",
      "Por favor complete todos los campos requeridos",
      "error"
    );
    return;
  }

  // Recopilar todos los datos del formulario
  collectFormData();

  // Preparar datos para enviar al backend
  const produccionData = {
    nombre: productionData.nombre,
    tipo: document.getElementById("crop").options[
      document.getElementById("crop").selectedIndex
    ].text,
    imagen: "produccion_default.jpg",
    ubicacion: "Ubicación por defecto",
    descripcion: "Producción creada desde el formulario",
    usuario_id: productionData.usuario_id || 1,
    cantidad: productionData.totalInvestment || 0,
    estado: "habilitado",
    cultivo_id: productionData.crop,
    ciclo_id: productionData.cycle,
    insumos_ids: productionData.insumos_ids.join(","),
    sensores_ids: productionData.sensores_ids.join(","),
    fecha_creacion: productionData.fecha_creacion,
  };

  try {
    const response = await fetch(`${API_URL}/producciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produccionData),
    });

    if (!response.ok) {
      throw new Error("Error al crear la producción");
    }

    const result = await response.json();

    showToast("Producción creada", "La producción se ha creado correctamente");

    // Limpiar el borrador guardado
    localStorage.removeItem("productionDraft");

    // Redireccionar después de crear
    setTimeout(() => {
      window.location.href = "/producciones.html";
    }, 2000);
  } catch (error) {
    console.error("Error al crear producción:", error);
    showToast(
      "Error",
      "No se pudo crear la producción. Se guardará localmente",
      "error"
    );

    // Guardar como borrador en caso de error
    saveDraft();
  }
}

// Función para recopilar todos los datos del formulario
function collectFormData() {
  productionData.id = document.getElementById("productionId").value;
  productionData.nombre = document.getElementById("productionName").value;
  productionData.usuario_id = document.getElementById("responsible").value;
  productionData.crop = document.getElementById("crop").value;
  productionData.cycle = document.getElementById("cropCycle").value;
  productionData.sensores_ids = Array.from(
    document.getElementById("sensors").selectedOptions
  ).map((option) => option.value);

  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (startDate) {
    productionData.fecha_creacion = startDate;
  }

  if (!Array.isArray(productionData.insumos_ids)) {
    productionData.insumos_ids = [];
  }

  document.querySelectorAll("#suppliesTableBody tr").forEach((row) => {
    const supplyName = row.cells[0].textContent;
    const supplyOption = Array.from(
      document.getElementById("supplies").options
    ).find((option) => option.textContent === supplyName);

    if (
      supplyOption &&
      !productionData.insumos_ids.includes(supplyOption.value)
    ) {
      productionData.insumos_ids.push(supplyOption.value);
    }
  });
}

// Funciones auxiliares
function showError(element, message) {
  element.textContent = message;
  element.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  element.classList.remove("hidden");
}

function hideError(element) {
  element.textContent = "";
  element.classList.add("hidden");
}

function showToast(title, message, type = "success") {
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastDescription = document.getElementById("toastDescription");
  const toastIcon = document.getElementById("toastIcon");

  toastTitle.textContent = title;
  toastDescription.textContent = message;

  // Configurar icono según el tipo
  if (type === "success") {
    toastIcon.className = "fas fa-check-circle";
    toast.style.borderLeftColor = "var(--green-700)";
  } else if (type === "error") {
    toastIcon.className = "fas fa-exclamation-circle";
    toast.style.borderLeftColor = "var(--error)";
  } else if (type === "warning") {
    toastIcon.className = "fas fa-exclamation-triangle";
    toast.style.borderLeftColor = "var(--warning)";
  } else if (type === "info") {
    toastIcon.className = "fas fa-info-circle";
    toast.style.borderLeftColor = "var(--secondary-blue)";
  }

  toast.classList.remove("hidden");

  // Ocultar toast después de 3 segundos
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}