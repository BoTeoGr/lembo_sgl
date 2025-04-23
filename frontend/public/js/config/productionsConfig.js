export const productionsConfig = {
    tableColumns: [
        { key: 'id', label: 'ID', class: 'table__cell--id' },
        { key: 'name', label: 'Nombre', class: 'table__cell--name' },
        { key: 'crop', label: 'Cultivo', class: 'table__cell--crop' },
        { key: 'cycle', label: 'Ciclo', class: 'table__cell--cycle' },
        { key: 'responsible', label: 'Responsable', class: 'table__cell--responsible' },
        { key: 'investment', label: 'Inversión', class: 'table__cell--investment' },
        { key: 'startDate', label: 'Fecha Inicio', class: 'table__cell--date' },
        { key: 'status', label: 'Estado', class: 'table__cell--status' }
    ],

    viewModalTabs: [
        { id: 'general', label: 'General' },
        { id: 'sensores', label: 'Sensores' },
        { id: 'insumos', label: 'Insumos' }
    ],

    viewModalSections: {
        general: [
            {
                title: 'Información General',
                icon: 'info',
                fields: [
                    { id: 'viewId', label: 'ID', key: 'id' },
                    { id: 'viewName', label: 'Nombre', key: 'name' },
                    { id: 'viewStatus', label: 'Estado', key: 'status' },
                    { id: 'viewCropType', label: 'Tipo de Cultivo', key: 'crop' },
                    { id: 'viewArea', label: 'Área Total', key: 'area' }
                ]
            },
            {
                title: 'Personal',
                icon: 'group',
                fields: [
                    { id: 'viewResponsible', label: 'Responsable', key: 'responsible' },
                    { id: 'viewSupervisor', label: 'Supervisor', key: 'supervisor' },
                    { id: 'viewTechnician', label: 'Técnico', key: 'technician' },
                    { id: 'viewWorkers', label: 'Personal Asignado', key: 'workers' }
                ]
            },
            {
                title: 'Fechas',
                icon: 'calendar_month',
                fields: [
                    { id: 'viewStartDate', label: 'Inicio', key: 'startDate' },
                    { id: 'viewEndDate', label: 'Fin esperado', key: 'endDate' },
                    { id: 'viewDuration', label: 'Duración Total', key: 'duration' },
                    { id: 'viewDaysLeft', label: 'Días Restantes', key: 'daysLeft' }
                ]
            },
            {
                title: 'Financiero',
                icon: 'attach_money',
                fields: [
                    { id: 'viewInvestment', label: 'Inversión', key: 'investment' },
                    { id: 'viewExpectedReturn', label: 'Retorno esperado', key: 'expectedReturn' },
                    { id: 'viewROI', label: 'ROI estimado', key: 'roi' },
                    { id: 'viewCostPerHectare', label: 'Costo por Hectárea', key: 'costPerHectare' }
                ]
            }
        ]
    }
};