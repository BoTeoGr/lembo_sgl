export const sensorsConfig = {
    table: {
        columns: [
            { id: 'checkbox', type: 'checkbox' },
            { id: 'id', label: 'ID', sortable: true },
            { id: 'name', label: 'Nombre', sortable: true },
            { id: 'type', label: 'Tipo', sortable: true },
            { id: 'location', label: 'Ubicación', sortable: true },
            { id: 'lastReading', label: 'Última Lectura', sortable: true },
            { id: 'status', label: 'Estado', sortable: true },
            { id: 'scanInterval', label: 'Intervalo de Lectura', sortable: true },
            { id: 'actions', label: 'Acciones' }
        ],
        itemsPerPage: 10,
        sortBy: 'id',
        sortDirection: 'asc'
    },
    filters: {
        status: [
            { value: '', label: 'Todos' },
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
            { value: 'Mantenimiento', label: 'En Mantenimiento' }
        ],
        types: [
            { value: '', label: 'Todos' },
            { value: 'Temperatura', label: 'Temperatura' },
            { value: 'Humedad', label: 'Humedad' },
            { value: 'Luz', label: 'Luz' },
            { value: 'Suelo', label: 'Suelo' },
            { value: 'CO2', label: 'CO2' },
            { value: 'Presión', label: 'Presión Atmosférica' },
            { value: 'Viento', label: 'Viento' },
            { value: 'Lluvia', label: 'Lluvia' }
        ],
        locations: [
            { value: '', label: 'Todas' },
            { value: 'Invernadero', label: 'Invernadero' },
            { value: 'Campo', label: 'Campo' },
            { value: 'Almacén', label: 'Almacén' }
        ]
    },
    report: {
        formats: [
            { value: 'excel', label: 'Excel (.xlsx)' },
            { value: 'pdf', label: 'PDF' },
            { value: 'csv', label: 'CSV' }
        ],
        options: [
            { id: 'includeInactive', label: 'Sensores inactivos' },
            { id: 'includeReadings', label: 'Historial de lecturas' },
            { id: 'includeMaintenance', label: 'Registro de mantenimiento' },
            { id: 'includeAlerts', label: 'Alertas y eventos' }
        ]
    },
    modal: {
        tabs: [
            { id: 'general', label: 'General' },
            { id: 'lecturas', label: 'Lecturas' },
            { id: 'mantenimiento', label: 'Mantenimiento' }
        ]
    }
};