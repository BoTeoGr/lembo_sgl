// Datos de sensores disponibles
const sensoresDisponibles = [
  {
    id: "sd-001",
    nombre: "Sensor de Temperatura DHT22",
    tipo: "temperatura",
    ubicacion: "Parcela 1",
    modelo: "DHT22",
    fabricante: "Aosong",
    descripcion: "Sensor digital de temperatura y humedad de alta precisión",
    icono: "thermometer-half",
    iconoColor: "#ef4444",
    unidadMedida: "°C",
  },
  {
    id: "sd-002",
    nombre: "Sensor de Humedad del Suelo",
    tipo: "humedad",
    ubicacion: "Parcela 1",
    modelo: "FC-28",
    fabricante: "Generic",
    descripcion: "Sensor de humedad del suelo con sonda resistiva",
    icono: "tint",
    iconoColor: "#3b82f6",
    unidadMedida: "%",
  },
  {
    id: "sd-003",
    nombre: "Sensor de Humedad Ambiental",
    tipo: "humedad",
    ubicacion: "Parcela 1",
    modelo: "AM2302",
    fabricante: "Aosong",
    descripcion: "Sensor de humedad relativa del aire",
    icono: "tint",
    iconoColor: "#3b82f6",
    unidadMedida: "%",
  },
  {
    id: "sd-004",
    nombre: "Anemómetro",
    tipo: "viento",
    ubicacion: "Parcela 1",
    modelo: "WS-3000",
    fabricante: "WeatherTech",
    descripcion: "Sensor para medir la velocidad del viento",
    icono: "wind",
    iconoColor: "#8b5cf6",
    unidadMedida: "km/h",
  },
  {
    id: "sd-005",
    nombre: "Sensor de CO2",
    tipo: "aire",
    ubicacion: "Parcela 1",
    modelo: "MG-811",
    fabricante: "Winsen",
    descripcion: "Sensor para medir la concentración de CO2 en el aire",
    icono: "gauge",
    iconoColor: "#14b8a6",
    unidadMedida: "ppm",
  },
  {
    id: "sd-006",
    nombre: "Sensor de Temperatura del Suelo",
    tipo: "temperatura",
    ubicacion: "Parcela 1",
    modelo: "DS18B20",
    fabricante: "Maxim",
    descripcion: "Sonda de temperatura digital impermeable para suelo",
    icono: "thermometer-half",
    iconoColor: "#ef4444",
    unidadMedida: "°C",
  },
  {
    id: "sd-007",
    nombre: "Sensor de Radiación Solar",
    tipo: "luz",
    ubicacion: "Parcela 1",
    modelo: "BH1750",
    fabricante: "ROHM",
    descripcion: "Sensor de luz ambiental digital",
    icono: "sun",
    iconoColor: "#f59e0b",
    unidadMedida: "lux",
  },
  {
    id: "sd-008",
    nombre: "Sensor de pH del Suelo",
    tipo: "quimico",
    ubicacion: "Parcela 1",
    modelo: "PH-4502C",
    fabricante: "DFRobot",
    descripcion: "Sensor para medir el pH del suelo",
    icono: "tint",
    iconoColor: "#10b981",
    unidadMedida: "pH",
  },
  {
    id: "sd-009",
    nombre: "Sensor de Humedad del Suelo",
    tipo: "humedad",
    ubicacion: "Parcela 1",
    modelo: "YL-69",
    fabricante: "Generic",
    descripcion: "Sensor de humedad del suelo",
    icono: "tint",
    iconoColor: "#3b82f6",
    unidadMedida: "%",
  },
]

// Datos de insumos disponibles
const insumosDisponibles = [
  {
    id: "id-001",
    nombre: "Fertilizante NPK 20-20-20",
    tipo: "fertilizante",
    marca: "GrowPlus",
    presentacion: "Granulado",
    descripcion: "Fertilizante completo con balance de nitrógeno, fósforo y potasio para crecimiento equilibrado",
    icono: "leaf",
    iconoColor: "#22c55e",
    unidad: "kg",
  },
  {
    id: "id-002",
    nombre: "Fertilizante Foliar",
    tipo: "fertilizante",
    marca: "LeafBoost",
    presentacion: "Líquido",
    descripcion: "Fertilizante de aplicación foliar con micronutrientes para corregir deficiencias",
    icono: "leaf",
    iconoColor: "#22c55e",
    unidad: "L",
  },
  {
    id: "id-003",
    nombre: "Insecticida Orgánico",
    tipo: "pesticida",
    marca: "BioProtect",
    presentacion: "Líquido",
    descripcion: "Insecticida a base de extractos naturales para control de plagas",
    icono: "bolt",
    iconoColor: "#f59e0b",
    unidad: "L",
  },
  {
    id: "id-004",
    nombre: "Fungicida Sistémico",
    tipo: "pesticida",
    marca: "FungiStop",
    presentacion: "Polvo mojable",
    descripcion: "Fungicida para prevención y control de enfermedades fúngicas",
    icono: "bolt",
    iconoColor: "#f59e0b",
    unidad: "kg",
  },
  {
    id: "id-005",
    nombre: "Regulador de pH",
    tipo: "agua",
    marca: "pHBalance",
    presentacion: "Líquido",
    descripcion: "Solución para ajustar el pH del agua de riego",
    icono: "tint",
    iconoColor: "#3b82f6",
    unidad: "L",
  },
  {
    id: "id-006",
    nombre: "Bioestimulante Radicular",
    tipo: "bioestimulante",
    marca: "RootPro",
    presentacion: "Líquido",
    descripcion: "Estimulante para el desarrollo de raíces y mejora de absorción de nutrientes",
    icono: "seedling",
    iconoColor: "#10b981",
    unidad: "L",
  },
  {
    id: "id-007",
    nombre: "Quelato de Hierro",
    tipo: "micronutriente",
    marca: "IronFix",
    presentacion: "Granulado",
    descripcion: "Corrector de carencias de hierro en cultivos",
    icono: "flask",
    iconoColor: "#8b5cf6",
    unidad: "kg",
  },
  {
    id: "id-008",
    nombre: "Inhibidor de Etileno",
    tipo: "regulador",
    marca: "FreshKeep",
    presentacion: "Tabletas",
    descripcion: "Prolonga la vida post-cosecha de frutas y hortalizas",
    icono: "snowflake",
    iconoColor: "#0ea5e9",
    unidad: "unidades",
  },
]

