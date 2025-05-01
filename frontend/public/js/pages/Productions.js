document.addEventListener("DOMContentLoaded", () => {
	setupCharts();
	setupDropdowns();
	setupModal();
	setupNavigationButtons();
	setupAutoRefresh();
	setupInvestmentCharts();
	setupTabs();
	setupFilters();
	setupPagination();
});

// Manejo del botón para mostrar/ocultar cards
document.addEventListener("DOMContentLoaded", () => {
	const toggleCardsBtn = document.getElementById("toggleCardsBtn");
	const cardsContainer = document.getElementById("cardsContainer");
	const buttonText = toggleCardsBtn.querySelector(".button__text");

	toggleCardsBtn.addEventListener("click", () => {
		const isVisible = cardsContainer.style.display === "block";
		cardsContainer.style.display = isVisible ? "none" : "block";
		buttonText.textContent = isVisible
			? "Mostrar Widgets con Informacion Adicional"
			: "Ocultar Widgests con Informacion Adicional";
		toggleCardsBtn.classList.toggle("active");
	});
});

// Configuración de gráficos
function setupCharts() {
	// Datos de ejemplo para los gráficos
	const dates = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
	const humidityData = [62, 64, 65, 68, 67, 65, 68];
	const temperatureData = [22, 23, 24, 25, 24, 23, 24];

	// Configuración común para los gráficos
	const commonOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				mode: "index",
				intersect: false,
				backgroundColor: "rgba(255, 255, 255, 0.9)",
				titleColor: "#1e293b",
				bodyColor: "#1e293b",
				borderColor: "#e2e8f0",
				borderWidth: 1,
				padding: 10,
				cornerRadius: 4,
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
				callbacks: {
					label: (context) => {
						let label = "";
						if (context.dataset.label) {
							label += context.dataset.label + ": ";
						}
						if (context.parsed.y !== null) {
							label +=
								context.parsed.y +
								(context.dataset.label.includes("Humedad") ? "%" : "°C");
						}
						return label;
					},
				},
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
			},
			y: {
				beginAtZero: false,
				grid: {
					color: "rgba(226, 232, 240, 0.5)",
				},
			},
		},
		elements: {
			line: {
				tension: 0.4,
			},
			point: {
				radius: 3,
				hoverRadius: 5,
			},
		},
	};

	// Gráfico de humedad en el dashboard
	const humidityCtx = document.getElementById("humidityChart");
	if (humidityCtx) {
		const humidityChart = new Chart(humidityCtx.getContext("2d"), {
			type: "line",
			data: {
				labels: dates,
				datasets: [
					{
						label: "Humedad",
						data: humidityData,
						backgroundColor: "rgba(59, 130, 246, 0.2)",
						borderColor: "rgba(59, 130, 246, 1)",
						borderWidth: 2,
						fill: true,
					},
				],
			},
			options: {
				...commonOptions,
				scales: {
					...commonOptions.scales,
					y: {
						...commonOptions.scales.y,
						min: Math.min(...humidityData) - 5,
						max: Math.max(...humidityData) + 5,
					},
				},
			},
		});
	}

	// Gráfico de temperatura en el dashboard
	const temperatureCtx = document.getElementById("temperatureChart");
	if (temperatureCtx) {
		const temperatureChart = new Chart(temperatureCtx.getContext("2d"), {
			type: "line",
			data: {
				labels: dates,
				datasets: [
					{
						label: "Temperatura",
						data: temperatureData,
						backgroundColor: "rgba(249, 115, 22, 0.2)",
						borderColor: "rgba(249, 115, 22, 1)",
						borderWidth: 2,
						fill: true,
					},
				],
			},
			options: {
				...commonOptions,
				scales: {
					...commonOptions.scales,
					y: {
						...commonOptions.scales.y,
						min: Math.min(...temperatureData) - 2,
						max: Math.max(...temperatureData) + 2,
					},
				},
			},
		});
	}

	// Gráficos para el modal
	const modalHumidityCtx = document.getElementById("modalHumidityChart");
	const modalTemperatureCtx = document.getElementById("modalTemperatureChart");

	if (modalHumidityCtx && modalTemperatureCtx) {
		// Gráfico de humedad en el modal
		const modalHumidityChart = new Chart(modalHumidityCtx.getContext("2d"), {
			type: "line",
			data: {
				labels: dates,
				datasets: [
					{
						label: "Humedad",
						data: humidityData,
						backgroundColor: "rgba(59, 130, 246, 0.2)",
						borderColor: "rgba(59, 130, 246, 1)",
						borderWidth: 2,
						fill: true,
					},
				],
			},
			options: {
				...commonOptions,
				scales: {
					...commonOptions.scales,
					y: {
						...commonOptions.scales.y,
						min: Math.min(...humidityData) - 5,
						max: Math.max(...humidityData) + 5,
					},
				},
			},
		});

		// Gráfico de temperatura en el modal
		const modalTemperatureChart = new Chart(
			modalTemperatureCtx.getContext("2d"),
			{
				type: "line",
				data: {
					labels: dates,
					datasets: [
						{
							label: "Temperatura",
							data: temperatureData,
							backgroundColor: "rgba(249, 115, 22, 0.2)",
							borderColor: "rgba(249, 115, 22, 1)",
							borderWidth: 2,
							fill: true,
						},
					],
				},
				options: {
					...commonOptions,
					scales: {
						...commonOptions.scales,
						y: {
							...commonOptions.scales.y,
							min: Math.min(...temperatureData) - 2,
							max: Math.max(...temperatureData) + 2,
						},
					},
				},
			}
		);
	}

	// Investment Trend Chart
	const investmentTrendCtx = document.getElementById("investmentTrendChart");
	if (investmentTrendCtx) {
		const months = [
			"Ene",
			"Feb",
			"Mar",
			"Abr",
			"May",
			"Jun",
			"Jul",
			"Ago",
			"Sep",
			"Oct",
			"Nov",
			"Dic",
		];
		const investmentData = [
			85000, 82000, 78000, 75000, 80000, 85000, 90000, 95000, 100000, 110000,
			115000, 125000,
		];

		const investmentTrendChart = new Chart(investmentTrendCtx, {
			type: "line",
			data: {
				labels: months,
				datasets: [
					{
						label: "Inversión Total",
						data: investmentData,
						backgroundColor: "rgba(79, 70, 229, 0.2)",
						borderColor: "rgba(79, 70, 229, 1)",
						borderWidth: 2,
						fill: true,
					},
				],
			},
			options: {
				...commonOptions,
				scales: {
					...commonOptions.scales,
					y: {
						...commonOptions.scales.y,
						min: Math.min(...investmentData) * 0.9,
						max: Math.max(...investmentData) * 1.1,
						ticks: {
							callback: (value) => "$" + value.toLocaleString(),
						},
					},
				},
				plugins: {
					...commonOptions.plugins,
					tooltip: {
						...commonOptions.plugins.tooltip,
						callbacks: {
							label: (context) => {
								let label = "";
								if (context.dataset.label) {
									label += context.dataset.label + ": ";
								}
								if (context.parsed.y !== null) {
									label += "$" + context.parsed.y.toLocaleString();
								}
								return label;
							},
						},
					},
				},
			},
		});
	}
}

