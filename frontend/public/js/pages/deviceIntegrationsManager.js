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
  
  // Variables globales
  let selectedSensor = null
  let selectedInsumo = null
  let currentIntegrationType = "sensor"
  let isDeleteMode = false
  
  // Elementos DOM
  const modal = document.getElementById("integrationModal")
  const btnAgregarIntegracion = document.getElementById("btnAgregarIntegracion")
  const btnCancel = document.getElementById("btnCancel")
  const btnSave = document.getElementById("btnSave")
  const closeBtn = document.querySelector(".close")
  const searchInput = document.getElementById("searchInput")
  const selectionList = document.getElementById("selectionList")
  const selectedItemInfo = document.getElementById("selectedItemInfo")
  const selectedItemName = document.getElementById("selectedItemName")
  const selectedItemDescription = document.getElementById("selectedItemDescription")
  const integrationForm = document.getElementById("integrationForm")
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toastTitle")
  const toastDescription = document.getElementById("toastDescription")
  const toastIcon = document.getElementById("toastIcon")
  const sensoresList = document.getElementById("sensoresList")
  const insumosList = document.getElementById("insumosList")
  const lecturasGrid = document.getElementById("lecturasGrid")
  const btnEliminarIntegracion = document.getElementById("btnEliminarIntegracion")
  const modalTitle = document.querySelector(".modal-header h2")
  
  // Inicializar la aplicación
  document.addEventListener("DOMContentLoaded", () => {
    // Cargar datos iniciales
    renderSensoresIntegrados()
    renderInsumosIntegrados()
    renderLecturasSensores()
  
    // Configurar eventos de tabs
    setupTabs()
  
    // Configurar eventos del modal
    setupModalEvents()
  
    // Configurar evento para eliminar integraciones
    setupDeleteIntegrationEvent()
  })
  
  // Función para renderizar sensores integrados
  function renderSensoresIntegrados() {
    sensoresList.innerHTML = ""
  
    sensoresIntegrados.forEach((sensor) => {
      const li = document.createElement("li")
      li.className = "integration-item"
      li.dataset.id = sensor.id
  
      li.innerHTML = `
              <div class="integration-icon sensor">
                  <i class="fas fa-${sensor.icono}" style="color: ${sensor.iconoColor}"></i>
              </div>
              <div class="integration-details">
                  <div class="integration-name">${sensor.nombre}</div>
                  <div class="integration-meta">
                      <span><strong>Ubicación:</strong> ${sensor.ubicacion}</span>
                      <span><i class="fas fa-clock"></i> ${formatIntervalo(sensor.intervalo)}</span>
                  </div>
              </div>
              <div class="integration-status">
                  <span class="status-badge ${sensor.estado === "activo" ? "active" : "inactive"}">
                      ${sensor.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                  <div class="integration-date">Desde: ${sensor.fechaCreacion}</div>
              </div>
          `
  
      sensoresList.appendChild(li)
    })
  }
  
  // Función para renderizar insumos integrados
  function renderInsumosIntegrados() {
    insumosList.innerHTML = ""
  
    insumosIntegrados.forEach((insumo) => {
      const li = document.createElement("li")
      li.className = "integration-item"
      li.dataset.id = insumo.id
  
      li.innerHTML = `
              <div class="integration-icon insumo">
                  <i class="fas fa-${insumo.icono}" style="color: ${insumo.iconoColor}"></i>
              </div>
              <div class="integration-details">
                  <div class="integration-name">
                      ${insumo.nombre}
                  </div>
                  <div class="integration-meta">
                      <span>${insumo.modelo}</span>
                      ${insumo.presentacion ? `<span>${insumo.presentacion}</span>` : ""}
                      ${insumo.unidad ? `<span>Unidad: ${insumo.unidad}</span>` : ""}
                  </div>
              </div>
              <div class="integration-status">
                  <div class="integration-usage">Último uso: ${insumo.ultimoUso || "No usado"}</div>
                  <div class="integration-date">Desde: ${insumo.fechaCreacion}</div>
              </div>
          `
  
      insumosList.appendChild(li)
    })
  }
  
  // Renderizar lista de elementos integrados para eliminar
  function renderIntegratedSelectionList() {
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
                      <div class="selection-unit">${sensor.unidadMedida}</div>
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
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = sensor.nombre
            selectedItemDescription.textContent = `Ubicación: ${sensor.ubicacion}, Intervalo: ${formatIntervalo(sensor.intervalo)}`
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
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = insumo.nombre
            selectedItemDescription.textContent = `Presentación: ${insumo.presentacion}, Último uso: ${insumo.ultimoUso || "No usado"}`
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
    btnEliminarIntegracion.addEventListener("click", () => {
      isDeleteMode = true
      modal.style.display = "block" // Mostrar el modal
      resetForm() // Reiniciar el formulario
  
      // Cambiar el título del modal para eliminar
      modalTitle.textContent = "Eliminar Integración"
  
      // Ocultar el botón de guardar
      btnSave.style.display = "none"
  
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
        formActions.appendChild(btnDelete)
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
        modal.style.display = "none"
        isDeleteMode = false
      }
    })
  }
  
  // Función para renderizar lecturas de sensores
  function renderLecturasSensores() {
    lecturasGrid.innerHTML = ""
  
    lecturasSensores.forEach((lectura) => {
      const div = document.createElement("div")
      div.className = "reading-card"
  
      div.innerHTML = `
              <div class="reading-icon">
                  <i class="fas fa-${lectura.icono}" style="color: ${lectura.iconoColor}"></i>
              </div>
              <div class="reading-details">
                  <div class="reading-name">${lectura.nombre}</div>
                  <div class="reading-value">${lectura.valor} ${lectura.unidad}</div>
                  <div class="reading-time">${lectura.actualizado}</div>
              </div>
          `
  
      lecturasGrid.appendChild(div)
    })
  }
  
  // Configurar eventos de tabs
  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabPanes = document.querySelectorAll(".tab-pane")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")
  
        // Desactivar todos los tabs
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabPanes.forEach((pane) => pane.classList.remove("active"))
  
        // Activar el tab seleccionado
        button.classList.add("active")
        document.getElementById(tabId).classList.add("active")
      })
    })
  }
  
  // Configurar eventos del modal
  function setupModalEvents() {
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
    radioOptions.forEach((option) => {
      option.addEventListener("change", (e) => {
        currentIntegrationType = e.target.value
        selectedSensor = null
        selectedInsumo = null
        selectedItemInfo.classList.add("hidden")
        searchInput.value = ""
        searchInput.placeholder = `Buscar ${currentIntegrationType === "sensor" ? "sensor" : "insumo"} por nombre, tipo o ${currentIntegrationType === "sensor" ? "modelo" : "marca"}...`
  
        // Determinar qué lista renderizar según el contexto
        if (isDeleteMode) {
          renderIntegratedSelectionList() // Estamos en modo eliminación
        } else {
          renderSelectionList() // Estamos en modo agregar
        }
      })
    })
  
    // Buscar elementos
    searchInput.addEventListener("input", () => {
      // Determinar qué lista renderizar según el contexto
      if (isDeleteMode) {
        renderIntegratedSelectionList() // Estamos en modo eliminación
      } else {
        renderSelectionList() // Estamos en modo agregar
      }
    })
  
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
    document.getElementById("sensorType").checked = true
    searchInput.value = ""
    selectedItemInfo.classList.add("hidden")
  
    // Restaurar el estado normal del modal para agregar si no estamos en modo eliminación
    if (!isDeleteMode) {
      modalTitle.textContent = "Agregar Nueva Integración"
      btnSave.style.display = "inline-block"
  
      // Ocultar el botón de eliminar si existe
      const btnDelete = document.getElementById("btnDelete")
      if (btnDelete) {
        btnDelete.style.display = "none"
      }
    }
  }
  
  // Renderizar lista de selección
  function renderSelectionList() {
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
                      <div class="selection-unit">${sensor.unidadMedida}</div>
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
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = sensor.nombre
            selectedItemDescription.textContent = sensor.descripcion
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
            selectedItemInfo.classList.remove("hidden")
            selectedItemName.textContent = insumo.nombre
            selectedItemDescription.textContent = insumo.descripcion
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
    toastTitle.textContent = title
    toastDescription.textContent = message
  
    if (type === "success") {
      toastIcon.className = "fas fa-check-circle"
    } else {
      toastIcon.className = "fas fa-exclamation-circle"
    }
  
    toast.classList.remove("hidden")
  
    // Ocultar toast después de 5 segundos
    setTimeout(() => {
      toast.classList.add("hidden")
    }, 5000)
  }
  
  // Formatear intervalo de tiempo
  function formatIntervalo(minutos) {
    const min = Number.parseInt(minutos)
    if (min < 60) return `${min} min`
    if (min === 60) return "1 hora"
    if (min < 1440) return `${min / 60} horas`
    return "24 horas"
  }
  