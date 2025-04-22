// Objeto para almacenar los datos de la producción
const productionData = {
  id: "",
  name: "",
  responsible: "",
  crop: "",
  cycle: "",
  sensors: [],
  supplies: [],
  totalInvestment: 0,
  profitGoal: 0,
  startDate: "",
  endDate: "",
};

// Función para generar ID de producción
function generateProductionId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // El número secuencial debería venir del backend
  const sequence = "0001";
  return `PROD-${day}${month}${year}-${sequence}`;
}

// Inicialización del formulario
document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  setupEventListeners();
  initializeChart();
});

// Función para inicializar el formulario
function initializeForm() {
  // Establecer fecha actual por defecto
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").value = today;
  document.getElementById("productionId").value = generateProductionId();

  // Cargar datos iniciales desde el backend
  loadResponsibles();
  loadCrops();
  loadCycles();
  loadSensors();
  loadSupplies();
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
  productionData.name = name;
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
  productionData.sensors = selectedSensors;
  return true;
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
function loadResponsibles() {
  // Simulación de carga desde el backend
  const responsibles = [
    { id: "1", name: "Juan Pérez" },
    { id: "2", name: "María López" },
    { id: "3", name: "Carlos Rodríguez" },
  ];

  const responsibleSelect = document.getElementById("responsible");
  const supplyResponsibleSelect = document.getElementById("supplyResponsible");

  responsibles.forEach((responsible) => {
    const option = document.createElement("option");
    option.value = responsible.id;
    option.textContent = responsible.name;

    const optionClone = option.cloneNode(true);

    responsibleSelect.appendChild(option);
    if (supplyResponsibleSelect) {
      supplyResponsibleSelect.appendChild(optionClone);
    }
  });
}

function loadCrops() {
  // Simulación de carga desde el backend
  const crops = [
    { id: "1", name: "Maíz" },
    { id: "2", name: "Frijol" },
    { id: "3", name: "Tomate" },
  ];

  const cropSelect = document.getElementById("crop");

  crops.forEach((crop) => {
    const option = document.createElement("option");
    option.value = crop.id;
    option.textContent = crop.name;
    cropSelect.appendChild(option);
  });
}

function loadCycles() {
  // Simulación de carga desde el backend
  const cycles = [
    { id: "1", name: "Primavera-Verano" },
    { id: "2", name: "Otoño-Invierno" },
    { id: "3", name: "Anual" },
  ];

  const cycleSelect = document.getElementById("cropCycle");

  cycles.forEach((cycle) => {
    const option = document.createElement("option");
    option.value = cycle.id;
    option.textContent = cycle.name;
    cycleSelect.appendChild(option);
  });
}

function loadSensors() {
  // Simulación de carga desde el backend
  const sensors = [
    { id: "1", name: "Sensor de humedad" },
    { id: "2", name: "Sensor de temperatura" },
    { id: "3", name: "Sensor de pH" },
    { id: "4", name: "Sensor de luz" },
    { id: "5", name: "Sensor de CO2" },
  ];

  const sensorsSelect = document.getElementById("sensors");

  sensors.forEach((sensor) => {
    const option = document.createElement("option");
    option.value = sensor.id;
    option.textContent = sensor.name;
    sensorsSelect.appendChild(option);
  });
}

function loadSupplies() {
  // Simulación de carga desde el backend
  const supplies = [
    { id: "1", name: "Fertilizante NPK", price: 45.5 },
    { id: "2", name: "Semillas certificadas", price: 120.0 },
    { id: "3", name: "Insecticida orgánico", price: 85.75 },
    { id: "4", name: "Fungicida", price: 65.3 },
    { id: "5", name: "Herbicida", price: 78.9 },
  ];

  const suppliesSelect = document.getElementById("supplies");
  const supplySelect = document.getElementById("supplySelect");

  supplies.forEach((supply) => {
    const option = document.createElement("option");
    option.value = supply.id;
    option.textContent = supply.name;
    option.dataset.price = supply.price;

    const optionClone = option.cloneNode(true);

    suppliesSelect.appendChild(option);
    if (supplySelect) {
      supplySelect.appendChild(optionClone);
    }
  });
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
function saveResponsible(e) {
  e.preventDefault();

  const name = document.getElementById("newResponsibleName").value;
  const email = document.getElementById("newResponsibleEmail").value;

  // Aquí se enviaría al backend
  console.log("Guardando responsable:", { name, email });

  // Simulación de respuesta del backend
  const newId = Date.now().toString();
  const responsibleSelect = document.getElementById("responsible");
  const supplyResponsibleSelect = document.getElementById("supplyResponsible");

  const option = document.createElement("option");
  option.value = newId;
  option.textContent = name;
  option.selected = true;

  const optionClone = option.cloneNode(true);

  responsibleSelect.appendChild(option);
  if (supplyResponsibleSelect) {
    supplyResponsibleSelect.appendChild(optionClone);
  }

  closeModal("responsibleModal");
  showToast(
    "Responsable agregado",
    `${name} ha sido agregado como responsable`
  );
}

function saveCrop(e) {
  e.preventDefault();

  const name = document.getElementById("newCropName").value;
  const description = document.getElementById("newCropDescription").value;

  // Aquí se enviaría al backend
  console.log("Guardando cultivo:", { name, description });

  // Simulación de respuesta del backend
  const newId = Date.now().toString();
  const cropSelect = document.getElementById("crop");

  const option = document.createElement("option");
  option.value = newId;
  option.textContent = name;
  option.selected = true;

  cropSelect.appendChild(option);

  closeModal("cropModal");
  showToast("Cultivo agregado", `${name} ha sido agregado como cultivo`);
}

function saveCycle(e) {
  e.preventDefault();

  const name = document.getElementById("newCycleName").value;
  const duration = document.getElementById("newCycleDuration").value;

  // Aquí se enviaría al backend
  console.log("Guardando ciclo:", { name, duration });

  // Simulación de respuesta del backend
  const newId = Date.now().toString();
  const cycleSelect = document.getElementById("cropCycle");

  const option = document.createElement("option");
  option.value = newId;
  option.textContent = name;
  option.selected = true;

  cycleSelect.appendChild(option);

  closeModal("cycleModal");
  showToast("Ciclo agregado", `${name} ha sido agregado como ciclo de cultivo`);
}

function saveSensor(e) {
  e.preventDefault();

  const name = document.getElementById("newSensorName").value;
  const type = document.getElementById("newSensorType").value;
  const unit = document.getElementById("newSensorUnit").value;

  // Aquí se enviaría al backend
  console.log("Guardando sensor:", { name, type, unit });

  // Simulación de respuesta del backend
  const newId = Date.now().toString();
  const sensorsSelect = document.getElementById("sensors");

  const option = document.createElement("option");
  option.value = newId;
  option.textContent = name;
  option.selected = true;

  sensorsSelect.appendChild(option);

  closeModal("sensorModal");
  showToast("Sensor agregado", `${name} ha sido agregado como sensor`);

  // Validar sensores después de agregar uno nuevo
  validateSensors();
}

function saveSupply(e) {
  e.preventDefault();

  const name = document.getElementById("newSupplyName").value;
  const type = document.getElementById("newSupplyType").value;
  const unit = document.getElementById("newSupplyUnit").value;
  const price = document.getElementById("newSupplyPrice").value;

  // Aquí se enviaría al backend
  console.log("Guardando insumo:", { name, type, unit, price });

  // Simulación de respuesta del backend
  const newId = Date.now().toString();
  const suppliesSelect = document.getElementById("supplies");
  const supplySelect = document.getElementById("supplySelect");

  const option = document.createElement("option");
  option.value = newId;
  option.textContent = name;
  option.dataset.price = price;
  option.selected = true;

  const optionClone = option.cloneNode(true);

  suppliesSelect.appendChild(option);
  if (supplySelect) {
    supplySelect.appendChild(optionClone);
  }

  closeModal("supplyModal");
  showToast("Insumo agregado", `${name} ha sido agregado como insumo`);
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

  // Aquí se enviaría al backend
  console.log("Guardando uso de insumo:", {
    supplyId,
    date,
    quantity,
    responsibleId,
    unitValue,
    totalValue,
    observations,
  });

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
function saveDraft() {
  // Recopilar todos los datos del formulario
  collectFormData();

  // Aquí se enviaría al backend como borrador
  console.log("Guardando borrador:", productionData);

  showToast("Borrador guardado", "El borrador se ha guardado correctamente");
}

function createProduction(e) {
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

  // Aquí se enviaría al backend para crear la producción
  console.log("Creando producción:", productionData);

  showToast("Producción creada", "La producción se ha creado correctamente");

  // Simular redirección después de crear
  setTimeout(() => {
    alert(
      "Producción creada con éxito. Redirigiendo a la lista de producciones..."
    );
  }, 2000);
}

// Función para recopilar todos los datos del formulario
function collectFormData() {
  productionData.id = document.getElementById("productionId").value;
  productionData.name = document.getElementById("productionName").value;
  productionData.responsible = document.getElementById("responsible").value;
  productionData.crop = document.getElementById("crop").value;
  productionData.cycle = document.getElementById("cropCycle").value;
  productionData.sensors = Array.from(
    document.getElementById("sensors").selectedOptions
  ).map((option) => option.value);
  productionData.startDate = document.getElementById("startDate").value;
  productionData.endDate = document.getElementById("endDate").value;

  // Los insumos y totales ya se actualizan en tiempo real
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
