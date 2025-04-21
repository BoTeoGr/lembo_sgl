document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los modales
    const viewModal = document.getElementById('viewModal');
    const reportModal = document.getElementById('reportModal');
    
    // Botones para cerrar modales
    const closeModalButtons = document.querySelectorAll('.modal__close');
    
    // Botones específicos para modales
    const reportButton = document.querySelector('.button--report');
    const closeReportModal = document.getElementById('closeReportModal');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    
    // Botones de acción
    const filterButton = document.querySelector('.button--filter');
    const filtersPanel = document.querySelector('.filters');
    const filtersClose = document.querySelector('.filters__close');
    
    // Gestión de tabs en el modal
    const modalTabs = document.querySelectorAll('.modal__tab');
    const modalPanels = document.querySelectorAll('.modal__panel');
    
    // Delegación de eventos para botones de acción en la tabla
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        // Verificar si es un botón de visualización o su span hijo
        const viewButton = target.closest('.table__action-button--view');
        if (viewButton) {
            handleViewButtonClick(viewButton);
            return;
        }
        
        // Verificar si es un botón de activar
        const enableButton = target.closest('.table__action-button--enable');
        if (enableButton) {
            const row = enableButton.closest('.table__row');
            updateElementStatus(row, 'active');
            return;
        }
        
        // Verificar si es un botón de desactivar
        const disableButton = target.closest('.table__action-button--disable');
        if (disableButton) {
            const row = disableButton.closest('.table__row');
            updateElementStatus(row, 'inactive');
            return;
        }
    });
    
    // Función para manejar el clic en el botón de visualización
    function handleViewButtonClick(button) {
        // Obtener datos de la fila para mostrar en el modal
        const row = button.closest('.table__row');
        if (!row) return;
        
        const id = row.querySelector('.table__cell--id').textContent;
        const name = row.querySelector('.table__cell--name').textContent;
        const statusBadge = row.querySelector('.badge');
        const statusText = statusBadge ? statusBadge.textContent : '';
        
        // Actualizar contenido del modal
        document.getElementById('viewId').textContent = id;
        document.getElementById('viewName').textContent = name;
        
        const viewStatus = document.getElementById('viewStatus');
        if (viewStatus) {
            viewStatus.textContent = statusText;
            viewStatus.className = statusBadge ? statusBadge.className : '';
        }
        
        // Mostrar modal
        viewModal.classList.add('show');
        
        // Activar el primer tab por defecto
        const activeTab = document.querySelector('.modal__tab--active');
        if (activeTab) {
            activeTab.click();
        }
    }
    
    // Cerrar modales
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Cerrar todos los modales
            viewModal.classList.remove('show');
            reportModal.classList.remove('show');
        });
    });
    
    // Modal de reporte
    if (reportButton) {
        reportButton.addEventListener('click', function() {
            reportModal.classList.add('show');
        });
    }
    
    if (closeReportModal) {
        closeReportModal.addEventListener('click', function() {
            reportModal.classList.remove('show');
        });
    }
    
    if (cancelReportBtn) {
        cancelReportBtn.addEventListener('click', function() {
            reportModal.classList.remove('show');
        });
    }
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            // Aquí iría la lógica para generar el reporte
            generateReport();
            reportModal.classList.remove('show');
        });
    }
    
    // Toggle de filtros
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            filtersPanel.classList.remove('hidden');
        });
    }
    
    if (filtersClose) {
        filtersClose.addEventListener('click', function() {
            filtersPanel.classList.add('hidden');
        });
    }
    
    // Cambio de tabs en modal
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase activa de todos los tabs
            modalTabs.forEach(t => t.classList.remove('modal__tab--active'));
            
            // Añadir clase activa al tab actual
            this.classList.add('modal__tab--active');
            
            // Obtener el panel relacionado
            const panel = document.querySelector(`.modal__panel[data-panel="${this.dataset.tab}"]`);
            
            // Ocultar todos los paneles
            modalPanels.forEach(p => p.classList.remove('modal__panel--active'));
            
            // Mostrar el panel seleccionado
            panel.classList.add('modal__panel--active');
        });
    });
    
    // También manejar los botones globales de habilitar/deshabilitar
    const bulkEnableButton = document.querySelector('.button--enable');
    const bulkDisableButton = document.querySelector('.button--disable');
    
    if (bulkEnableButton) {
        bulkEnableButton.addEventListener('click', function() {
            const selectedRows = getSelectedRows();
            if (selectedRows.length > 0) {
                updateElementStatus(selectedRows, 'active');
            } else {
                alert('Por favor, seleccione al menos una fila para habilitar.');
            }
        });
    }
    
    if (bulkDisableButton) {
        bulkDisableButton.addEventListener('click', function() {
            const selectedRows = getSelectedRows();
            if (selectedRows.length > 0) {
                updateElementStatus(selectedRows, 'inactive');
            } else {
                alert('Por favor, seleccione al menos una fila para deshabilitar.');
            }
        });
    }
    
    // Función para obtener filas seleccionadas
    function getSelectedRows() {
        return Array.from(document.querySelectorAll('.table__checkbox:checked')).map(checkbox => 
            checkbox.closest('.table__row')
        );
    }
    
    // Función para actualizar estado de elemento(s)
    function updateElementStatus(rows, newStatus) {
        if (!rows) return;
        
        // Si es una sola fila
        if (!Array.isArray(rows)) {
            updateSingleRowStatus(rows, newStatus);
            return;
        }
        
        // Si son múltiples filas
        rows.forEach(row => {
            updateSingleRowStatus(row, newStatus);
        });
    }
    
    function updateSingleRowStatus(row, newStatus) {
        const statusCell = row.querySelector('.badge');
        const actionButtons = row.querySelector('.table__cell--actions');
        
        if (newStatus === 'active') {
            statusCell.className = 'badge badge--active';
            statusCell.textContent = 'Activo';
            
            // Actualizar botones de acción reemplazando todo el HTML
            if (actionButtons) {
                actionButtons.innerHTML = `
                    <button class="table__action-button table__action-button--view">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <button class="table__action-button table__action-button--edit">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="table__action-button table__action-button--disable">
                        <span class="material-symbols-outlined">power_settings_new</span>
                    </button>
                `;
            }
        } else {
            statusCell.className = 'badge badge--inactive';
            statusCell.textContent = 'Inactivo';
            
            // Actualizar botones de acción reemplazando todo el HTML
            if (actionButtons) {
                actionButtons.innerHTML = `
                    <button class="table__action-button table__action-button--view">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <button class="table__action-button table__action-button--edit">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="table__action-button table__action-button--enable">
                        <span class="material-symbols-outlined">power_settings_new</span>
                    </button>
                `;
            }
        }
    }
    
    // Función para generar reporte
    function generateReport() {
        const format = document.getElementById('reportFormat').value;
        const includeInactive = document.getElementById('includeInactive').checked;
        const includeDetails = document.getElementById('includeDetails').checked;
        const includeSensors = document.getElementById('includeSensors')?.checked || false;
        const includeSupplies = document.getElementById('includeSupplies')?.checked || false;
        
        console.log(`Generando reporte en formato ${format}`);
        
        // Obtener datos de la tabla
        const tableRows = Array.from(document.querySelectorAll('.table__body .table__row'));
        const data = tableRows.map(row => {
            // Si no se deben incluir inactivos y la fila está inactiva, saltarla
            const status = row.querySelector('.badge').textContent.trim();
            if (!includeInactive && status === 'Inactivo') {
                return null;
            }
            
            // Obtener datos básicos
            const id = row.querySelector('.table__cell--id').textContent.trim();
            const name = row.querySelector('.table__cell--name').textContent.trim();
            const crop = row.querySelector('.table__cell--crop').textContent.trim();
            const cycle = row.querySelector('.table__cell--cycle').textContent.trim();
            const responsible = row.querySelector('.table__cell--responsible').textContent.trim();
            const investment = row.querySelector('.table__cell--investment').textContent.trim();
            const date = row.querySelector('.table__cell--date').textContent.trim();
            
            return {
                id,
                name,
                crop,
                cycle,
                responsible,
                investment,
                date,
                status
            };
        }).filter(item => item !== null); // Eliminar filas filtradas (null)
        
        // Dependiendo del formato, generar el archivo correspondiente
        if (format === 'excel' || format === 'csv') {
            downloadCSV(data, `producciones_${format === 'excel' ? 'excel' : 'csv'}.csv`);
        } else if (format === 'pdf') {
            // Aquí se implementaría la generación de PDF
            alert('La generación de PDF requiere una biblioteca externa como jsPDF.\nEn su lugar, se descargará un CSV.');
            downloadCSV(data, 'producciones.csv');
        }
        
        console.log(`Reporte generado incluyendo ${data.length} producciones`);
    }
    
    // Función para descargar datos como CSV
    function downloadCSV(data, filename) {
        // Crear encabezado
        const headers = ['ID', 'Nombre', 'Cultivo', 'Ciclo', 'Responsable', 'Inversión', 'Fecha Inicio', 'Estado'];
        
        // Convertir a CSV
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = [
                `"${row.id}"`,
                `"${row.name}"`,
                `"${row.crop}"`,
                `"${row.cycle}"`,
                `"${row.responsible}"`,
                `"${row.investment}"`,
                `"${row.date}"`,
                `"${row.status}"`
            ];
            csvContent += values.join(',') + '\n';
        });
        
        // Crear blob y descargar
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Gestión de sensores (para la pestaña sensores)
    loadSensors();
    
    // Gestión de insumos (para la pestaña insumos)
    loadSupplies();
});

