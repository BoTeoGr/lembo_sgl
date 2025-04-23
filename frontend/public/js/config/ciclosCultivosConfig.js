// Configuración de la tabla de ciclos de cultivos
export const ciclosCultivosConfig = {
  table: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'periodoInicio', label: 'Periodo Inicio' },
      { key: 'periodoFinal', label: 'Periodo Final' },
      { key: 'estado', label: 'Estado' }
    ],
    itemsPerPage: 10
  }
};
