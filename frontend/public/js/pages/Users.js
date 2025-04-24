import { renderUsersTable, updateUserStatus, filterUsers, resetUsers, usersConfig, fetchUsersFromAPI, updateUserStatusAPI } from '../config/usersConfig.js';

document.addEventListener('DOMContentLoaded', async () => {
  let currentPage = 1;
  const itemsPerPage = usersConfig.table.itemsPerPage || 10;
  let filteredUsers = null;
  let allUsers = await fetchUsersFromAPI();

  // Filtros
  const searchInput = document.querySelector('.filters__search');
  const rolSelect = document.querySelector('select[placeholder="Rol"]');
  const estadoSelect = document.querySelector('select[placeholder="Estado"]');
  const clearBtn = document.querySelector('.button--clear');

  function getFilteredUsers() {
    const search = searchInput.value;
    const rol = rolSelect.value;
    const estado = estadoSelect.value;
    return allUsers.filter(user => {
      const matchSearch = search === '' || user.nombre.toLowerCase().includes(search.toLowerCase()) || String(user.id).toLowerCase().includes(search.toLowerCase());
      const matchRol = rol === '' || user.rol === rol;
      const matchEstado = estado === '' || user.estado === estado;
      return matchSearch && matchRol && matchEstado;
    });
  }

  function renderPaginatedTable(usersList) {
    const total = usersList.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, total);
    const pageUsers = usersList.slice(startIdx, endIdx);
    renderUsersTable(pageUsers);
    renderPaginationInfo(startIdx, endIdx, total, totalPages);
    renderPaginationControls(totalPages);
    updateSelectionCount();
  }

  function renderPaginationInfo(startIdx, endIdx, total, totalPages) {
    const currentPageSpan = document.querySelector('.pagination__current-page');
    const itemsPerPageSpan = document.querySelector('.pagination__items-per-page');
    const totalItemsSpan = document.querySelector('.pagination__total-items');
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (itemsPerPageSpan) itemsPerPageSpan.textContent = endIdx;
    if (totalItemsSpan) totalItemsSpan.textContent = total;
  }

  function renderPaginationControls(totalPages) {
    const prevBtn = document.querySelector('.pagination__button--prev');
    const nextBtn = document.querySelector('.pagination__button--next');
    const pageBtns = document.querySelectorAll('.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPaginatedTable(filteredUsers); } };
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPaginatedTable(filteredUsers); } };
    // Actualiza botones de página
    pageBtns.forEach((btn, i) => {
      const pageNum = i + 1;
      btn.classList.toggle('pagination__button--active', pageNum === currentPage);
      btn.style.display = (pageNum <= totalPages) ? '' : 'none';
      btn.onclick = () => { if (currentPage !== pageNum) { currentPage = pageNum; renderPaginatedTable(filteredUsers); } };
    });
  }

  function applyFilters() {
    filteredUsers = getFilteredUsers();
    currentPage = 1;
    renderPaginatedTable(filteredUsers);
  }

  searchInput.addEventListener('input', applyFilters);
  rolSelect.addEventListener('change', applyFilters);
  estadoSelect.addEventListener('change', applyFilters);
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    rolSelect.value = '';
    estadoSelect.value = '';
    resetUsers();
    filteredUsers = getFilteredUsers();
    currentPage = 1;
    renderPaginatedTable(filteredUsers);
  });

  // Inicializar datos
  filteredUsers = getFilteredUsers();
  renderPaginatedTable(filteredUsers);

  // Acciones de habilitar/deshabilitar (por fila)
  document.querySelector('.table__body').addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const row = btn.closest('tr');
    const id = row.querySelector('.table__cell--id').textContent;
    if (btn.classList.contains('table__action-button--view')) {
      const usuario = allUsers.find(u => String(u.id) === String(id));
      if (usuario) showUsuarioModal(usuario);
      return;
    } else if (btn.classList.contains('table__action-button--edit')) {
      window.location.href = `actualizar-usuario.html?id=${id}`;
    } else if (btn.classList.contains('table__action-button--enable')) {
      await updateUserStatusAPI([id], 'Activo');
      allUsers = await fetchUsersFromAPI();
      filteredUsers = getFilteredUsers();
      renderPaginatedTable(filteredUsers);
    } else if (btn.classList.contains('table__action-button--disable')) {
      await updateUserStatusAPI([id], 'Inactivo');
      allUsers = await fetchUsersFromAPI();
      filteredUsers = getFilteredUsers();
      renderPaginatedTable(filteredUsers);
    }
  });

  // Acciones de habilitar/deshabilitar masivo
  const enableBtn = document.querySelector('.button--enable');
  const disableBtn = document.querySelector('.button--disable');

  function getSelectedIds() {
    return Array.from(document.querySelectorAll('.table__checkbox:checked'))
      .map(cb => cb.closest('tr').querySelector('.table__cell--id').textContent);
  }

  function updateSelectionCount() {
    const total = document.querySelectorAll('.table__checkbox').length;
    const selected = document.querySelectorAll('.table__checkbox:checked').length;
    document.querySelector('.actions-bar__count--selected').textContent = selected;
    document.querySelector('.actions-bar__count--total').textContent = total;
    // Actualiza ambos checkboxes de cabecera según selección
    const header = document.querySelector('.table__checkbox-header');
    const bar = document.querySelector('.actions-bar__checkbox');
    if (header) header.checked = (selected === total && total > 0);
    if (bar) bar.checked = (selected === total && total > 0);
  }

  document.querySelector('.table__body').addEventListener('change', updateSelectionCount);

  enableBtn.addEventListener('click', async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;
    await updateUserStatusAPI(ids, 'Activo');
    allUsers = await fetchUsersFromAPI();
    filteredUsers = getFilteredUsers();
    renderPaginatedTable(filteredUsers);
    document.querySelector('.actions-bar__checkbox').checked = false;
    document.querySelector('.table__checkbox-header').checked = false;
    updateSelectionCount();
  });
  disableBtn.addEventListener('click', async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;
    await updateUserStatusAPI(ids, 'Inactivo');
    allUsers = await fetchUsersFromAPI();
    filteredUsers = getFilteredUsers();
    renderPaginatedTable(filteredUsers);
    document.querySelector('.actions-bar__checkbox').checked = false;
    document.querySelector('.table__checkbox-header').checked = false;
    updateSelectionCount();
  });

  // Selección masiva (actions-bar)
  document.querySelector('.actions-bar__checkbox').addEventListener('change', function() {
    const checked = this.checked;
    document.querySelectorAll('.table__checkbox').forEach(cb => { cb.checked = checked; });
    // Sincroniza el checkbox-header
    const thHeader = document.querySelector('.table__checkbox-header');
    if (thHeader) thHeader.checked = checked;
    updateSelectionCount();
  });

  // Selección masiva desde el th (checkbox-header)
  const thHeader = document.querySelector('.table__checkbox-header');
  if (thHeader) {
    thHeader.addEventListener('change', function() {
      const checked = this.checked;
      document.querySelectorAll('.table__checkbox').forEach(cb => { cb.checked = checked; });
      // Sincroniza el de actions-bar
      const bar = document.querySelector('.actions-bar__checkbox');
      if (bar) bar.checked = checked;
      updateSelectionCount();
    });
  }

  function updateUserStatus(ids, status) {
    allUsers = allUsers.map(user => ids.includes(user.id) ? { ...user, estado: status } : user);
  }

  // --- Modal Visualizar Usuario ---
  function showUsuarioModal(usuario) {
    document.getElementById('modalUsuarioId').textContent = usuario.id || '';
    document.getElementById('modalUsuarioNombre').textContent = usuario.nombre || '';
    document.getElementById('modalUsuarioCorreo').textContent = usuario.correo || usuario.email || '-';
    document.getElementById('modalUsuarioTipoDoc').textContent = usuario.tipoDocumento;
    document.getElementById('modalUsuarioNumDoc').textContent = usuario.numeroDocumento || usuario.num_doc || usuario.numero_doc || '-';
    document.getElementById('modalUsuarioTelefono').textContent = usuario.telefono || usuario.celular || '-';
    document.getElementById('modalUsuarioRol').textContent = usuario.rol || '-';
    document.getElementById('modalUsuarioEstado').textContent = usuario.estado || '-';
    const imgElem = document.getElementById('modalUsuarioImagen');
    if (imgElem) {
      imgElem.src = usuario.imagen || '../imgs/default-user.jpg';
      imgElem.alt = usuario.nombre || 'Imagen de usuario';
    }
    document.getElementById('viewUsuarioModal').classList.add('modal--active');
  }

  // Cerrar modal
  document.getElementById('closeViewUsuarioModal').onclick = () => {
    document.getElementById('viewUsuarioModal').classList.remove('modal--active');
  };
  document.getElementById('closeViewUsuarioBtn').onclick = () => {
    document.getElementById('viewUsuarioModal').classList.remove('modal--active');
  };
});
