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

import { users as usersRaw } from '../../data/usersData.js';
let users = [...usersRaw];

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

export function updateUserStatus(ids, status) {
  users = users.map(user => ids.includes(user.id) ? { ...user, estado: status } : user);
}

export function filterUsers({ search = '', rol = '', estado = '' }) {
  return users.filter(user => {
    const matchSearch = search === '' || user.nombre.toLowerCase().includes(search.toLowerCase()) || user.id.toLowerCase().includes(search.toLowerCase());
    const matchRol = rol === '' || user.rol === rol;
    const matchEstado = estado === '' || user.estado === estado;
    return matchSearch && matchRol && matchEstado;
  });
}

export function resetUsers() {
  users = [...usersRaw];
}
