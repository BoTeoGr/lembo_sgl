// Código básico para cambiar entre pestañas
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.create-tab');
    const contents = document.querySelectorAll('.create-tab-content');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const saveBtn = document.getElementById('saveBtn');
    let currentTab = 0;

    // Dropdown para sensores
    const sensorSelect = document.getElementById('sensorSelect');
    const addSensorBtn = document.getElementById('addSensorBtn');
    
    // Dropdown para insumos
    const insumoSelect = document.getElementById('insumoSelect');
    const addInsumoBtn = document.getElementById('addInsumoBtn');
    
    // Función para mostrar/ocultar el dropdown de sensores
    addSensorBtn.addEventListener('click', function() {
        sensorSelect.classList.toggle('open');
    });

    // Función para mostrar/ocultar el dropdown de insumos
    addInsumoBtn.addEventListener('click', function() {
        insumoSelect.classList.toggle('open');
    });

    // Cerrar los dropdowns al hacer clic fuera de ellos
    document.addEventListener('click', function(event) {
        // Cerrar dropdown de sensores
        if (!sensorSelect.contains(event.target) && 
            !addSensorBtn.contains(event.target) && 
            sensorSelect.classList.contains('open')) {
            sensorSelect.classList.remove('open');
        }
        
        // Cerrar dropdown de insumos
        if (!insumoSelect.contains(event.target) && 
            !addInsumoBtn.contains(event.target) && 
            insumoSelect.classList.contains('open')) {
            insumoSelect.classList.remove('open');
        }
    });

    // Filtrar sensores al escribir en el campo de búsqueda
    sensorSelect.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const sensorItems = document.querySelectorAll('#sensorSelect option');
        
        sensorItems.forEach(item => {
            const sensorName = item.textContent.toLowerCase();
            
            if (sensorName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Filtrar insumos al escribir en el campo de búsqueda
    insumoSelect.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const insumoItems = document.querySelectorAll('#insumoSelect option');
        
        insumoItems.forEach(item => {
            const insumoName = item.textContent.toLowerCase();
            
            if (insumoName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Actualizar contador y añadir/eliminar sensores al seleccionarlos
    sensorSelect.addEventListener('change', function() {
        // Si no hay selección, no hacemos nada
        if (this.value === '') return;
        
        const sensorId = this.value;
        const sensorOption = this.options[this.selectedIndex];
        const sensorName = sensorOption.textContent.split(' - ')[0];
        const sensorsGrid = document.querySelector('.tab-sensors .sensors-grid');
        const sensorHelper = this.closest('.form-field').querySelector('.form-field__helper');
        
        // Verificar si el sensor ya está en el grid
        const existingSensor = sensorsGrid.querySelector(`.sensor-card[data-id="${sensorId}"]`);
        
        if (existingSensor) {
            // Si ya existe, lo eliminamos
            existingSensor.remove();
        } else {
            // Si no existe, lo añadimos
            // Mapeo de IDs a colores y datos
            const sensorData = {
                sensor1: {type: 'Precipitación', color: 'blue', fabricante: 'RainTech', precision: '±0.2mm', rango: '0-500mm/h'},
                sensor2: {type: 'Velocidad', color: 'yellow', fabricante: 'WindMax', precision: '±0.5m/s', rango: '0-160km/h'},
                sensor3: {type: 'Radiación', color: 'green', fabricante: 'SunSense', precision: '±0.1 UV', rango: '0-16 UV'},
                sensor4: {type: 'Humedad', color: 'blue', fabricante: 'AgroTech', precision: '±2%', rango: '0-100%'},
                sensor5: {type: 'Temperatura', color: 'yellow', fabricante: 'TempSense', precision: '±0.5°C', rango: '-30 a +60°C'},
                sensor6: {type: 'pH', color: 'green', fabricante: 'SoilTech', precision: '±0.1 pH', rango: '0-14 pH'}
            };
            
            const sensorInfo = sensorData[sensorId];
            
            // Crear la tarjeta HTML
            const cardHtml = `
                <div class="sensor-card sensor-card--${sensorInfo.color}" data-id="${sensorId}">
                    <div class="sensor-card__header">
                        <div class="sensor-card__title">${sensorName}</div>
                        <div class="sensor-card__type">${sensorInfo.type}</div>
                    </div>
                    <div class="sensor-card__content">
                        <div class="sensor-card__item">
                            <span class="sensor-card__label">Fabricante:</span>
                            <span class="sensor-card__value">${sensorInfo.fabricante}</span>
                        </div>
                        <div class="sensor-card__item">
                            <span class="sensor-card__label">Precisión:</span>
                            <span class="sensor-card__value">${sensorInfo.precision}</span>
                        </div>
                        <div class="sensor-card__item">
                            <span class="sensor-card__label">Rango:</span>
                            <span class="sensor-card__value">${sensorInfo.rango}</span>
                        </div>
                    </div>
                    <button class="sensor-card__remove" data-sensor-id="${sensorId}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;
            
            // Añadir la tarjeta al grid
            sensorsGrid.insertAdjacentHTML('beforeend', cardHtml);
            
            // Añadir evento al botón de eliminar
            const newCard = sensorsGrid.querySelector(`.sensor-card[data-id="${sensorId}"]`);
            newCard.querySelector('.sensor-card__remove').addEventListener('click', function() {
                newCard.remove();
                updateSensorCounter();
            });
        }
        
        // Actualizar contador
        updateSensorCounter();
        
        // Restablecer el select a la opción predeterminada
        this.value = '';
    });

    // Actualizar contador y añadir/eliminar insumos al seleccionarlos
    insumoSelect.addEventListener('change', function() {
        // Si no hay selección, no hacemos nada
        if (this.value === '') return;
        
        const insumoId = this.value;
        const insumoOption = this.options[this.selectedIndex];
        const insumoName = insumoOption.textContent.split(' - ')[0];
        const insumosGrid = document.querySelector('.tab-insumos .sensors-grid');
        const insumoHelper = this.closest('.form-field').querySelector('.form-field__helper');
        
        // Verificar si el insumo ya está en el grid
        const existingInsumo = insumosGrid.querySelector(`.insumo-card[data-id="${insumoId}"]`);
        
        if (existingInsumo) {
            // Si ya existe, lo eliminamos
            existingInsumo.remove();
        } else {
            // Si no existe, lo añadimos
            // Mapeo de IDs a colores y datos
            const insumoData = {
                insumo1: {type: 'Semilla', color: 'green', proveedor: 'AgroSemillas', precio: '$1,500', unidad: 'kg', precioNum: 1500},
                insumo2: {type: 'Fertilizante', color: 'blue', proveedor: 'EcoAgro', precio: '$650', unidad: 'kg', precioNum: 650},
                insumo3: {type: 'Protección', color: 'yellow', proveedor: 'AgroChem', precio: '$1,800', unidad: 'lt', precioNum: 1800},
                insumo4: {type: 'Estimulante', color: 'blue', proveedor: 'BioGrow', precio: '$2,100', unidad: 'lt', precioNum: 2100},
                insumo5: {type: 'Semilla', color: 'green', proveedor: 'AgroSemillas S.A.', precio: '$1,200', unidad: 'kg', precioNum: 1200},
                insumo6: {type: 'Protección', color: 'yellow', proveedor: 'AgroGuard', precio: '$2,300', unidad: 'lt', precioNum: 2300}
            };
            
            const insumoInfo = insumoData[insumoId];
            const cantidad = 25; // Valor predeterminado
            
            // Calcular costo total
            const costoTotal = insumoInfo.precioNum * cantidad;
            
            // Crear la tarjeta HTML
            const cardHtml = `
                <div class="insumo-card insumo-card--${insumoInfo.color}" data-id="${insumoId}">
                    <div class="insumo-card__header">
                        <div>
                            <div class="insumo-card__title">${insumoName}</div>
                            <div class="insumo-card__type">
                                <span class="insumo-tag">${insumoInfo.type}</span>
                            </div>
                        </div>
                        <div class="insumo-card__price">
                            ${insumoInfo.precio}
                            <span class="insumo-card__price-unit">/${insumoInfo.unidad}</span>
                        </div>
                    </div>
                    <div class="insumo-card__content">
                        <div class="insumo-card__item">
                            <span class="insumo-card__label">Proveedor:</span>
                            <span class="insumo-card__value">${insumoInfo.proveedor}</span>
                        </div>
                        <div class="insumo-card__item">
                            <span class="insumo-card__label">Cantidad:</span>
                            <div class="insumo-card__value">
                                <input type="number" value="${cantidad}" min="1" style="width: 3.75rem;" 
                                       class="insumo-cantidad" data-precio="${insumoInfo.precioNum}" 
                                       data-insumo-id="${insumoId}" /> ${insumoInfo.unidad}
                            </div>
                        </div>
                        <div class="insumo-card__item">
                            <span class="insumo-card__label">Costo Total:</span>
                            <span class="insumo-card__value insumo-costo-total" id="costo-${insumoId}">$${costoTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    <button class="insumo-card__remove" data-insumo-id="${insumoId}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;
            
            // Añadir la tarjeta al grid
            insumosGrid.insertAdjacentHTML('beforeend', cardHtml);
            
            // Añadir evento al botón de eliminar
            const newCard = insumosGrid.querySelector(`.insumo-card[data-id="${insumoId}"]`);
            newCard.querySelector('.insumo-card__remove').addEventListener('click', function() {
                newCard.remove();
                updateInsumoCounter();
            });
            
            // Añadir evento para actualizar el costo total
            const cantidadInput = newCard.querySelector('.insumo-cantidad');
            cantidadInput.addEventListener('input', function() {
                const cantidad = parseFloat(this.value) || 0;
                const precio = parseFloat(this.getAttribute('data-precio'));
                const insumoId = this.getAttribute('data-insumo-id');
                const costoTotal = cantidad * precio;
                
                // Actualizar el costo total
                document.getElementById(`costo-${insumoId}`).textContent = '$' + costoTotal.toLocaleString();
            });
        }
        
        // Actualizar contador
        updateInsumoCounter();
        
        // Restablecer el select a la opción predeterminada
        this.value = '';
    });

    // Función para actualizar el contador de sensores seleccionados
    function updateSensorCounter() {
        const sensorsGrid = document.querySelector('.tab-sensors .sensors-grid');
        const sensorHelper = document.querySelector('#sensorSelect').closest('.form-field').querySelector('.form-field__helper');
        const selectedSensors = sensorsGrid.querySelectorAll('.sensor-card').length;
        sensorHelper.textContent = `${selectedSensors} sensores seleccionados`;
    }

    // Función para actualizar el contador de insumos seleccionados
    function updateInsumoCounter() {
        const insumosGrid = document.querySelector('.tab-insumos .sensors-grid');
        const insumoHelper = document.querySelector('#insumoSelect').closest('.form-field').querySelector('.form-field__helper');
        const selectedInsumos = insumosGrid.querySelectorAll('.insumo-card').length;
        insumoHelper.textContent = `${selectedInsumos} insumos asignados`;
    }

    // Inicializar sensores predeterminados
    function initDefaultSensors() {
        const sensorsGrid = document.querySelector('.tab-sensors .sensors-grid');
        
        // Datos predeterminados para algunos sensores
        const defaultSensors = [
            {id: 'sensor3', name: 'Sensor UV', type: 'Radiación', color: 'green', fabricante: 'SunSense', precision: '±0.1 UV', rango: '0-16 UV'},
            {id: 'sensor4', name: 'Sensor de Humedad', type: 'Humedad', color: 'blue', fabricante: 'AgroTech', precision: '±2%', rango: '0-100%'},
            {id: 'sensor5', name: 'Sensor de Temperatura', type: 'Temperatura', color: 'yellow', fabricante: 'TempSense', precision: '±0.5°C', rango: '-30 a +60°C'}
        ];
        
        // Añadir tarjetas predeterminadas
        defaultSensors.forEach(sensor => {
            const cardHtml = `
                <div class="sensor-card sensor-card--${sensor.color}" data-id="${sensor.id}">
                    <div class="sensor-card__header">
                        <div class="sensor-card__title">${sensor.name}</div>
                        <div class="sensor-card__type">${sensor.type}</div>
                    </div>
                    <div class="sensor-card__content">
                        <div class="sensor-card__item">
                            <span class="sensor-card__label">Fabricante:</span>
                            <span class="sensor-card__value">${sensor.fabricante}</span>
                        </div>
                        <div class="sensor-card__item">
                            <span class="sensor-card__label">Precisión:</span>
                            <span class="sensor-card__value">${sensor.precision}</span>
                        </div>
                        <div class="sensor-card__item">
                            <span class="sensor-card__label">Rango:</span>
                            <span class="sensor-card__value">${sensor.rango}</span>
                        </div>
                    </div>
                    <button class="sensor-card__remove" data-sensor-id="${sensor.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;
            sensorsGrid.insertAdjacentHTML('beforeend', cardHtml);
        });
        
        // Añadir eventos a los botones de eliminar
        document.querySelectorAll('.sensor-card__remove').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.sensor-card').remove();
                updateSensorCounter();
            });
        });
        
        updateSensorCounter();
    }

    // Inicializar insumos predeterminados
    function initDefaultInsumos() {
        const insumosGrid = document.querySelector('.tab-insumos .sensors-grid');
        
        // Datos predeterminados para algunos insumos
        const defaultInsumos = [
            {id: 'insumo2', name: 'Fertilizante NPK Orgánico', type: 'Fertilizante', color: 'blue', proveedor: 'EcoAgro', precio: '$650', unidad: 'kg', precioNum: 650, cantidad: 40},
            {id: 'insumo5', name: 'Semilla Premium Maíz Orgánico', type: 'Semilla', color: 'green', proveedor: 'AgroSemillas S.A.', precio: '$1,200', unidad: 'kg', precioNum: 1200, cantidad: 25}
        ];
        
        // Añadir tarjetas predeterminadas
        defaultInsumos.forEach(insumo => {
            const costoTotal = insumo.precioNum * insumo.cantidad;
            const cardHtml = `
                <div class="insumo-card insumo-card--${insumo.color}" data-id="${insumo.id}">
                    <div class="insumo-card__header">
                        <div>
                            <div class="insumo-card__title">${insumo.name}</div>
                            <div class="insumo-card__type">
                                <span class="insumo-tag">${insumo.type}</span>
                            </div>
                        </div>
                        <div class="insumo-card__price">
                            ${insumo.precio}
                            <span class="insumo-card__price-unit">/${insumo.unidad}</span>
                        </div>
                    </div>
                    <div class="insumo-card__content">
                        <div class="insumo-card__item">
                            <span class="insumo-card__label">Proveedor:</span>
                            <span class="insumo-card__value">${insumo.proveedor}</span>
                        </div>
                        <div class="insumo-card__item">
                            <span class="insumo-card__label">Cantidad:</span>
                            <div class="insumo-card__value">
                                <input type="number" value="${insumo.cantidad}" min="1" style="width: 3.75rem;" 
                                       class="insumo-cantidad" data-precio="${insumo.precioNum}" 
                                       data-insumo-id="${insumo.id}" /> ${insumo.unidad}
                            </div>
                        </div>
                        <div class="insumo-card__item">
                            <span class="insumo-card__label">Costo Total:</span>
                            <span class="insumo-card__value insumo-costo-total" id="costo-${insumo.id}">$${costoTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    <button class="insumo-card__remove" data-insumo-id="${insumo.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;
            insumosGrid.insertAdjacentHTML('beforeend', cardHtml);
        });
        
        // Añadir eventos a los botones de eliminar e inputs
        document.querySelectorAll('.insumo-card__remove').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.insumo-card').remove();
                updateInsumoCounter();
            });
        });
        
        document.querySelectorAll('.insumo-cantidad').forEach(input => {
            input.addEventListener('input', function() {
                const cantidad = parseFloat(this.value) || 0;
                const precio = parseFloat(this.getAttribute('data-precio'));
                const insumoId = this.getAttribute('data-insumo-id');
                const costoTotal = cantidad * precio;
                
                // Actualizar el costo total
                document.getElementById(`costo-${insumoId}`).textContent = '$' + costoTotal.toLocaleString();
            });
        });
        
        updateInsumoCounter();
    }

    // Cargar datos de la producción a editar desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productionId = urlParams.get('id');
    
    // Aquí normalmente cargarías los datos de la producción desde tu API o almacenamiento
    // Por ahora los datos están precargados en el HTML
    
    // Función para mostrar la pestaña actual
    function showTab(index) {
        tabs.forEach(tab => tab.classList.remove('create-tab--active'));
        contents.forEach(content => content.classList.add('hidden'));
        
        tabs[index].classList.add('create-tab--active');
        contents[index].classList.remove('hidden');
        
        // Actualizar estado de los botones
        prevBtn.style.display = index === 0 ? 'none' : 'flex';
        nextBtn.textContent = index === tabs.length - 1 ? 'Guardar' : 'Siguiente';
        nextBtn.innerHTML = index === tabs.length - 1 ? 
            'Guardar <span class="material-symbols-outlined button__icon">check_circle</span>' : 
            'Siguiente <span class="material-symbols-outlined button__icon">arrow_forward</span>';
        
        currentTab = index;
    }
    
    // Configurar eventos para navegar entre pestañas
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => showTab(index));
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentTab < tabs.length - 1) {
            showTab(currentTab + 1);
        } else {
            // Aquí iría el código para guardar los cambios
            alert('Guardando cambios...');
            window.location.href = 'listar-producciones.html';
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentTab > 0) {
            showTab(currentTab - 1);
        }
    });
    
    saveDraftBtn.addEventListener('click', () => {
        alert('Guardando borrador...');
    });
    
    saveBtn.addEventListener('click', () => {
        alert('Guardando cambios...');
        window.location.href = 'listar-producciones.html';
    });
    
    // Inicializar primera pestaña
    showTab(0);

    // Inicializar sensores e insumos predeterminados
    initDefaultSensors();
    initDefaultInsumos();
});