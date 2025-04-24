import { insumosConfig } from '../config/insumosConfig.js';

document.addEventListener('DOMContentLoaded', async () => {
  let currentPage = 1;
  const itemsPerPage = insumosConfig.table.itemsPerPage || 10;
  let filteredInsumos = [];

  // --- Obtener insumos desde la API ---
  async function fetchInsumosFromAPI() {
    try {
      const response = await fetch('http://localhost:5000/insumos');
      if (!response.ok) throw new Error('Error al obtener insumos de la API');
      const data = await response.json();
      // Si la respuesta es un array o tiene la clave 'insumos'
      const insumosArr = Array.isArray(data) ? data : (data.insumos || []);
      // Normalizar campos y estado
      return insumosArr.map(insumo => {
        let status = insumo.estado || '';
        if (typeof status === 'string') {
          const estadoLower = status.trim().toLowerCase();
          if (["habilitado"].includes(estadoLower)) {
            status = 'habilitado';
          } else if (["deshabilitado"].includes(estadoLower)) {
            status = 'deshabilitado';
          }
        }
        return {
          id: insumo.insumoId || insumo.id || '',
          nombre: insumo.nombre || '',
          tipo: insumo.tipo || '',
          cantidad: insumo.cantidad || '',
          estado: status,
          descripcion: insumo.descripcion || '',
          proveedor: insumo.proveedor || '',
          unidad: insumo.unidad || '',
          imagen: insumo.imagen || '',
          fechaCreacion: insumo.fechaCreacion || insumo.createdAt || insumo.fecha_creacion || '',
          fechaActualizacion: insumo.fechaActualizacion || insumo.updatedAt || insumo.fecha_actualizacion || '',
        };
      });
    } catch (e) {
      console.warn('Fallo la carga desde la API, usando datos locales:', e.message);
      return insumos;
    }
  }

  function updateInsumoStatus(ids, estado) {
    ids.forEach(id => {
      const insumo = filteredInsumos.find(i => String(i.id) === String(id));
      if (insumo) insumo.estado = estado;
    });
  }

  function getFilteredInsumos() {
    const search = document.querySelector('.filters__search')?.value?.toLowerCase() || '';
    const tipo = document.querySelector('select[placeholder="Tipo de Insumo"]')?.value || '';
    const estado = document.querySelector('select[placeholder="Estado"]')?.value || '';
    return filteredInsumos.filter(i =>
      (i.nombre.toLowerCase().includes(search) || i.id.toLowerCase().includes(search)) &&
      (tipo ? i.tipo === tipo : true) &&
      (estado ? i.estado === estado : true)
    );
  }

  function renderInsumosTable(data) {
    const tbody = document.querySelector('.table__body');
    tbody.innerHTML = data.map(insumo => `
      <tr class="table__row">
        <td class="table__cell table__cell--checkbox">
          <input type="checkbox" class="table__checkbox" />
        </td>
        <td class="table__cell table__cell--id">${insumo.id}</td>
        <td class="table__cell table__cell--name">${insumo.nombre}</td>
        <td class="table__cell table__cell--tipo">${insumo.tipo}</td>
        <td class="table__cell table__cell--cantidad">${insumo.cantidad}</td>
        <td class="table__cell table__cell--estado">
          <span class="badge badge--${insumo.estado === 'habilitado' ? 'active' : 'inactive'}">${insumo.estado === 'habilitado' ? 'Con stock' : 'Sin stock'}</span>
        </td>
        <td class="table__cell table__cell--actions">
          <button class="table__action-button table__action-button--view"><span class="material-symbols-outlined">visibility</span></button>
          <a href="../views/actualizar-insumo.html?id=${insumo.id}" class="table__action-button-wrapper">
            <button class="table__action-button table__action-button--edit"><span class="material-symbols-outlined">edit</span></button>
          </a>
          <button class="table__action-button table__action-button--${insumo.estado === 'habilitado' ? 'disable' : 'enable'}"><span class="material-symbols-outlined">power_settings_new</span></button>
        </td>
      </tr>
    `).join('');
  }

  function renderPaginatedTable(list) {
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, total);
    const pageItems = list.slice(startIdx, endIdx);
    renderInsumosTable(pageItems);
    renderPaginationInfo(startIdx, endIdx, total);
    renderPaginationControls(totalPages);
    updateSelectionCount();
  }

  function renderPaginationInfo(startIdx, endIdx, total) {
    const currentPageSpan = document.querySelector('.pagination__current-page');
    const itemsPerPageSpan = document.querySelector('.pagination__items-per-page');
    const totalItemsSpan = document.querySelector('.pagination__total-items');
    if (currentPageSpan) currentPageSpan.textContent = startIdx + 1;
    if (itemsPerPageSpan) itemsPerPageSpan.textContent = endIdx;
    if (totalItemsSpan) totalItemsSpan.textContent = total;
  }

  function renderPaginationControls(totalPages) {
    const prevBtn = document.querySelector('.pagination__button--prev');
    const nextBtn = document.querySelector('.pagination__button--next');
    const pageBtns = document.querySelectorAll('.pagination__button:not(.pagination__button--prev):not(.pagination__button--next)');
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPaginatedTable(filteredInsumos); } };
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPaginatedTable(filteredInsumos); } };
    // Actualiza botones de página
    pageBtns.forEach((btn, i) => {
      const pageNum = i + 1;
      btn.classList.toggle('pagination__button--active', pageNum === currentPage);
      btn.style.display = (pageNum <= totalPages) ? '' : 'none';
      btn.onclick = () => { if (currentPage !== pageNum) { currentPage = pageNum; renderPaginatedTable(filteredInsumos); } };
    });
  }

  function getSelectedIds() {
    return Array.from(document.querySelectorAll('.table__checkbox:checked'))
      .map(cb => cb.closest('tr').querySelector('.table__cell--id').textContent);
  }

  function updateSelectionCount() {
    const total = document.querySelectorAll('.table__checkbox').length;
    const selected = document.querySelectorAll('.table__checkbox:checked').length;
    document.querySelector('.actions-bar__count--selected').textContent = selected;
    document.querySelector('.actions-bar__count--total').textContent = total;
    const header = document.querySelector('.table__checkbox-header');
    const bar = document.querySelector('.actions-bar__checkbox');
    if (header) header.checked = (selected === total && total > 0);
    if (bar) bar.checked = (selected === total && total > 0);
  }

  // Sincronización de checkbox general y de tabla
  document.querySelector('.table__body').addEventListener('change', updateSelectionCount);

  document.querySelector('.actions-bar__checkbox').addEventListener('change', function() {
    const checked = this.checked;
    document.querySelectorAll('.table__checkbox').forEach(cb => { cb.checked = checked; });
    const thHeader = document.querySelector('.table__checkbox-header');
    if (thHeader) thHeader.checked = checked;
    updateSelectionCount();
  });

  // Checkbox en header de tabla
  let thHeader = document.querySelector('.table__checkbox-header');
  if (!thHeader) {
    // Si no existe, lo agregamos dinámicamente
    const th = document.createElement('th');
    th.className = 'table__cell table__cell--checkbox';
    th.innerHTML = '<input type="checkbox" class="table__checkbox-header" />';
    const theadRow = document.querySelector('.table__head .table__row');
    if (theadRow) theadRow.insertBefore(th, theadRow.firstChild);
    thHeader = document.querySelector('.table__checkbox-header');
  }
  if (thHeader) {
    thHeader.addEventListener('change', function() {
      const checked = this.checked;
      document.querySelectorAll('.table__checkbox').forEach(cb => { cb.checked = checked; });
      const bar = document.querySelector('.actions-bar__checkbox');
      if (bar) bar.checked = checked;
      updateSelectionCount();
    });
  }

  document.querySelector('.button--enable').addEventListener('click', async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;
    updateInsumoStatus(ids, 'habilitado');
    await Promise.all(ids.map(id => toggleInsumoStatus(id, 'habilitado')));
    renderPaginatedTable(filteredInsumos);
    document.querySelector('.actions-bar__checkbox').checked = false;
    document.querySelector('.table__checkbox-header').checked = false;
  });
  document.querySelector('.button--disable').addEventListener('click', async () => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;
    updateInsumoStatus(ids, 'deshabilitado');
    await Promise.all(ids.map(id => toggleInsumoStatus(id, 'deshabilitado')));
    renderPaginatedTable(filteredInsumos);
    document.querySelector('.actions-bar__checkbox').checked = false;
    document.querySelector('.table__checkbox-header').checked = false;
  });

  // --- Nueva función para actualizar estado en backend ---
  async function toggleInsumoStatus(id, nuevoEstado) {
    await fetch(`http://localhost:5000/insumos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
  }

  // --- Mostrar modal de visualizar insumo ---
  function showInsumoModal(insumo) {
    document.getElementById('modalInsumoId').textContent = insumo.id || '';
    document.getElementById('modalInsumoNombre').textContent = insumo.nombre || '';
    document.getElementById('modalInsumoTipo').textContent = insumo.tipo || '';
    document.getElementById('modalInsumoCantidad').textContent = insumo.cantidad || '';
    document.getElementById('modalInsumoEstado').textContent = insumo.estado || '';
    document.getElementById('modalInsumoDescripcion').textContent = insumo.descripcion || '-';
    const imgElem = document.getElementById('modalInsumoImagen');
    if (imgElem) {
      imgElem.src = insumo.imagen || '../imgs/default-insumo.jpg';
      imgElem.alt = insumo.nombre || 'Imagen de insumo';
    }
    document.getElementById('viewInsumoModal').classList.add('modal--active');
  }

  // Cerrar modal
  document.getElementById('closeViewInsumoModal').onclick = () => {
    document.getElementById('viewInsumoModal').classList.remove('modal--active');
  };
  document.getElementById('closeViewInsumoBtn').onclick = () => {
    document.getElementById('viewInsumoModal').classList.remove('modal--active');
  };

  // --- Reporte funcional ---
  const reportModal = document.getElementById('reportModal');
  const reportBtn = document.querySelector('.button--report');
  const cancelReportBtn = document.getElementById('cancelReportBtn');
  const generateReportBtn = document.getElementById('generateReportBtn');
  const closeReportModal = document.getElementById('closeReportModal');

  if (reportBtn && reportModal) {
    reportBtn.addEventListener('click', () => {
      // Usa la clase modal--active (no modal--open) para mostrar el modal correctamente
      reportModal.classList.add('modal--active');
      reportModal.style.display = '';
      reportModal.style.alignItems = '';
      reportModal.style.justifyContent = '';
    });
  }
  if (cancelReportBtn && reportModal) {
    cancelReportBtn.addEventListener('click', () => {
      reportModal.classList.remove('modal--active');
      reportModal.style.display = '';
    });
  }
  if (closeReportModal && reportModal) {
    closeReportModal.addEventListener('click', () => {
      reportModal.classList.remove('modal--active');
      reportModal.style.display = '';
    });
  }
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const includeInactive = document.getElementById('includeInactive').checked;
      const includeDetails = document.getElementById('includeDetails').checked;
      let reportData = filteredInsumos.filter(i => {
        if (!includeInactive && i.estado === 'deshabilitado') return false;
        return true;
      });
      let csv = '';
      if (includeDetails) {
        csv += 'ID,Nombre,Tipo,Cantidad,Estado\n';
        reportData.forEach(i => {
          csv += `"${i.id}","${i.nombre}","${i.tipo}",${i.cantidad},"${i.estado}"\n`;
        });
      } else {
        csv += 'ID,Nombre,Estado\n';
        reportData.forEach(i => {
          csv += `"${i.id}","${i.nombre}","${i.estado}"\n`;
        });
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_insumos_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      reportModal.classList.remove('modal--active');
      reportModal.style.display = '';
    });
  }

  document.querySelector('.filters__search')?.addEventListener('input', applyFilters);
  document.querySelector('select[placeholder="Tipo de Insumo"]')?.addEventListener('change', applyFilters);
  document.querySelector('select[placeholder="Estado"]')?.addEventListener('change', applyFilters);
  document.querySelector('.button--clear')?.addEventListener('click', () => {
    document.querySelector('.filters__search').value = '';
    document.querySelector('select[placeholder="Tipo de Insumo"]').value = '';
    document.querySelector('select[placeholder="Estado"]').value = '';
    filteredInsumos = getFilteredInsumos();
    currentPage = 1;
    renderPaginatedTable(filteredInsumos);
  });

  function applyFilters() {
    filteredInsumos = getFilteredInsumos();
    currentPage = 1;
    renderPaginatedTable(filteredInsumos);
  }

  // Mostrar y ocultar filtros
  const filterBtn = document.querySelector('.button--filter');
  const filtersDiv = document.querySelector('.filters');
  const closeFilter = document.querySelector('.filters__close');
  if (filterBtn && filtersDiv) {
    filterBtn.addEventListener('click', () => {
      filtersDiv.classList.remove('hidden');
    });
  }
  if (closeFilter && filtersDiv) {
    closeFilter.addEventListener('click', () => {
      filtersDiv.classList.add('hidden');
    });
  }

  document.querySelector('.table__body').addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const row = btn.closest('tr');
    const id = row.querySelector('.table__cell--id').textContent;
    if (btn.classList.contains('table__action-button--view')) {
      const insumo = filteredInsumos.find(i => String(i.id) === String(id));
      if (insumo) showInsumoModal(insumo);
      return;
    } else if (btn.classList.contains('table__action-button--edit')) {
      alert(`Editar insumo: ${id}`);
    } else if (btn.classList.contains('table__action-button--enable')) {
      updateInsumoStatus([id], 'habilitado');
      await toggleInsumoStatus(id, 'habilitado');
      renderPaginatedTable(filteredInsumos);
    } else if (btn.classList.contains('table__action-button--disable')) {
      updateInsumoStatus([id], 'deshabilitado');
      await toggleInsumoStatus(id, 'deshabilitado');
      renderPaginatedTable(filteredInsumos);
    }
  });

  // Inicializar datos y render
  filteredInsumos = await fetchInsumosFromAPI();
  renderPaginatedTable(filteredInsumos);
});