// Datos iniciales de sensores integrados
let sensoresIntegrados = [
  {
    id: "sen-1",
    nombre: "Sensor de Temperatura DHT22",
    tipo: "temperatura",
    tipoIntegracion: "sensor",
    modelo: "DHT22",
    fabricante: "Aosong",
    ubicacion: "Centro del cultivo",
    intervalo: "15",
    unidadMedida: "°C",
    fechaCreacion: "05/01/2023",
    estado: "activo",
    sensorId: "sd-001",
    icono: "thermometer-half",
    iconoColor: "#ef4444",
  },
  {
    id: "sen-2",
    nombre: "Sensor de Humedad del Suelo",
    tipo: "humedad",
    tipoIntegracion: "sensor",
    modelo: "FC-28",
    fabricante: "Generic",
    ubicacion: "Suelo - sector norte",
    intervalo: "30",
    unidadMedida: "%",
    fechaCreacion: "10/01/2023",
    estado: "activo",
    sensorId: "sd-002",
    icono: "tint",
    iconoColor: "#3b82f6",
  },
  {
    id: "sen-3",
    nombre: "Anemómetro",
    tipo: "viento",
    tipoIntegracion: "sensor",
    modelo: "WS-3000",
    fabricante: "WeatherTech",
    ubicacion: "Perímetro",
    intervalo: "60",
    unidadMedida: "km/h",
    fechaCreacion: "15/01/2023",
    estado: "inactivo",
    sensorId: "sd-004",
    icono: "wind",
    iconoColor: "#8b5cf6",
  },
]

// Datos iniciales de insumos integrados
let insumosIntegrados = [
  {
    id: "ins-1",
    nombre: "Fertilizante NPK 20-20-20",
    tipo: "fertilizante",
    tipoIntegracion: "insumo",
    modelo: "GrowPlus",
    presentacion: "Granulado",
    unidad: "kg",
    ultimoUso: "12/03/2023",
    fechaCreacion: "01/01/2023",
    estado: "activo",
    insumoId: "id-001",
    icono: "leaf",
    iconoColor: "#22c55e",
  },
  {
    id: "ins-2",
    nombre: "Insecticida Orgánico",
    tipo: "pesticida",
    tipoIntegracion: "insumo",
    modelo: "BioProtect",
    presentacion: "Líquido",
    unidad: "L",
    ultimoUso: "05/03/2023",
    fechaCreacion: "15/01/2023",
    estado: "activo",
    insumoId: "id-003",
    icono: "bolt",
    iconoColor: "#f59e0b",
  },
  {
    id: "ins-3",
    nombre: "Regulador de pH",
    tipo: "agua",
    tipoIntegracion: "insumo",
    modelo: "pHBalance",
    presentacion: "Líquido",
    unidad: "L",
    ultimoUso: "10/03/2023",
    fechaCreacion: "20/01/2023",
    estado: "activo",
    insumoId: "id-005",
    icono: "tint",
    iconoColor: "#3b82f6",
  },
]

// Datos de lecturas de sensores
const lecturasSensores = [
  {
    nombre: "Temperatura",
    tipo: "temperatura",
    valor: "24.5",
    unidad: "°C",
    actualizado: "Hace 5 min",
    icono: "thermometer-half",
    iconoColor: "#ef4444",
  },
  {
    nombre: "Humedad del suelo",
    tipo: "humedad",
    valor: "65",
    unidad: "%",
    actualizado: "Hace 10 min",
    icono: "tint",
    iconoColor: "#3b82f6",
  },
  {
    nombre: "Velocidad del viento",
    tipo: "viento",
    valor: "12",
    unidad: "km/h",
    actualizado: "Hace 15 min",
    icono: "wind",
    iconoColor: "#8b5cf6",
  },
  {
    nombre: "Temperatura del suelo",
    tipo: "temperatura",
    valor: "22.1",
    unidad: "°C",
    actualizado: "Hace 20 min",
    icono: "thermometer-half",
    iconoColor: "#ef4444",
  },
  {
    nombre: "Nivel de CO2",
    tipo: "aire",
    valor: "410",
    unidad: "ppm",
    actualizado: "Hace 30 min",
    icono: "gauge",
    iconoColor: "#14b8a6",
  },
]

