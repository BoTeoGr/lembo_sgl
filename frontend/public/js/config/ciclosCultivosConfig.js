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

let ciclosCultivo = [];

export async function fetchCiclosCultivoFromAPI() {
  try {
    const response = await fetch('http://localhost:5000/ciclo_cultivo');
    if (!response.ok) throw new Error('Error al obtener ciclos de cultivo de la API');
    const data = await response.json();
    const arr = Array.isArray(data) ? data : (data.ciclos || data.ciclosCultivo || []);
    ciclosCultivo = arr.map(ciclo => ({
      id: ciclo.id || ciclo.ciclo_id || '',
      nombre: ciclo.nombre || ciclo.nombre_ciclo || '',
      descripcion: ciclo.descripcion || '',
      novedades: ciclo.novedades || '',
      imagen: ciclo.imagen || '',
      periodoInicio: ciclo.periodo_inicio || ciclo.periodoInicio || '',
      periodoFinal: ciclo.periodo_final || ciclo.periodoFinal || '',
      estado: (ciclo.estado && (ciclo.estado.toLowerCase() === 'habilitado' || ciclo.estado.toLowerCase() === 'activo')) ? 'Activo' : 'Inactivo'
    }));
    return ciclosCultivo;
  } catch (e) {
    console.warn('Fallo la carga desde la API, usando datos locales:', e.message);
    return ciclosCultivo;
  }
}

export function renderCiclosCultivoTable(filtered = ciclosCultivo) {
  const tbody = document.querySelector('.table__body');
  if (!tbody) return;
  tbody.innerHTML = filtered.map(ciclo => `
    <tr class="table__row">
      <td class="table__cell table__cell--checkbox">
        <input type="checkbox" class="table__checkbox" data-id="${ciclo.id}" />
      </td>
      <td class="table__cell table__cell--id">${ciclo.id}</td>
      <td class="table__cell table__cell--nombre">${ciclo.nombre}</td>
      <td class="table__cell table__cell--periodo-inicio">${ciclo.periodoInicio}</td>
      <td class="table__cell table__cell--periodo-final">${ciclo.periodoFinal}</td>
      <td class="table__cell table__cell--estado">
        <span class="badge badge--${ciclo.estado === 'Activo' ? 'active' : 'inactive'}">${ciclo.estado}</span>
      </td>
      <td class="table__cell table__cell--actions">
        <button class="table__action-button table__action-button--view" title="Ver"><span class="material-symbols-outlined">visibility</span></button>
        <button class="table__action-button table__action-button--edit" title="Editar"><span class="material-symbols-outlined">edit</span></button>
        <button class="table__action-button table__action-button--${ciclo.estado === 'Activo' ? 'disable' : 'enable'}" data-id="${ciclo.id}" title="${ciclo.estado === 'Activo' ? 'Desactivar' : 'Activar'}"><span class="material-symbols-outlined">power_settings_new</span></button>
      </td>
    </tr>
  `).join('');
}

export async function updateCicloCultivoEstadoAPI(ids, status) {
  // status puede ser 'Activo' o 'Inactivo' desde el front
  // Backend espera 'habilitado' o 'deshabilitado'
  const estadoDB = status === 'Activo' ? 'habilitado' : 'deshabilitado';
  for (const id of ids) {
    await fetch(`http://localhost:5000/ciclo_cultivo/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: estadoDB })
    });
  }
}