// Configuración de los gráficos de inversión
function setupInvestmentCharts() {
	// Gráfico de distribución de inversión (pie chart)
	const pieCtx = document.getElementById("investmentPieChart");
	if (pieCtx) {
		// Destruir el gráfico existente si existe
		const existingPieChart = Chart.getChart(pieCtx);
		if (existingPieChart) {
			existingPieChart.destroy();
		}

		new Chart(pieCtx, {
			type: "pie",
			data: {
				labels: ["Maíz", "Frijol", "Tomate", "Papa", "Trigo", "Otros"],
				datasets: [
					{
						data: [11, 8, 19, 12, 15, 35],
						backgroundColor: [
							"#3b82f6",
							"#22c55e",
							"#f59e0b",
							"#ef4444",
							"#8b5cf6",
							"#94a3b8",
						],
						borderWidth: 1,
						borderColor: "#ffffff",
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: "right",
						labels: {
							padding: 20,
							usePointStyle: true,
							font: {
								size: 12,
							},
						},
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const value = context.parsed;
								const total = context.dataset.data.reduce((a, b) => a + b, 0);
								const percentage = Math.round((value / total) * 100);
								const label = context.label;
								return `${label}: ${percentage}% (${value.toLocaleString()} millones)`;
							},
						},
					},
				},
				layout: {
					padding: {
						left: 20,
						right: 20,
						top: 20,
						bottom: 20,
					},
				},
			},
		});
	}

	// Gráfico de tendencia de inversión (line chart)
	const trendCtx = document.getElementById("investmentTrendChart");
	if (trendCtx) {
		// Destruir el gráfico existente si existe
		const existingTrendChart = Chart.getChart(trendCtx);
		if (existingTrendChart) {
			existingTrendChart.destroy();
		}

		const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
		const investmentData = [
			8000000, 7500000, 4000000, 3500000, 6000000, 4500000,
		];

		new Chart(trendCtx, {
			type: "line",
			data: {
				labels: months,
				datasets: [
					{
						label: "Inversión Mensual",
						data: investmentData,
						borderColor: "#4f46e5",
						backgroundColor: "rgba(79, 70, 229, 0.1)",
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
						display: false,
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return `$${context.parsed.y.toLocaleString()}`;
							},
						},
					},
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: function (value) {
								return "$" + value.toLocaleString();
							},
						},
					},
				},
			},
		});
	}
}

