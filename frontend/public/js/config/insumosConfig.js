// Configuración de columnas para la tabla de insumos
export const insumosConfig = {
  table: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'cantidad', label: 'Cantidad' },
      { key: 'estado', label: 'Estado' }
    ],
    itemsPerPage: 10
  }
};