// Datos de ciclos de cultivo disponibles
const ciclosDisponibles = [
  {
    id: "ciclo-001",
    nombre: "Ciclo Tomate Roma - Primavera",
    tipo: "tomate",
    variedad: "Roma",
    duracionDias: 120,
    descripcion: "Ciclo de cultivo para tomate Roma en temporada de primavera",
    fechaInicio: "01/03/2023",
    fechaFinEstimada: "30/06/2023",
    faseInicial: "Crecimiento", // Fase inicial predeterminada
    progresoInicial: 35, // Progreso inicial predeterminado (porcentaje)
    fases: [
      { nombre: "Siembra", duracionDias: 15 },
      { nombre: "Crecimiento", duracionDias: 30 },
      { nombre: "Floración", duracionDias: 25 },
      { nombre: "Fructificación", duracionDias: 35 },
      { nombre: "Cosecha", duracionDias: 15 },
    ],
    icono: "seedling",
    iconoColor: "#22c55e",
  },
  {
    id: "ciclo-002",
    nombre: "Ciclo Tomate Roma - Verano",
    tipo: "tomate",
    variedad: "Roma",
    duracionDias: 110,
    descripcion: "Ciclo de cultivo para tomate Roma en temporada de verano con mayor temperatura",
    fechaInicio: "01/06/2023",
    fechaFinEstimada: "20/09/2023",
    faseInicial: "Floración", // Fase inicial predeterminada
    progresoInicial: 50, // Progreso inicial predeterminado (porcentaje)
    fases: [
      { nombre: "Siembra", duracionDias: 12 },
      { nombre: "Crecimiento", duracionDias: 28 },
      { nombre: "Floración", duracionDias: 20 },
      { nombre: "Fructificación", duracionDias: 35 },
      { nombre: "Cosecha", duracionDias: 15 },
    ],
    icono: "sun",
    iconoColor: "#f59e0b",
  },
  {
    id: "ciclo-003",
    nombre: "Ciclo Tomate Roma - Otoño",
    tipo: "tomate",
    variedad: "Roma",
    duracionDias: 130,
    descripcion: "Ciclo de cultivo para tomate Roma en temporada de otoño",
    fechaInicio: "01/09/2023",
    fechaFinEstimada: "10/01/2024",
    faseInicial: "Fructificación", // Fase inicial predeterminada
    progresoInicial: 75, // Progreso inicial predeterminado (porcentaje)
    fases: [
      { nombre: "Siembra", duracionDias: 15 },
      { nombre: "Crecimiento", duracionDias: 35 },
      { nombre: "Floración", duracionDias: 25 },
      { nombre: "Fructificación", duracionDias: 40 },
      { nombre: "Cosecha", duracionDias: 15 },
    ],
    icono: "leaf",
    iconoColor: "#d97706",
  },
  {
    id: "ciclo-004",
    nombre: "Ciclo Tomate Cherry",
    tipo: "tomate",
    variedad: "Cherry",
    duracionDias: 100,
    descripcion: "Ciclo de cultivo para tomate Cherry, más corto que el Roma",
    fechaInicio: "15/04/2023",
    fechaFinEstimada: "25/07/2023",
    faseInicial: "Crecimiento", // Fase inicial predeterminada
    progresoInicial: 32, // Progreso inicial predeterminado (porcentaje)
    fases: [
      { nombre: "Siembra", duracionDias: 10 },
      { nombre: "Crecimiento", duracionDias: 25 },
      { nombre: "Floración", duracionDias: 20 },
      { nombre: "Fructificación", duracionDias: 30 },
      { nombre: "Cosecha", duracionDias: 15 },
    ],
    icono: "seedling",
    iconoColor: "#10b981",
  },
  {
    id: "ciclo-005",
    nombre: "Ciclo Tomate Pera",
    tipo: "tomate",
    variedad: "Pera",
    duracionDias: 115,
    descripcion: "Ciclo de cultivo para tomate tipo Pera",
    fechaInicio: "01/05/2023",
    fechaFinEstimada: "25/08/2023",
    faseInicial: "Floración", // Fase inicial predeterminada
    progresoInicial: 55, // Progreso inicial predeterminado (porcentaje)
    fases: [
      { nombre: "Siembra", duracionDias: 12 },
      { nombre: "Crecimiento", duracionDias: 28 },
      { nombre: "Floración", duracionDias: 22 },
      { nombre: "Fructificación", duracionDias: 38 },
      { nombre: "Cosecha", duracionDias: 15 },
    ],
    icono: "seedling",
    iconoColor: "#059669",
  },
]

// Modificar la variable cicloCultivo para incluir el ID del ciclo actual
const cicloCultivo = {
  id: "ciclo-001", // ID del ciclo actual
  fechaSiembra: "15/01/2023",
  diasTranscurridos: 75,
  faseActual: "Crecimiento",
  progresoFase: 35, // porcentaje
  fechaCosechaEstimada: "30/05/2023",
  fases: ["Siembra", "Crecimiento", "Floración", "Fructificación", "Cosecha"],
}

// Variables globales
let selectedSensor = null
let selectedInsumo = null
let currentIntegrationType = "sensor"
let isDeleteMode = false
let selectedCycle = null

// Función para obtener elementos del DOM de forma segura
function getElement(selector) {
  const element = document.querySelector(selector)
  if (!element) {
    console.warn(`Elemento no encontrado: ${selector}`)
    return null
  }
  return element
}

// Inicializar elementos DOM
let modal,
  btnAgregarIntegracion,
  btnCancel,
  btnSave,
  closeBtn,
  searchInput,
  selectionList,
  selectedItemInfo,
  selectedItemName,
  selectedItemDescription,
  integrationForm,
  toast,
  toastTitle,
  toastDescription,
  toastIcon,
  sensoresList,
  insumosList,
  lecturasGrid,
  btnEliminarIntegracion,
  modalTitle,
  cycleModal,
  btnUpdateCycle,
  btnCancelCycle,
  btnSaveCycle,
  closeCycleBtn,
  searchCycleInput,
  cycleSelectionList,
  selectedCycleInfo,
  selectedCycleName,
  selectedCycleDescription,
  cycleForm

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar referencias a elementos DOM
  initializeElements()

  // Verificar si se encontraron los elementos necesarios
  if (!sensoresList || !insumosList || !lecturasGrid) {
    console.error("No se encontraron los elementos necesarios en el DOM")
    return
  }

  // Cargar datos iniciales
  renderSensoresIntegrados()
  renderInsumosIntegrados()
  renderLecturasSensores()
  renderCicloCultivo()

  // Configurar eventos
  setupTabs()
  setupModalEvents()
  setupDeleteIntegrationEvent()
  setupUpdateCycleEvent()
})

// Función para inicializar referencias a elementos DOM
function initializeElements() {
  modal = getElement(".modal")
  btnAgregarIntegracion = getElement("#btnAgregarIntegracion")
  btnCancel = getElement("#btnCancel")
  btnSave = getElement("#btnSave")
  closeBtn = getElement(".modal__close")
  searchInput = getElement("#searchInput")
  selectionList = getElement("#selectionList")
  selectedItemInfo = getElement("#selectedItemInfo")
  selectedItemName = getElement("#selectedItemName")
  selectedItemDescription = getElement("#selectedItemDescription")
  integrationForm = getElement("#integrationForm")
  toast = getElement("#toast")
  toastTitle = getElement("#toastTitle")
  toastDescription = getElement("#toastDescription")
  toastIcon = getElement("#toastIcon")
  sensoresList = getElement("#sensoresList")
  insumosList = getElement("#insumosList")
  lecturasGrid = getElement("#lecturasGrid")
  btnEliminarIntegracion = getElement("#btnEliminarIntegracion")
  modalTitle = getElement(".modal__header-title")

  // Elementos para el modal de ciclo
  cycleModal = getElement("#cycleModal")
  btnUpdateCycle = getElement("#btnUpdateCycle")
  btnCancelCycle = getElement("#btnCancelCycle")
  btnSaveCycle = getElement("#btnSaveCycle")
  closeCycleBtn = getElement("#cycleModal .modal__close")
  searchCycleInput = getElement("#searchCycleInput")
  cycleSelectionList = getElement("#cycleSelectionList")
  selectedCycleInfo = getElement("#selectedCycleInfo")
  selectedCycleName = getElement("#selectedCycleName")
  selectedCycleDescription = getElement("#selectedCycleDescription")
  cycleForm = getElement("#cycleForm")
}