// Configuración de menús desplegables
function setupDropdowns() {
	// Menú de usuario
	const userMenuBtn = document.getElementById("userMenuBtn");
	const userDropdown = document.getElementById("userDropdown");

	if (userMenuBtn && userDropdown) {
		userMenuBtn.addEventListener("click", () => {
			userDropdown.style.display =
				userDropdown.style.display === "block" ? "none" : "block";
		});
	}

	// Cerrar menús al hacer clic fuera
	document.addEventListener("click", () => {
		document.querySelectorAll(".dropdown-menu").forEach((menu) => {
			menu.style.display = "none";
		});
	});
}

// Configuración del modal y pestañas
function setupModal() {
	const modal = document.getElementById("detailsModal");
	const viewDetailsBtns = document.querySelectorAll(
		".dropdown-menu__item--view, .production-details-btn"
	);
	const tabBtns = document.querySelectorAll(".modal__tab-btn");
	const closeModalBtns = document.querySelectorAll(
		".modal__close, [data-close]"
	);

	// Cerrar todos los modales
	function closeAllModals() {
		document.querySelectorAll(".modal").forEach((modal) => {
			modal.style.display = "none";
		});
	}

	// Setup para cerrar modales
	closeModalBtns.forEach((btn) => {
		btn.addEventListener("click", function () {
			const modalId = this.getAttribute("data-close");
			if (modalId) {
				document.getElementById(modalId).style.display = "none";
			} else {
				// Si no tiene data-close, cerrar el modal padre
				this.closest(".modal").style.display = "none";
			}
		});
	});

	if (modal) {
		// Abrir modal de detalles
		viewDetailsBtns.forEach((btn) => {
			btn.addEventListener("click", function (e) {
				e.preventDefault();
				modal.style.display = "flex";

				// Cargar datos según el ID
				const productionId = this.getAttribute("data-id");
				loadProductionDetails(productionId);
			});
		});

		// Cambiar pestañas
		tabBtns.forEach((btn) => {
			btn.addEventListener("click", function () {
				const tabId = this.getAttribute("data-tab");

				// Desactivar todas las pestañas
				tabBtns.forEach((b) => b.classList.remove("modal__tab-btn--active"));
				document.querySelectorAll(".tab-content").forEach((content) => {
					content.classList.remove("tab-content--active");
				});

				// Activar la pestaña seleccionada
				this.classList.add("modal__tab-btn--active");
				document.getElementById(tabId).classList.add("tab-content--active");
			});
		});
	}
}

