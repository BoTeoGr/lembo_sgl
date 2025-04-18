// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // ===== INICIALIZACIÓN DE COMPONENTES =====
  loadTasksFromStorage()
  initTabs()
  initTaskModal()
  initTaskCheckboxes()
  initTaskDeleteButtons()

  // ===== FUNCIONALIDAD DE PESTAÑAS =====
  function initTabs() {
    const tabButtons = document.querySelectorAll(".tabs__button")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Obtener el ID de la pestaña a mostrar
        const tabId = button.getAttribute("data-tab")

        // Remover la clase activa de todos los botones y paneles
        document.querySelectorAll(".tabs__button").forEach((btn) => {
          btn.classList.remove("tabs__button--active")
        })

        document.querySelectorAll(".tabs__pane").forEach((pane) => {
          pane.classList.remove("tabs__pane--active")
        })

        // Añadir la clase activa al botón y panel seleccionados
        button.classList.add("tabs__button--active")
        document.getElementById(tabId)?.classList.add("tabs__pane--active")
      })
    })
  }

  // ===== ALMACENAMIENTO LOCAL DE TAREAS =====

  // Cargar tareas desde localStorage
  function loadTasksFromStorage() {
    const tasksList = document.getElementById("tasksList")
    if (!tasksList) return

    // Limpiar la lista de tareas existente en el HTML
    tasksList.innerHTML = ""

    // Obtener tareas del localStorage
    const tasks = getTasksFromStorage()

    // Renderizar cada tarea
    tasks.forEach((task) => {
      const taskHTML = `
        <div class="tasks__item" data-id="${task.id}">
          <input type="checkbox" class="tasks__checkbox" id="${task.id}" ${task.completed ? "checked" : ""}>
          <label for="${task.id}" class="tasks__label ${task.completed ? "completed" : ""}">${task.name}</label>
          <div class="tasks__meta">
            <span class="tasks__time">${task.time}</span>
            <span class="badge ${task.priorityClass}">${task.priorityText}</span>
          </div>
          <button class="tasks__delete" title="Eliminar tarea">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `

      tasksList.insertAdjacentHTML("beforeend", taskHTML)
    })

    // Actualizar contador de tareas
    updateTaskCount()
  }

  // Obtener tareas del localStorage
  function getTasksFromStorage() {
    const tasksJSON = localStorage.getItem("agroTasks")

    // Si no hay tareas guardadas, devolver las tareas predeterminadas
    if (!tasksJSON) {
      const defaultTasks = [
        {
          id: "task1",
          name: "Revisar sistema de riego",
          completed: false,
          time: "14:30",
          priorityClass: "badge--warning",
          priorityText: "Media",
        },
        {
          id: "task2",
          name: "Aplicar fertilizante en sector 3",
          completed: false,
          time: "16:00",
          priorityClass: "badge--danger",
          priorityText: "Alta",
        },
      ]

      // Guardar las tareas predeterminadas en localStorage
      localStorage.setItem("agroTasks", JSON.stringify(defaultTasks))
      return defaultTasks
    }

    return JSON.parse(tasksJSON)
  }

  // Guardar tareas en localStorage
  function saveTasksToStorage(tasks) {
    localStorage.setItem("agroTasks", JSON.stringify(tasks))
  }

  // Actualizar una tarea en localStorage
  function updateTaskInStorage(taskId, updates) {
    const tasks = getTasksFromStorage()
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
      saveTasksToStorage(tasks)
    }
  }

  // Eliminar una tarea del localStorage
  function deleteTaskFromStorage(taskId) {
    const tasks = getTasksFromStorage()
    const filteredTasks = tasks.filter((task) => task.id !== taskId)
    saveTasksToStorage(filteredTasks)
  }

  // ===== FUNCIONALIDAD DEL MODAL DE TAREAS =====
  function initTaskModal() {
    const addTaskBtn = document.getElementById("addTaskBtn")
    const closeTaskModal = document.getElementById("closeTaskModal")
    const cancelTaskBtn = document.getElementById("cancelTaskBtn")
    const saveTaskBtn = document.getElementById("saveTaskBtn")
    const taskModal = document.getElementById("addTaskModal")
    const addTaskForm = document.getElementById("addTaskForm")
    const tasksList = document.getElementById("tasksList")

    // Abrir modal
    addTaskBtn?.addEventListener("click", () => {
      taskModal?.classList.add("active")
    })

    // Cerrar modal (botón X)
    closeTaskModal?.addEventListener("click", () => {
      taskModal?.classList.remove("active")
      addTaskForm?.reset()
    })

    // Cerrar modal (botón Cancelar)
    cancelTaskBtn?.addEventListener("click", () => {
      taskModal?.classList.remove("active")
      addTaskForm?.reset()
    })

    // Guardar tarea
    saveTaskBtn?.addEventListener("click", () => {
      const taskName = document.getElementById("taskName")?.value
      const taskPriority = document.getElementById("taskPriority")?.value

      if (taskName && taskName.trim() !== "") {
        // Crear nueva tarea
        addNewTask(taskName, taskPriority)

        // Cerrar modal y resetear formulario
        taskModal?.classList.remove("active")
        addTaskForm?.reset()
      }
    })

    // Cerrar modal al hacer clic fuera del contenido
    taskModal?.addEventListener("click", (e) => {
      if (e.target === taskModal) {
        taskModal.classList.remove("active")
        addTaskForm?.reset()
      }
    })
  }

  // Función para añadir una nueva tarea
  function addNewTask(taskName, priority) {
    // Generar ID único para la tarea
    const taskId = "task_" + Date.now()

    // Determinar clase de prioridad y texto
    let priorityClass = "badge--medium"
    let priorityText = "Media"

    if (priority === "alta") {
      priorityClass = "badge--danger"
      priorityText = "Alta"
    } else if (priority === "baja") {
      priorityClass = "badge--success"
      priorityText = "Baja"
    } else if (priority === "media") {
      priorityClass = "badge--warning"
      priorityText = "Media"
    }

    // Crear hora aleatoria para la demostración
    const hours = Math.floor(Math.random() * 12) + 8 // Entre 8 y 19
    const minutes = Math.floor(Math.random() * 60)
    const timeStr = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`

    // Crear objeto de tarea
    const newTask = {
      id: taskId,
      name: taskName,
      completed: false,
      time: timeStr,
      priorityClass: priorityClass,
      priorityText: priorityText,
    }

    // Añadir tarea al localStorage
    const tasks = getTasksFromStorage()
    tasks.unshift(newTask) // Añadir al inicio del array
    saveTasksToStorage(tasks)

    // Recargar tareas desde localStorage
    loadTasksFromStorage()

    // Inicializar eventos para la nueva tarea
    initTaskCheckboxes()
    initTaskDeleteButtons()
  }

  // ===== FUNCIONALIDAD DE CHECKBOXES DE TAREAS =====
  function initTaskCheckboxes() {
    const checkboxes = document.querySelectorAll(".tasks__checkbox")

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleTaskCheckbox)
    })
  }

  function handleTaskCheckbox(e) {
    const checkbox = e.target
    const taskItem = checkbox.closest(".tasks__item")
    const taskId = checkbox.id
    const label = taskItem?.querySelector(".tasks__label")

    if (checkbox.checked) {
      label?.classList.add("completed")

      // Actualizar estado en localStorage
      updateTaskInStorage(taskId, { completed: true })

      // Opcional: mover tarea completada al final de la lista después de un tiempo
      setTimeout(() => {
        const tasksList = document.getElementById("tasksList")
        tasksList?.appendChild(taskItem)
      }, 500)
    } else {
      label?.classList.remove("completed")

      // Actualizar estado en localStorage
      updateTaskInStorage(taskId, { completed: false })
    }

    // Actualizar contador de tareas
    updateTaskCount()
  }

  // ===== FUNCIONALIDAD DE ELIMINAR TAREAS =====
  function initTaskDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".tasks__delete")

    deleteButtons.forEach((button) => {
      button.addEventListener("click", deleteTask)
    })
  }

  function deleteTask(e) {
    const button = e.currentTarget
    const taskItem = button.closest(".tasks__item")
    const taskId = taskItem.querySelector(".tasks__checkbox").id

    if (taskItem) {
      // Añadir clase para animación de eliminación
      taskItem.classList.add("deleting")

      // Esperar a que termine la animación antes de eliminar el elemento
      setTimeout(() => {
        // Eliminar del localStorage
        deleteTaskFromStorage(taskId)

        // Eliminar del DOM
        taskItem.remove()

        // Actualizar contador de tareas
        updateTaskCount()
      }, 300)
    }
  }

  // Actualizar contador de tareas pendientes
  function updateTaskCount() {
    const totalTasks = document.querySelectorAll(".tasks__item").length
    const completedTasks = document.querySelectorAll(".tasks__checkbox:checked").length
    const pendingTasks = totalTasks - completedTasks

    const subtitle = document.querySelector(".card__subtitle")
    if (subtitle && subtitle.textContent.includes("tareas para hoy")) {
      subtitle.textContent = `${pendingTasks} tareas para hoy`
    }
  }

  // ===== SIMULACIÓN DE DATOS DINÁMICOS =====

  // Simular actualización de clima cada 5 minutos
  function initWeatherUpdates() {
    const weatherConditions = ["Soleado", "Nublado", "Parcialmente nublado", "Lluvioso"]
    const weatherIcons = ["fa-sun", "fa-cloud", "fa-cloud-sun", "fa-cloud-rain"]
    const weatherDescriptions = ["Cielo despejado", "Completamente nublado", "Parcialmente nublado", "Lluvia ligera"]

    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * weatherConditions.length)
      const weatherIcon = document.querySelector(".weather__icon")
      const weatherCondition = document.querySelector(".weather__condition")
      const weatherDescription = document.querySelector(".weather__description")
      const weatherTemp = document.querySelector(".weather__temp")

      if (weatherIcon) {
        weatherIcon.className = "fas " + weatherIcons[randomIndex] + " weather__icon"
      }

      if (weatherCondition) {
        weatherCondition.textContent = weatherConditions[randomIndex]
      }

      if (weatherDescription) {
        weatherDescription.textContent = weatherDescriptions[randomIndex]
      }

      if (weatherTemp) {
        // Temperatura aleatoria entre 18 y 35 grados
        const newTemp = Math.floor(Math.random() * 17) + 18
        weatherTemp.textContent = newTemp + "°"
      }
    }, 300000) // Actualizar cada 5 minutos
  }

  // Iniciar simulación de datos dinámicos si estamos en un entorno de demostración
  if (window.location.search.includes("demo=true")) {
    initWeatherUpdates()
  }

  // ===== ESTILOS ADICIONALES =====

  // Añadir estilos para tareas completadas y animación de eliminación
  const style = document.createElement("style")
  style.textContent = `
    .tasks__label.completed {
      text-decoration: line-through;
      color: #999;
    }
    
    .tasks__item.deleting {
      opacity: 0;
      transform: translateX(30px);
      transition: all 0.3s ease;
    }
  `
  document.head.appendChild(style)
})