// Función para renderizar sensores integrados
function renderSensoresIntegrados() {
  if (!sensoresList) return

  sensoresList.innerHTML = ""

  if (sensoresIntegrados.length === 0) {
    sensoresList.innerHTML = `
      <li class="integration__item integration__item--empty">
        <p>No hay sensores integrados</p>
      </li>`
    return
  }

  sensoresIntegrados.forEach((sensor) => {
    const li = document.createElement("li")
    li.className = "integration__item sensor"
    li.dataset.id = sensor.id

    li.innerHTML = `
      <div class="sensor__card">
        <div class="sensor__icon">
          <i class="fas fa-${sensor.icono}" style="color: ${sensor.iconoColor}"></i>
        </div>
        <div class="sensor__info">
          <h3 class="sensor__name">${sensor.nombre}</h3>
          <div class="sensor__meta">
            <span class="sensor__location">
              <i class="fas fa-map-marker-alt"></i> ${sensor.ubicacion}
            </span>
            <span class="sensor__interval">
              <i class="fas fa-clock"></i> ${formatIntervalo(sensor.intervalo)}
            </span>
          </div>
          <div class="sensor__details">
            <span class="sensor__model">${sensor.modelo}</span>
            <span class="sensor__manufacturer">${sensor.fabricante}</span>
          </div>
        </div>
        <div class="sensor__status">
          <span class="sensor__badge ${sensor.estado === "activo" ? "sensor__badge--active" : "sensor__badge--inactive"}">
            ${sensor.estado === "activo" ? "Activo" : "Inactivo"}
          </span>
          <span class="sensor__date">Desde: ${sensor.fechaCreacion}</span>
          <button class="btn btn--danger btn--small delete-integration" data-id="${sensor.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `

    // Agregar evento de eliminación
    const deleteBtn = li.querySelector('.delete-integration')
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const sensorId = e.target.closest('.delete-integration').dataset.id
      if (confirm('¿Está seguro de eliminar esta integración?')) {
        sensoresIntegrados = sensoresIntegrados.filter(s => s.id !== sensorId)
        renderSensoresIntegrados()
        showToast("Integración eliminada", "El sensor ha sido eliminado correctamente.", "success")
      }
    })

    sensoresList.appendChild(li)
  })
}

// Función para renderizar insumos integrados
function renderInsumosIntegrados() {
  if (!insumosList) return

  insumosList.innerHTML = ""

  if (insumosIntegrados.length === 0) {
    insumosList.innerHTML = `
      <li class="integration__item integration__item--empty">
        <p>No hay insumos integrados</p>
      </li>`
    return
  }

  insumosIntegrados.forEach((insumo) => {
    const li = document.createElement("li")
    li.className = "integration__item insumo"
    li.dataset.id = insumo.id

    li.innerHTML = `
      <div class="insumo__card">
        <div class="insumo__icon">
          <i class="fas fa-${insumo.icono}" style="color: ${insumo.iconoColor}"></i>
        </div>
        <div class="insumo__info">
          <h3 class="insumo__name">${insumo.nombre}</h3>
          <div class="insumo__meta">
            <span class="insumo__type">${insumo.tipo}</span>
            <span class="insumo__presentation">${insumo.presentacion}</span>
            ${insumo.unidad ? `<span class="insumo__unit">${insumo.unidad}</span>` : ""}
          </div>
        </div>
        <div class="insumo__status">
          <span class="insumo__usage">Último uso: ${insumo.ultimoUso || "No usado"}</span>
          <span class="insumo__date">Desde: ${insumo.fechaCreacion}</span>
          <button class="btn btn--danger btn--small delete-integration" data-id="${insumo.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `

    // Agregar evento de eliminación
    const deleteBtn = li.querySelector('.delete-integration')
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const insumoId = e.target.closest('.delete-integration').dataset.id
      if (confirm('¿Está seguro de eliminar esta integración?')) {
        insumosIntegrados = insumosIntegrados.filter(i => i.id !== insumoId)
        renderInsumosIntegrados()
        showToast("Integración eliminada", "El insumo ha sido eliminado correctamente.", "success")
      }
    })

    insumosList.appendChild(li)
  })
}

