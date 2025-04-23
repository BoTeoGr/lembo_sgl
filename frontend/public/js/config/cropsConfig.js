export const cropsConfig = {
    table: {
        columns: [
            { id: 'name', label: 'Nombre', sortable: true },
            { id: 'type', label: 'Tipo', sortable: true },
            { id: 'area', label: 'Tamaño', sortable: true },
            { id: 'location', label: 'Ubicación', sortable: true },
            { id: 'status', label: 'Estado', sortable: true },
        ],
        itemsPerPage: 10,
        sortBy: 'id',
        sortDirection: 'asc'
    }
};