// Modal handling
document.addEventListener("DOMContentLoaded", function () {
	const modal = document.getElementById("modalVisualizarCultivo");
	const closeModal = document.getElementById("closeModalVisualizarCultivo");
	const viewButtons = document.querySelectorAll(".table__action-button--view");

	// Chart instances storage
	let chartInstances = {
		inversion: null,
		humedad: null,
		temperatura: null,
	};

	// Datos de ejemplo para las gráficas
	const últimosMeses = ["Ene", "Feb", "Mar", "Abr", "May"];
	const humedadData = [65, 68, 62, 70, 68];
	const temperaturaData = [22, 23, 25, 24, 24];
	const inversionData = [1200000, 1500000, 1800000, 2100000, 2400000];

	// Cerrar modal y limpiar gráficos
	function closeModalAndCleanup() {
		modal.style.display = "none";
		// Destruir todas las instancias de gráficos
		Object.values(chartInstances).forEach((chart) => {
			if (chart) {
				chart.destroy();
			}
		});
		// Resetear el objeto de instancias
		chartInstances = {
			inversion: null,
			humedad: null,
			temperatura: null,
		};
	}

	// Cerrar modal
	closeModal.addEventListener("click", closeModalAndCleanup);

	// Cerrar modal al hacer clic fuera
	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			closeModalAndCleanup();
		}
	});

	// Abrir modal y cargar datos
	viewButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const row = button.closest("tr");
			const cultivoData = {
				id: row.querySelector("td:nth-child(2)").textContent,
				nombre: row.querySelector("td:nth-child(3)").textContent,
				responsable: row.querySelector("td:nth-child(4)").textContent,
				inversion: row.querySelector("td:nth-child(6)").textContent,
				progreso: row.querySelector(".progress__text").textContent,
				estado: row.querySelector(".badge--status").textContent.trim(),
			};

			loadCultivoData(cultivoData);
			modal.style.display = "flex";
		});
	});

	function loadCultivoData(data) {
		// Cargar datos básicos
		document.getElementById("cultivoId").textContent = data.id;
		document.getElementById("cultivoNombre").textContent = data.nombre;
		document.getElementById("cultivoResponsable").textContent =
			data.responsable;
		document.getElementById("cultivoRol").textContent = "Supervisor de cultivo";
		document.getElementById("cultivoInversion").textContent = data.inversion;

		// Actualizar barra de progreso
		const progressBar = document.querySelector(
			".cultivo-progress .progress__bar"
		);
		const progressText = document.getElementById("cultivoProgreso");
		const progress = parseInt(data.progreso);
		progressBar.style.width = progress + "%";
		progressText.textContent = progress + "%";

		// Destruir gráficos existentes antes de crear nuevos
		Object.values(chartInstances).forEach((chart) => {
			if (chart) {
				chart.destroy();
			}
		});

		// Crear gráfica de inversión
		const ctxInversion = document
			.getElementById("inversionChart")
			.getContext("2d");
		chartInstances.inversion = new Chart(ctxInversion, {
			type: "line",
			data: {
				labels: últimosMeses,
				datasets: [
					{
						label: "Inversión Mensual",
						data: inversionData,
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
						display: false,
					},
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: function (value) {
								return "$" + value.toLocaleString();
							},
						},
					},
				},
			},
		});

		// Crear gráfica de humedad
		const ctxHumedad = document.getElementById("humedadChart").getContext("2d");
		chartInstances.humedad = new Chart(ctxHumedad, {
			type: "line",
			data: {
				labels: últimosMeses,
				datasets: [
					{
						label: "Humedad (%)",
						data: humedadData,
						borderColor: "#50e5f9",
						backgroundColor: "rgba(80, 229, 249, 0.1)",
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
						display: false,
					},
				},
			},
		});

		// Crear gráfica de temperatura
		const ctxTemperatura = document
			.getElementById("temperaturaChart")
			.getContext("2d");
		chartInstances.temperatura = new Chart(ctxTemperatura, {
			type: "line",
			data: {
				labels: últimosMeses,
				datasets: [
					{
						label: "Temperatura (°C)",
						data: temperaturaData,
						borderColor: "#93d074",
						backgroundColor: "rgba(147, 208, 116, 0.1)",
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
						display: false,
					},
				},
			},
		});
	}
});