// Cargar datos de sensores para la pestaña correspondiente
function loadSensors() {
    const sensoresContent = document.getElementById('sensoresContent');
    if (!sensoresContent) return;
    
    // Datos de ejemplo (en una aplicación real vendrían de un API)
    const sensoresData = [
        {
            id: 'SENS-001',
            nombre: 'Sensor de Temperatura',
            tipo: 'temperature',
            valor: '24.5°C',
            estado: 'active',
            ubicacion: 'Sector Norte',
            ultimaLectura: '15/04/2023 14:30',
            bateria: '87%'
        },
        {
            id: 'SENS-002',
            nombre: 'Sensor de Humedad',
            tipo: 'humidity',
            valor: '65%',
            estado: 'active',
            ubicacion: 'Sector Central',
            ultimaLectura: '15/04/2023 14:32',
            bateria: '92%'
        },
        {
            id: 'SENS-003',
            nombre: 'Sensor de Luz',
            tipo: 'light',
            valor: '12,350 lux',
            estado: 'warning',
            ubicacion: 'Sector Este',
            ultimaLectura: '15/04/2023 14:28',
            bateria: '45%'
        },
        {
            id: 'SENS-004',
            nombre: 'Sensor de Suelo',
            tipo: 'soil',
            valor: '32% humedad',
            estado: 'error',
            ubicacion: 'Sector Sur',
            ultimaLectura: '15/04/2023 13:45',
            bateria: '23%'
        }
    ];
    
    // Limpiar contenido previo
    sensoresContent.innerHTML = '';
    
    // Añadir cada sensor
    sensoresData.forEach(sensor => {
        const sensorHTML = `
            <div class="sensor-card-modal sensor-card-modal--${sensor.tipo}">
                <div class="sensor-card-modal__header">
                    <div class="sensor-card-modal__title-container">
                        <h3 class="sensor-card-modal__title">${sensor.nombre}</h3>
                        <span class="sensor-card-modal__type">${getTipoSensor(sensor.tipo)}</span>
                    </div>
                    <span class="sensor-card-modal__status sensor-card-modal__status--${sensor.estado}">
                        ${getEstadoSensor(sensor.estado)}
                    </span>
                </div>
                <div class="sensor-card-modal__content">
                    <div class="sensor-card-modal__reading ${sensor.estado === 'error' ? 'sensor-card-modal__reading--alert' : ''}">
                        <span class="sensor-card-modal__reading-label">Lectura actual</span>
                        <div>
                            <span class="sensor-card-modal__reading-value">${sensor.valor}</span>
                        </div>
                    </div>
                    <div class="sensor-card-modal__battery">
                        <span class="material-symbols-outlined">battery_full</span>
                        ${sensor.bateria}
                    </div>
                    <div class="sensor-card-modal__brand">
                        <span class="material-symbols-outlined">memory</span>
                        AgriTech LT-${sensor.id.split('-')[1]}
                    </div>
                </div>
                <div class="sensor-card-modal__footer">
                    <div class="sensor-card-modal__timestamp">
                        <span class="material-symbols-outlined">schedule</span>
                        ${sensor.ultimaLectura}
                    </div>
                    <div class="sensor-card-modal__location">
                        <span class="material-symbols-outlined">location_on</span>
                        ${sensor.ubicacion}
                    </div>
                </div>
            </div>
        `;
        sensoresContent.innerHTML += sensorHTML;
    });
}

