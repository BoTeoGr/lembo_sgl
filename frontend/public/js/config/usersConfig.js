// Configuración estructurada para la tabla y filtros de usuarios
export const usersConfig = {
  table: {
    columns: [
      { id: 'checkbox', type: 'checkbox' },
      { id: 'id', label: 'ID', sortable: true },
      { id: 'nombre', label: 'Nombre', sortable: true },
      { id: 'rol', label: 'Rol', sortable: true },
      { id: 'telefono', label: 'Teléfono', sortable: false },
      { id: 'estado', label: 'Estado', sortable: true },
      { id: 'actions', label: 'Acciones' }
    ],
    itemsPerPage: 10,
    sortBy: 'id',
    sortDirection: 'asc'
  },
  filters: {
    estado: [
      { value: '', label: 'Todos' },
      { value: 'Activo', label: 'Activo' },
      { value: 'Inactivo', label: 'Inactivo' }
    ],
    rol: [
      { value: '', label: 'Todos' },
      { value: 'Administrador', label: 'Administrador' },
      { value: 'Usuario', label: 'Usuario' }
    ]
  }
};

let users = [];

export async function fetchUsersFromAPI() {
  try {
    const response = await fetch('http://localhost:5000/usuarios');
    if (!response.ok) throw new Error('Error al obtener usuarios de la API');
    const data = await response.json();
    const usuariosArr = Array.isArray(data) ? data : (data.usuarios || []);
    users = usuariosArr.map(user => ({
      id: user.id || user.numero_documento || '',
      nombre: user.nombre || '',
      correo: user.correo || user.email || '',
      tipoDocumento: user.tipoDocumento || user.tipo_doc || user.tipo_documento || '',
      numeroDocumento: user.numeroDocumento || user.num_doc || user.numero_doc || user.numero_documento || '',
      telefono: user.telefono || user.celular || '',
      rol: user.rol || '',
      estado: (user.estado && (user.estado.toLowerCase() === 'habilitado' || user.estado.toLowerCase() === 'activo')) ? 'Activo' : 'Inactivo',
      imagen: user.imagen || '',
    }));
    return users;
  } catch (e) {
    console.warn('Fallo la carga desde la API, usando datos locales:', e.message);
    return users;
  }
}

export function renderUsersTable(filteredUsers = users) {
  const tbody = document.querySelector('.table__body');
  if (!tbody) return;
  tbody.innerHTML = filteredUsers.map(user => `
    <tr class="table__row">
      <td class="table__cell table__cell--checkbox">
        <input type="checkbox" class="table__checkbox" />
      </td>
      <td class="table__cell table__cell--id">${user.id}</td>
      <td class="table__cell table__cell--name">${user.nombre}</td>
      <td class="table__cell table__cell--role">${user.rol}</td>
      <td class="table__cell table__cell--phone">${user.telefono}</td>
      <td class="table__cell table__cell--status">
        <span class="badge badge--${user.estado === 'Activo' ? 'active' : 'inactive'}">${user.estado}</span>
      </td>
      <td class="table__cell table__cell--actions">
        <button class="table__action-button table__action-button--view"><span class="material-symbols-outlined">visibility</span></button>
        <button class="table__action-button table__action-button--edit"><span class="material-symbols-outlined">edit</span></button>
        <button class="table__action-button table__action-button--${user.estado === 'Activo' ? 'disable' : 'enable'}"><span class="material-symbols-outlined">power_settings_new</span></button>
      </td>
    </tr>
  `).join('');
}

export async function updateUserStatusAPI(ids, status) {
  const estadoDB = status === 'Activo' ? 'habilitado' : 'deshabilitado';
  for (const id of ids) {
    await fetch(`http://localhost:5000/usuarios/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: estadoDB })
    });
  }
}

export function updateUserStatus(ids, status) {
  users = users.map(user => ids.includes(user.id) ? { ...user, estado: status } : user);
}

export function filterUsers({ search = '', rol = '', estado = '' }) {
  return users.filter(user => {
    const matchSearch = search === '' || user.nombre.toLowerCase().includes(search.toLowerCase()) || String(user.id).toLowerCase().includes(search.toLowerCase());
    const matchRol = rol === '' || user.rol === rol;
    const matchEstado = estado === '' || user.estado === estado;
    return matchSearch && matchRol && matchEstado;
  });
}

export function resetUsers() {
  users = [];
}