// Renderizar lista de elementos integrados para eliminar
function renderIntegratedSelectionList() {
  // Verificar si el elemento existe
  if (!selectionList) return

  selectionList.innerHTML = ""

  if (currentIntegrationType === "sensor") {
    if (sensoresIntegrados.length > 0) {
      sensoresIntegrados.forEach((sensor) => {
        const div = document.createElement("div")
        div.className = `selection-item ${selectedSensor && selectedSensor.id === sensor.id ? "selected" : ""}`
        div.dataset.id = sensor.id

        div.innerHTML = `
          <div class="selection-icon">
            <i class="fas fa-${sensor.icono}" style="color: ${sensor.iconoColor}"></i>
          </div>
          <div class="selection-details">
            <div class="selection-name">${sensor.nombre}</div>
            <div class="selection-meta">${sensor.modelo} | ${sensor.ubicacion}</div>
          </div>
        `

        div.addEventListener("click", () => {
          selectedSensor = sensor
          selectedInsumo = null

          // Actualizar selección visual
          document.querySelectorAll(".selection-item").forEach((item) => {
            item.classList.remove("selected")
          })
          div.classList.add("selected")

          // Mostrar información del elemento seleccionado
          if (selectedItemInfo) {
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = sensor.nombre
            selectedItemDescription.textContent = `Ubicación: ${sensor.ubicacion}, Intervalo: ${formatIntervalo(sensor.intervalo)}`
          }
        })

        selectionList.appendChild(div)
      })
    } else {
      selectionList.innerHTML = `<div class="no-results">No hay sensores integrados para eliminar</div>`
    }
  } else {
    if (insumosIntegrados.length > 0) {
      insumosIntegrados.forEach((insumo) => {
        const div = document.createElement("div")
        div.className = `selection-item ${selectedInsumo && selectedInsumo.id === insumo.id ? "selected" : ""}`
        div.dataset.id = insumo.id

        div.innerHTML = `
          <div class="selection-icon">
            <i class="fas fa-${insumo.icono}" style="color: ${insumo.iconoColor}"></i>
          </div>
          <div class="selection-details">
            <div class="selection-name">${insumo.nombre}</div>
            <div class="selection-meta">${insumo.modelo} | ${insumo.presentacion}</div>
          </div>
          <div class="selection-unit">${insumo.unidad}</div>
        `

        div.addEventListener("click", () => {
          selectedInsumo = insumo
          selectedSensor = null

          // Actualizar selección visual
          document.querySelectorAll(".selection-item").forEach((item) => {
            item.classList.remove("selected")
          })
          div.classList.add("selected")

          // Mostrar información del elemento seleccionado
          if (selectedItemInfo) {
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = insumo.nombre
            selectedItemDescription.textContent = `Presentación: ${insumo.presentacion}, Último uso: ${insumo.ultimoUso || "No usado"}`
          }
        })

        selectionList.appendChild(div)
      })
    } else {
      selectionList.innerHTML = `<div class="no-results">No hay insumos integrados para eliminar</div>`
    }
  }
}

// Configurar evento para el botón "Eliminar Integración"
function setupDeleteIntegrationEvent() {
  if (!btnEliminarIntegracion) return

  btnEliminarIntegracion.addEventListener("click", () => {
    isDeleteMode = true
    if (modal) modal.style.display = "block" // Mostrar el modal
    resetForm() // Reiniciar el formulario

    // Cambiar el título del modal para eliminar
    if (modalTitle) modalTitle.textContent = "Eliminar Integración"

    // Ocultar el botón de guardar
    if (btnSave) btnSave.style.display = "none"

    // Crear botón de eliminar si no existe
    let btnDelete = document.getElementById("btnDelete")
    if (!btnDelete) {
      btnDelete = document.createElement("button")
      btnDelete.id = "btnDelete"
      btnDelete.type = "button"
      btnDelete.className = "btn btn-danger"
      btnDelete.textContent = "Eliminar"

      // Agregar el botón al contenedor de acciones del formulario
      const formActions = document.querySelector(".form-actions")
      if (formActions) formActions.appendChild(btnDelete)
    } else {
      btnDelete.style.display = "inline-block"
    }

    // Renderizar la lista de sensores o insumos integrados
    renderIntegratedSelectionList()

    // Configurar evento para el botón de eliminar
    btnDelete.onclick = () => {
      if (currentIntegrationType === "sensor") {
        if (!selectedSensor) {
          showToast("Error", "Por favor seleccione un sensor para eliminar", "error")
          return
        }

        // Eliminar el sensor seleccionado
        sensoresIntegrados = sensoresIntegrados.filter((sensor) => sensor.id !== selectedSensor.id)
        renderSensoresIntegrados() // Actualizar la lista de sensores integrados
        showToast("Integración eliminada", `${selectedSensor.nombre} ha sido eliminado correctamente.`, "success")
        selectedSensor = null // Reiniciar la selección
      } else {
        if (!selectedInsumo) {
          showToast("Error", "Por favor seleccione un insumo para eliminar", "error")
          return
        }

        // Eliminar el insumo seleccionado
        insumosIntegrados = insumosIntegrados.filter((insumo) => insumo.id !== selectedInsumo.id)
        renderInsumosIntegrados() // Actualizar la lista de insumos integrados
        showToast("Integración eliminada", `${selectedInsumo.nombre} ha sido eliminado correctamente.`, "success")
        selectedInsumo = null // Reiniciar la selección
      }

      // Cerrar modal
      if (modal) modal.style.display = "none"
      isDeleteMode = false
    }
  })
}

// Función para renderizar lecturas de sensores
function renderLecturasSensores() {
  if (!lecturasGrid) return

  lecturasGrid.innerHTML = ""

  lecturasSensores.forEach((lectura) => {
    const div = document.createElement("div")
    div.className = "reading-card"

    div.innerHTML = `
      <div class="reading-card__icon">
        <i class="fas fa-${lectura.icono}" style="color: ${lectura.iconoColor}"></i>
      </div>
      <div class="reading-card__details">
        <div class="reading-card__name">${lectura.nombre}</div>
        <div class="reading-card__value">${lectura.valor} ${lectura.unidad}</div>
        <div class="reading-card__time">${lectura.actualizado}</div>
      </div>
    `

    lecturasGrid.appendChild(div)
  })
}

// Configurar eventos de tabs
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab__button")
  const tabPanes = document.querySelectorAll(".tab__pane")

  if (!tabButtons.length || !tabPanes.length) return

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")
      if (!tabId) return

      // Desactivar todos los tabs
      tabButtons.forEach((btn) => btn.classList.remove("tab__button--active"))
      tabPanes.forEach((pane) => pane.classList.remove("tab__pane--active"))

      // Activar el tab seleccionado
      button.classList.add("tab__button--active")
      const targetPane = document.getElementById(tabId)
      if (targetPane) targetPane.classList.add("tab__pane--active")
    })
  })
}