// Cargar datos de insumos para la pestaña correspondiente
function loadSupplies() {
    const insumosContent = document.getElementById('insumosContent');
    if (!insumosContent) return;
    
    // Datos de ejemplo (en una aplicación real vendrían de un API)
    const insumosData = [
        {
            id: 'INS-001',
            nombre: 'Fertilizante NPK',
            tipo: 'fertilizer',
            stock: 75,
            cantidadTotal: '500 kg',
            fechaUltimoUso: '12/04/2023',
            ultimoUsuario: {
                nombre: 'Carlos Rodríguez',
                rol: 'Técnico Agrícola',
                foto: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            usos: [
                { fecha: '12/04/2023', cantidad: '25 kg' },
                { fecha: '05/04/2023', cantidad: '30 kg' },
                { fecha: '28/03/2023', cantidad: '20 kg' }
            ]
        },
        {
            id: 'INS-002',
            nombre: 'Herbicida Natural',
            tipo: 'pesticide',
            stock: 45,
            cantidadTotal: '200 L',
            fechaUltimoUso: '10/04/2023',
            ultimoUsuario: {
                nombre: 'María García',
                rol: 'Supervisora',
                foto: 'https://randomuser.me/api/portraits/women/65.jpg'
            },
            usos: [
                { fecha: '10/04/2023', cantidad: '15 L' },
                { fecha: '01/04/2023', cantidad: '25 L' },
                { fecha: '20/03/2023', cantidad: '20 L' }
            ]
        },
        {
            id: 'INS-003',
            nombre: 'Semillas Premium',
            tipo: 'seed',
            stock: 90,
            cantidadTotal: '750 kg',
            fechaUltimoUso: '05/04/2023',
            ultimoUsuario: {
                nombre: 'Juan Pérez',
                rol: 'Responsable',
                foto: 'https://randomuser.me/api/portraits/men/45.jpg'
            },
            usos: [
                { fecha: '05/04/2023', cantidad: '50 kg' },
                { fecha: '15/03/2023', cantidad: '25 kg' }
            ]
        },
        {
            id: 'INS-004',
            nombre: 'Fungicida Orgánico',
            tipo: 'pesticide',
            stock: 30,
            cantidadTotal: '100 L',
            fechaUltimoUso: '02/04/2023',
            ultimoUsuario: {
                nombre: 'Ana Martínez',
                rol: 'Asistente',
                foto: 'https://randomuser.me/api/portraits/women/22.jpg'
            },
            usos: [
                { fecha: '02/04/2023', cantidad: '10 L' },
                { fecha: '25/03/2023', cantidad: '15 L' },
                { fecha: '18/03/2023', cantidad: '20 L' }
            ]
        }
    ];
    
    // Limpiar contenido previo
    insumosContent.innerHTML = '';
    
    // Añadir cada insumo
    insumosData.forEach(insumo => {
        // Determinar clase para la barra de progreso
        let progressClass = 'high';
        if (insumo.stock < 50) progressClass = 'medium';
        if (insumo.stock < 30) progressClass = 'low';
        
        // Generar HTML para los usos
        let usosHTML = '';
        insumo.usos.forEach(uso => {
            usosHTML += `
                <div class="supply-card-modal__usage-item">
                    <span>${uso.fecha}</span>
                    <span>${uso.cantidad}</span>
                </div>
            `;
        });
        
        const insumoHTML = `
            <div class="supply-card-modal supply-card-modal--${insumo.tipo}">
                <div class="supply-card-modal__header">
                    <h3 class="supply-card-modal__title">${insumo.nombre}</h3>
                    <span class="supply-card-modal__type">${getTipoInsumo(insumo.tipo)}</span>
                    <span class="supply-card-modal__quantity">${insumo.cantidadTotal}</span>
                </div>
                <div class="supply-card-modal__content">
                    <div class="supply-card-modal__stock">
                        <h4 class="supply-card-modal__stock-title">Stock Disponible</h4>
                        <div class="supply-card-modal__progress">
                            <div class="supply-card-modal__progress-bar supply-card-modal__progress-bar--${progressClass}" style="width: ${insumo.stock}%"></div>
                        </div>
                        <div class="supply-card-modal__stock-info">${insumo.stock}%</div>
                    </div>
                    <div class="supply-card-modal__usage">
                        <h4 class="supply-card-modal__usage-title">Últimos Usos</h4>
                        <div class="supply-card-modal__usage-items">
                            ${usosHTML}
                        </div>
                    </div>
                </div>
                <div class="supply-card-modal__footer">
                    <div class="supply-card-modal__user">
                        <div class="supply-card-modal__user-photo">
                            <img src="${insumo.ultimoUsuario.foto}" alt="${insumo.ultimoUsuario.nombre}">
                        </div>
                        <div class="supply-card-modal__user-info">
                            <div class="supply-card-modal__user-name">${insumo.ultimoUsuario.nombre}</div>
                            <div class="supply-card-modal__user-role">${insumo.ultimoUsuario.rol}</div>
                        </div>
                    </div>
                    <div class="supply-card-modal__date">
                        <span class="material-symbols-outlined">event</span>
                        ${insumo.fechaUltimoUso}
                    </div>
                </div>
            </div>
        `;
        insumosContent.innerHTML += insumoHTML;
    });
}

// Funciones auxiliares
function getTipoSensor(tipo) {
    const tipos = {
        'temperature': 'Temperatura',
        'humidity': 'Humedad',
        'light': 'Luminosidad',
        'soil': 'Suelo'
    };
    return tipos[tipo] || tipo;
}

function getEstadoSensor(estado) {
    const estados = {
        'active': 'Activo',
        'warning': 'Advertencia',
        'error': 'Error'
    };
    return estados[estado] || estado;
}

function getTipoInsumo(tipo) {
    const tipos = {
        'fertilizer': 'Fertilizante',
        'pesticide': 'Pesticida',
        'seed': 'Semilla'
    };
    return tipos[tipo] || tipo;
}