// Configuración de los botones de navegación
function setupNavigationButtons() {
	// Botones para abrir modales
	const navButtons = {
		productionsBtn: "productionsModal",
		cropsBtn: "cropsModal",
		sensorsBtn: "sensorsModal",
		inputsBtn: "inputsModal",
		responsablesBtn: "responsablesModal",
	};

	// Agregar event listeners a cada botón
	for (const [buttonId, modalId] of Object.entries(navButtons)) {
		const button = document.getElementById(buttonId);
		const modal = document.getElementById(modalId);

		if (button && modal) {
			button.addEventListener("click", () => {
				// Cerrar otros modales
				document.querySelectorAll(".modal").forEach((m) => {
					m.style.display = "none";
				});

				// Mostrar el modal correspondiente
				modal.style.display = "flex";
			});
		}
	}

	// Cerrar modales al hacer clic fuera del contenido
	const modals = document.querySelectorAll(".modal");
	modals.forEach((modal) => {
		modal.addEventListener("click", function (e) {
			if (e.target === this) {
				this.style.display = "none";
			}
		});
	});
}

// Configuración de actualizaciones automáticas
function setupAutoRefresh() {
	const updateIntervals = {
		humidity: 300000, // 5 minutos
		temperature: 120000, // 2 minutos
		production: 600000, // 10 minutos
	};

	// Actualizar sensores
	setInterval(() => {
		updateSensorData("humidity", generateRandomData(60, 75));
		updateProgressBars();
	}, updateIntervals.humidity);

	setInterval(() => {
		updateSensorData("temperature", generateRandomData(20, 28));
		updateProgressBars();
	}, updateIntervals.temperature);

	// Primera actualización inmediata
	updateSensorData("humidity", generateRandomData(60, 75));
	updateSensorData("temperature", generateRandomData(20, 28));
	updateProgressBars();
}