// Configurar eventos del modal
function setupModalEvents() {
  // Verificar si los elementos existen
  if (!btnAgregarIntegracion || !modal || !closeBtn || !btnCancel || !integrationForm) return

  // Abrir modal para agregar
  btnAgregarIntegracion.addEventListener("click", () => {
    isDeleteMode = false
    modal.style.display = "block"
    resetForm()
    renderSelectionList()
  })

  // Cerrar modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
    isDeleteMode = false
  })

  btnCancel.addEventListener("click", () => {
    modal.style.display = "none"
    isDeleteMode = false
  })

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
      isDeleteMode = false
    }
  })

  // Cambiar tipo de integración
  const radioOptions = document.querySelectorAll('input[name="integrationType"]')
  if (radioOptions.length) {
    radioOptions.forEach((option) => {
      option.addEventListener("change", (e) => {
        currentIntegrationType = e.target.value
        selectedSensor = null
        selectedInsumo = null
        if (selectedItemInfo) selectedItemInfo.classList.add("hidden")
        if (searchInput) {
          searchInput.value = ""
          searchInput.placeholder = `Buscar ${currentIntegrationType === "sensor" ? "sensor" : "insumo"} por nombre, tipo o ${currentIntegrationType === "sensor" ? "modelo" : "marca"}...`
        }

        // Determinar qué lista renderizar según el contexto
        if (isDeleteMode) {
          renderIntegratedSelectionList() // Estamos en modo eliminación
        } else {
          renderSelectionList() // Estamos en modo agregar
        }
      })
    })
  }

  // Buscar elementos
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      // Determinar qué lista renderizar según el contexto
      if (isDeleteMode) {
        renderIntegratedSelectionList() // Estamos en modo eliminación
      } else {
        renderSelectionList() // Estamos en modo agregar
      }
    })
  }

  // Enviar formulario para agregar
  integrationForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Solo procesar si no estamos en modo eliminación
    if (!isDeleteMode) {
      if (currentIntegrationType === "sensor") {
        if (!selectedSensor) {
          showToast("Error", "Por favor seleccione un sensor", "error")
          return
        }

        // Crear objeto de integración de sensor
        const nuevaIntegracion = {
          id: `sen-${Date.now()}`,
          nombre: selectedSensor.nombre,
          tipo: selectedSensor.tipo,
          tipoIntegracion: "sensor",
          modelo: selectedSensor.modelo,
          fabricante: selectedSensor.fabricante,
          ubicacion: selectedSensor.ubicacion,
          intervalo: "15",
          unidadMedida: selectedSensor.unidadMedida,
          fechaCreacion: new Date().toLocaleDateString(),
          estado: "activo",
          sensorId: selectedSensor.id,
          icono: selectedSensor.icono,
          iconoColor: selectedSensor.iconoColor,
        }

        // Agregar a la lista
        sensoresIntegrados.push(nuevaIntegracion)
        renderSensoresIntegrados()

        // Mostrar toast de confirmación
        showToast("Integración agregada", `Se ha agregado ${selectedSensor.nombre} correctamente.`, "success")
      } else {
        if (!selectedInsumo) {
          showToast("Error", "Por favor seleccione un insumo", "error")
          return
        }

        // Crear objeto de integración de insumo
        const nuevaIntegracion = {
          id: `ins-${Date.now()}`,
          nombre: selectedInsumo.nombre,
          tipo: selectedInsumo.tipo,
          tipoIntegracion: "insumo",
          modelo: selectedInsumo.marca,
          presentacion: selectedInsumo.presentacion,
          unidad: selectedInsumo.unidad,
          fechaCreacion: new Date().toLocaleDateString(),
          estado: "activo",
          insumoId: selectedInsumo.id,
          icono: selectedInsumo.icono,
          iconoColor: selectedInsumo.iconoColor,
          ultimoUso: "No usado", // Añadido para mostrar en la lista
        }

        // Agregar a la lista
        insumosIntegrados.push(nuevaIntegracion)
        renderInsumosIntegrados()

        // Mostrar toast de confirmación
        showToast("Integración agregada", `Se ha agregado ${selectedInsumo.nombre} correctamente.`, "success")
      }

      // Cerrar modal
      modal.style.display = "none"
    }
  })
}

// Resetear formulario
function resetForm() {
  selectedSensor = null
  selectedInsumo = null
  currentIntegrationType = "sensor"

  const sensorTypeRadio = document.getElementById("sensorType")
  if (sensorTypeRadio) sensorTypeRadio.checked = true

  if (searchInput) searchInput.value = ""
  if (selectedItemInfo) selectedItemInfo.classList.add("hidden")

  // Restaurar el estado normal del modal para agregar si no estamos en modo eliminación
  if (!isDeleteMode) {
    if (modalTitle) modalTitle.textContent = "Agregar Nueva Integración"
    if (btnSave) btnSave.style.display = "inline-block"

    // Ocultar el botón de eliminar si existe
    const btnDelete = document.getElementById("btnDelete")
    if (btnDelete) {
      btnDelete.style.display = "none"
    }
  }
}

// Renderizar lista de selección
function renderSelectionList() {
  if (!selectionList || !searchInput) return

  selectionList.innerHTML = ""
  const searchTerm = searchInput.value.toLowerCase()

  if (currentIntegrationType === "sensor") {
    const filteredSensores = sensoresDisponibles.filter(
      (sensor) =>
        sensor.nombre.toLowerCase().includes(searchTerm) ||
        sensor.tipo.toLowerCase().includes(searchTerm) ||
        sensor.modelo.toLowerCase().includes(searchTerm),
    )

    if (filteredSensores.length > 0) {
      filteredSensores.forEach((sensor) => {
        const div = document.createElement("div")
        div.className = `selection-item ${selectedSensor && selectedSensor.id === sensor.id ? "selected" : ""}`

        div.innerHTML = `
          <div class="selection-icon">
              <i class="fas fa-${sensor.icono}" style="color: ${sensor.iconoColor}"></i>
          </div>
          <div class="selection-details">
              <div class="selection-name">${sensor.nombre}</div>
              <div class="selection-meta">${sensor.modelo} | ${sensor.fabricante}</div>
          </div>
        `

        div.addEventListener("click", () => {
          selectedSensor = sensor
          selectedInsumo = null

          // Actualizar selección visual
          document.querySelectorAll(".selection-item").forEach((item) => {
            item.classList.remove("selected")
          })
          div.classList.add("selected")

          // Mostrar información detallada del sensor
          if (selectedItemInfo && selectedItemName && selectedItemDescription) {
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = sensor.nombre
            selectedItemDescription.innerHTML = `
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Tipo:</span>
                  <span class="detail-value">${sensor.tipo}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Modelo:</span>
                  <span class="detail-value">${sensor.modelo}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Fabricante:</span>
                  <span class="detail-value">${sensor.fabricante}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Ubicación:</span>
                  <span class="detail-value">${sensor.ubicacion}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Unidad de medida:</span>
                  <span class="detail-value">${sensor.unidadMedida}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Frecuencia de lectura:</span>
                  <span class="detail-value">Cada ${formatIntervalo(15)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Rango de medición:</span>
                  <span class="detail-value">${getRangoMedicion(sensor.tipo)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Precisión:</span>
                  <span class="detail-value">${getPrecision(sensor.tipo, sensor.modelo)}</span>
                </div>
                <div class="detail-item descripcion">
                  <span class="detail-label">Descripción:</span>
                  <span class="detail-value">${sensor.descripcion}</span>
                </div>
              </div>
            `
          }
        })

        selectionList.appendChild(div)
      })
    } else {
      selectionList.innerHTML = `<div class="no-results">No se encontraron sensores con ese criterio</div>`
    }
  } else {
    const filteredInsumos = insumosDisponibles.filter(
      (insumo) =>
        insumo.nombre.toLowerCase().includes(searchTerm) ||
        insumo.tipo.toLowerCase().includes(searchTerm) ||
        insumo.marca.toLowerCase().includes(searchTerm),
    )

    if (filteredInsumos.length > 0) {
      filteredInsumos.forEach((insumo) => {
        const div = document.createElement("div")
        div.className = `selection-item ${selectedInsumo && selectedInsumo.id === insumo.id ? "selected" : ""}`

        div.innerHTML = `
          <div class="selection-icon">
              <i class="fas fa-${insumo.icono}" style="color: ${insumo.iconoColor}"></i>
          </div>
          <div class="selection-details">
              <div class="selection-name">${insumo.nombre}</div>
              <div class="selection-meta">${insumo.marca} | ${insumo.presentacion}</div>
          </div>
        `

        div.addEventListener("click", () => {
          selectedInsumo = insumo
          selectedSensor = null

          // Actualizar selección visual
          document.querySelectorAll(".selection-item").forEach((item) => {
            item.classList.remove("selected")
          })
          div.classList.add("selected")

          // Mostrar información detallada del insumo
          if (selectedItemInfo && selectedItemName && selectedItemDescription) {
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = insumo.nombre
            selectedItemDescription.innerHTML = `
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Tipo:</span>
                  <span class="detail-value">${insumo.tipo}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Marca:</span>
                  <span class="detail-value">${insumo.marca}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Presentación:</span>
                  <span class="detail-value">${insumo.presentacion}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Unidad:</span>
                  <span class="detail-value">${insumo.unidad}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Método de aplicación:</span>
                  <span class="detail-value">${getMetodoAplicacion(insumo.tipo)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Frecuencia recomendada:</span>
                  <span class="detail-value">${getFrecuenciaAplicacion(insumo.tipo)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Personal requerido:</span>
                  <span class="detail-value">${getPersonalRequerido(insumo.tipo)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Precauciones:</span>
                  <span class="detail-value">${getPrecauciones(insumo.tipo)}</span>
                </div>
                <div class="detail-item descripcion">
                  <span class="detail-label">Descripción:</span>
                  <span class="detail-value">${insumo.descripcion}</span>
                </div>
              </div>
            `
          }
        })

        selectionList.appendChild(div)
      })
    } else {
      selectionList.innerHTML = `<div class="no-results">No se encontraron insumos con ese criterio</div>`
    }
  }
}

// Mostrar toast
function showToast(title, message, type = "success") {
  if (!toast || !toastTitle || !toastDescription || !toastIcon) return

  toastTitle.textContent = title
  toastDescription.textContent = message

  if (type === "success") {
    toastIcon.className = "fas fa-check-circle toast__icon toast__icon--success"
  } else {
    toastIcon.className = "fas fa-exclamation-circle toast__icon toast__icon--error"
  }

  toast.classList.remove("hidden")

  // Ocultar toast después de 5 segundos
  setTimeout(() => {
    toast.classList.add("hidden")
  }, 5000)
}

// Función para renderizar datos del ciclo de cultivo
function renderCicloCultivo() {
  const currentPhase = getElement("#currentPhase")
  const cycleProgress = getElement("#cycleProgress")
  const seedingDate = getElement("#seedingDate")
  const daysPassed = getElement("#daysPassed")
  const harvestDate = getElement("#harvestDate")

  if (!currentPhase || !cycleProgress || !seedingDate || !daysPassed || !harvestDate) return

  currentPhase.textContent = cicloCultivo.faseActual
  cycleProgress.style.width = `${cicloCultivo.progresoFase}%`
  seedingDate.textContent = cicloCultivo.fechaSiembra
  daysPassed.textContent = `${cicloCultivo.diasTranscurridos} días`
  harvestDate.textContent = cicloCultivo.fechaCosechaEstimada
}

// Configurar evento para el botón "Actualizar Ciclo"
function setupUpdateCycleEvent() {
  if (!btnUpdateCycle || !cycleModal || !closeCycleBtn || !btnCancelCycle || !cycleForm) return

  btnUpdateCycle.addEventListener("click", () => {
    // Mostrar el modal de selección de ciclo
    cycleModal.style.display = "block"
    resetCycleForm()
    renderCycleSelectionList()
  })

  // Cerrar modal
  closeCycleBtn.addEventListener("click", () => {
    cycleModal.style.display = "none"
  })

  btnCancelCycle.addEventListener("click", () => {
    cycleModal.style.display = "none"
  })

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === cycleModal) {
      cycleModal.style.display = "none"
    }
  })

  // Buscar ciclos
  if (searchCycleInput) {
    searchCycleInput.addEventListener("input", () => {
      renderCycleSelectionList()
    })
  }

  // Enviar formulario para aplicar ciclo
  cycleForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!selectedCycle) {
      showToast("Error", "Por favor seleccione un ciclo de cultivo", "error")
      return
    }

    // Aplicar el ciclo seleccionado
    aplicarCiclo(selectedCycle)

    // Cerrar modal
    cycleModal.style.display = "none"
  })
}