// Generar datos aleatorios para simulación
function generateRandomData(min, max) {
	return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

// Actualizar datos de sensores
function updateSensorData(type, value) {
	const elements = {
		humidity: {
			value: document.querySelector(".humidity-card .sensor__value"),
			timestamp: document.querySelector(".humidity-card .sensor__timestamp"),
		},
		temperature: {
			value: document.querySelector(".temperature-card .sensor__value"),
			timestamp: document.querySelector(".temperature-card .sensor__timestamp"),
		},
	};

	const sensor = elements[type];

	if (sensor.value) {
		sensor.value.textContent = `${value}${type === "humidity" ? "%" : "°C"}`;
		sensor.value.classList.add("sensor__value--updated");
		setTimeout(
			() => sensor.value.classList.remove("sensor__value--updated"),
			1000
		);
	}

	if (sensor.timestamp) {
		sensor.timestamp.textContent = "Última actualización: hace 1 min";
	}

	// Actualizar gráficos
	updateCharts(type, value);
}

// Actualizar barras de progreso
function updateProgressBars() {
	document.querySelectorAll(".progress__bar").forEach((bar) => {
		const currentWidth = parseInt(bar.style.width);
		const randomChange = Math.random() * 10 - 5; // Cambio entre -5 y +5
		let newWidth = Math.max(0, Math.min(100, currentWidth + randomChange));

		bar.style.width = `${newWidth}%`;

		// Actualizar color según el valor
		if (newWidth > 80) {
			bar.classList.add("progress__bar--warning");
		} else {
			bar.classList.remove("progress__bar--warning");
		}
	});
}

// Actualizar gráficos con nuevos datos
function updateCharts(type, value) {
	const chartId = type === "humidity" ? "humidityChart" : "temperatureChart";
	const chart = Chart.getChart(chartId);

	if (chart) {
		const newData = chart.data.datasets[0].data;
		newData.shift();
		newData.push(value);
		chart.update("none"); // Actualizar sin animación
	}
}

// Cargar detalles de producción (simulado)
function loadProductionDetails(id) {
	// Aquí se cargarían los datos reales desde una API
	console.log(`Cargando detalles para la producción ID: ${id}`);

	// Datos de ejemplo
	const productions = {
		1: {
			nombre: "Maíz Temporada 2023",
			cultivo: "Maíz",
			fechaInicio: "15/03/2023",
			fechaFin: "15/08/2023",
			estado: "Activo",
			progreso: 75,
		},
		2: {
			nombre: "Tomate Invernadero",
			cultivo: "Tomate",
			fechaInicio: "02/04/2023",
			fechaFin: "30/07/2023",
			estado: "Activo",
			progreso: 45,
		},
		3: {
			nombre: "Trigo Temporada 2022",
			cultivo: "Trigo",
			fechaInicio: "05/10/2022",
			fechaFin: "15/03/2023",
			estado: "Completado",
			progreso: 100,
		},
	};

	const production = productions[id];

	if (production) {
		// Actualizar datos en el modal
		document.getElementById(
			"modalTitle"
		).textContent = `Detalles: ${production.nombre}`;
		document.getElementById("produccionNombre").textContent = production.nombre;
		document.getElementById("produccionCultivo").textContent =
			production.cultivo;
		document.getElementById("produccionFechaInicio").textContent =
			production.fechaInicio;
		document.getElementById("produccionFechaFin").textContent =
			production.fechaFin;
		document.getElementById("produccionEstado").textContent = production.estado;

		// Actualizar barra de progreso
		const progressBar = document.querySelector("#general .progress__bar");
		const progressText = document.querySelector("#general .progress__text");

		if (progressBar && progressText) {
			progressBar.style.width = `${production.progreso}%`;
			progressText.textContent = `${production.progreso}%`;
		}
	}

	// Add financial data
	const financialData = {
		1: {
			inversion: 56250,
			costos: 35000,
			gananciasEstimadas: 85000,
			roi: 51.1,
		},
		2: {
			inversion: 37500,
			costos: 22000,
			gananciasEstimadas: 65000,
			roi: 73.3,
		},
		3: {
			inversion: 31250,
			costos: 18000,
			gananciasEstimadas: 45000,
			roi: 44.0,
		},
	};

	const financial = financialData[id];

	if (financial) {
		// Check if financial elements exist in the modal
		const inversionElement = document.getElementById("produccionInversion");
		const costosElement = document.getElementById("produccionCostos");
		const gananciasElement = document.getElementById("produccionGanancias");
		const roiElement = document.getElementById("produccionROI");

		if (inversionElement)
			inversionElement.textContent = "$" + financial.inversion.toLocaleString();
		if (costosElement)
			costosElement.textContent = "$" + financial.costos.toLocaleString();
		if (gananciasElement)
			gananciasElement.textContent =
				"$" + financial.gananciasEstimadas.toLocaleString();
		if (roiElement) roiElement.textContent = financial.roi.toFixed(1) + "%";
	}
}

// Manejo de tabs
function setupTabs() {
	const tabButtons = document.querySelectorAll(".tab-button");
	const tabContents = document.querySelectorAll(".tab-content");

	tabButtons.forEach((button) => {
		button.addEventListener("click", () => {
			// Remover clase active de todos los botones y contenidos
			tabButtons.forEach((btn) => btn.classList.remove("active"));
			tabContents.forEach((content) => (content.style.display = "none"));

			// Activar el tab seleccionado
			button.classList.add("active");
			const tabId = button.getAttribute("data-tab");
			const tabContent = document.getElementById(tabId);
			if (tabContent) {
				tabContent.style.display = "block";
			}
		});
	});
}

// Configuración de filtros
function setupFilters() {
	const filterButton = document.querySelector('.button--filter');
	const filtersPanel = document.querySelector('.filters');
	const closeButton = document.querySelector('.filters__close');
	const searchInput = document.querySelector('.filters__search');
	const stateSelect = document.querySelector('.filters__select[placeholder="Estado"]');
	const cycleSelect = document.querySelector('.filters__select[placeholder="Ciclo"]');
	const clearButton = document.querySelector('.button--clear');
	const tableRows = document.querySelectorAll('.table__row');

	// Mostrar/ocultar panel de filtros
	filterButton?.addEventListener('click', () => {
		filtersPanel?.classList.toggle('hidden');
	});

	closeButton?.addEventListener('click', () => {
		filtersPanel?.classList.add('hidden');
	});

	// Función de filtrado
	function filterTable() {
		const searchTerm = searchInput?.value.toLowerCase();
		const selectedState = stateSelect?.value;
		const selectedCycle = cycleSelect?.value;

		tableRows.forEach(row => {
			const id = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase();
			const name = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase();
			const state = row.querySelector('.badge--status')?.textContent.trim();
			
			// Aplicar filtros
			const matchesSearch = !searchTerm || 
				id.includes(searchTerm) || 
				name.includes(searchTerm);
				
			const matchesState = !selectedState || 
				state.includes(selectedState);
				
			const matchesCycle = !selectedCycle; // Implementar lógica de ciclo si es necesario

			// Mostrar u ocultar fila según filtros
			row.style.display = (matchesSearch && matchesState && matchesCycle) 
				? '' 
				: 'none';
		});

		updatePaginationAfterFilter();
	}

	// Event listeners para filtros
	searchInput?.addEventListener('input', filterTable);
	stateSelect?.addEventListener('change', filterTable);
	cycleSelect?.addEventListener('change', filterTable);

	// Limpiar filtros
	clearButton?.addEventListener('click', () => {
		if (searchInput) searchInput.value = '';
		if (stateSelect) stateSelect.value = '';
		if (cycleSelect) cycleSelect.value = '';
		tableRows.forEach(row => row.style.display = '');
		updatePaginationAfterFilter();
	});
}

function setupPagination() {
    const itemsPerPage = 10;
    let currentPage = 1;
    const tableRows = document.querySelectorAll('.table__row');
    const totalItems = tableRows.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    function updatePaginationInfo() {
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        document.querySelector('.pagination__current-page').textContent = currentPage;
        document.querySelector('.pagination__total-pages').textContent = totalPages;
        document.querySelector('.pagination__items-per-page').textContent = endItem;
        document.querySelector('.pagination__total-items').textContent = totalItems;
    }

    function updatePaginationControls() {
        const prevBtn = document.querySelector('.pagination__button--prev');
        const nextBtn = document.querySelector('.pagination__button--next');
        const pageButtons = Array.from(document.querySelectorAll('.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)'));

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        pageButtons.forEach((button, index) => {
            const pageNum = index + 1;
            button.classList.toggle('pagination__button--active', pageNum === currentPage);
            button.style.display = pageNum <= totalPages ? '' : 'none';
        });
    }

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        tableRows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });

        currentPage = page;
        updatePaginationInfo();
        updatePaginationControls();
    }

    // Event Listeners para botones de paginación
    document.querySelector('.pagination__button--prev').addEventListener('click', () => {
        if (currentPage > 1) showPage(currentPage - 1);
    });

    document.querySelector('.pagination__button--next').addEventListener('click', () => {
        if (currentPage < totalPages) showPage(currentPage + 1);
    });

    document.querySelectorAll('.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)').forEach((button, index) => {
        button.addEventListener('click', () => showPage(index + 1));
    });

    // Inicializar la primera página
    showPage(1);
}

// Función para actualizar la paginación después de filtrar
function updatePaginationAfterFilter() {
    const visibleRows = document.querySelectorAll('.table__row:not([style*="display: none"])');
    const totalItems = visibleRows.length;
    
    document.querySelector('.pagination__total-items').textContent = totalItems;
    document.querySelector('.pagination__total-pages').textContent = Math.ceil(totalItems / 10);
    
    // Resetear a la primera página
    const paginationEvent = new Event('paginationReset');
    document.dispatchEvent(paginationEvent);
}