// Función para aplicar el ciclo seleccionado
function aplicarCiclo(ciclo) {
  // Actualizar datos del ciclo actual
  cicloCultivo.id = ciclo.id
  cicloCultivo.fechaSiembra = ciclo.fechaInicio
  cicloCultivo.fechaCosechaEstimada = ciclo.fechaFinEstimada
  cicloCultivo.diasTranscurridos = 0 // Reiniciar días transcurridos
  cicloCultivo.faseActual = ciclo.faseInicial // Establecer fase inicial predeterminada
  cicloCultivo.progresoFase = ciclo.progresoInicial // Establecer progreso inicial predeterminado

  // Actualizar la visualización
  renderCicloCultivo()

  // Mostrar toast de confirmación
  showToast("Ciclo actualizado", `Se ha aplicado el ciclo "${ciclo.nombre}" correctamente.`, "success")
}

// Resetear formulario de ciclo
function resetCycleForm() {
  selectedCycle = null
  if (searchCycleInput) searchCycleInput.value = ""
  if (selectedCycleInfo) selectedCycleInfo.classList.add("hidden")
}

// Renderizar lista de selección de ciclos
function renderCycleSelectionList() {
  if (!cycleSelectionList || !searchCycleInput) return

  cycleSelectionList.innerHTML = ""
  const searchTerm = searchCycleInput.value.toLowerCase()

  const filteredCiclos = ciclosDisponibles.filter(
    (ciclo) =>
      ciclo.nombre.toLowerCase().includes(searchTerm) ||
      ciclo.tipo.toLowerCase().includes(searchTerm) ||
      ciclo.variedad.toLowerCase().includes(searchTerm),
  )

  if (filteredCiclos.length > 0) {
    filteredCiclos.forEach((ciclo) => {
      const div = document.createElement("div")
      div.className = `selection-item ${selectedCycle && selectedCycle.id === ciclo.id ? "selected" : ""}`

      div.innerHTML = `
      <div class="selection-icon">
          <i class="fas fa-${ciclo.icono}" style="color: ${ciclo.iconoColor}"></i>
      </div>
      <div class="selection-details">
          <div class="selection-name">${ciclo.nombre}</div>
          <div class="selection-meta">Duración: ${ciclo.duracionDias} días | Variedad: ${ciclo.variedad}</div>
      </div>
      <div class="selection-unit">${ciclo.fases.length} fases</div>
    `

      div.addEventListener("click", () => {
        selectedCycle = ciclo

        // Actualizar selección visual
        document.querySelectorAll(".selection-item").forEach((item) => {
          item.classList.remove("selected")
        })
        div.classList.add("selected")

        // Mostrar información del ciclo seleccionado
        if (selectedCycleInfo && selectedCycleName && selectedCycleDescription) {
          selectedCycleInfo.classList.remove("hidden")
          selectedCycleName.textContent = ciclo.nombre
          selectedCycleDescription.textContent = ciclo.descripcion
        }
      })

      cycleSelectionList.appendChild(div)
    })
  } else {
    cycleSelectionList.innerHTML = `<div class="no-results">No se encontraron ciclos con ese criterio</div>`
  }
}

// Formatear intervalo de tiempo
function formatIntervalo(minutos) {
  const min = Number.parseInt(minutos)
  if (min < 60) return `${min} min`
  if (min === 60) return "1 hora"
  if (min < 1440) return `${min / 60} horas`
  return "24 horas"
}

// Funciones auxiliares
function getRangoMedicion(tipo) {
  const rangos = {
    temperatura: "-40°C a 80°C",
    humedad: "0% a 100%",
    viento: "0 km/h a 160 km/h",
    aire: "0 ppm a 5000 ppm",
    luz: "0 a 65535 lux",
    quimico: "0 a 14 pH",
  }
  return rangos[tipo] || "No especificado"
}

function getPrecision(tipo, modelo) {
  const precisiones = {
    DHT22: "±0.5°C, ±2-5% HR",
    "FC-28": "±5%",
    "WS-3000": "±2 km/h",
    "MG-811": "±50 ppm",
    BH1750: "±20%",
    "PH-4502C": "±0.1 pH",
  }
  return precisiones[modelo] || "±5%"
}

function getMetodoAplicacion(tipo) {
  const metodos = {
    fertilizante: "Aplicación directa al suelo o sistema de riego",
    pesticida: "Fumigación foliar",
    agua: "Sistema de riego",
    bioestimulante: "Aplicación foliar o radicular",
    micronutriente: "Aplicación al suelo o foliar",
    regulador: "Aplicación directa al ambiente",
  }
  return metodos[tipo] || "No especificado"
}

function getFrecuenciaAplicacion(tipo) {
  const frecuencias = {
    fertilizante: "Cada 15-30 días",
    pesticida: "Según necesidad, mínimo 7 días entre aplicaciones",
    agua: "Diariamente según necesidad",
    bioestimulante: "Cada 15 días",
    micronutriente: "Mensualmente",
    regulador: "Según ciclo de cultivo",
  }
  return frecuencias[tipo] || "Según especificaciones"
}

function getPersonalRequerido(tipo) {
  const personal = {
    fertilizante: "Técnico agrícola",
    pesticida: "Operador certificado con EPP",
    agua: "Operador de riego",
    bioestimulante: "Técnico agrícola",
    micronutriente: "Técnico agrícola",
    regulador: "Especialista agrícola",
  }
  return personal[tipo] || "Personal capacitado"
}

function getPrecauciones(tipo) {
  const precauciones = {
    fertilizante: "Usar guantes y mascarilla",
    pesticida: "EPP completo, no aplicar con viento fuerte",
    agua: "Verificar pH y calidad del agua",
    bioestimulante: "Usar protección básica",
    micronutriente: "Evitar contacto con piel y ojos",
    regulador: "Mantener condiciones ambientales controladas",
  }
  return precauciones[tipo] || "Seguir instrucciones del fabricante"
}
