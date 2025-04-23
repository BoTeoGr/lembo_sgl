import { ciclosCultivos } from '../data/ciclosCultivosData.js';
import { ciclosCultivosConfig } from '../config/ciclosCultivosConfig.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  const itemsPerPage = ciclosCultivosConfig.table.itemsPerPage || 10;
  let filteredCiclos = [...ciclosCultivos];
  let selectedIds = [];

  function renderCiclosTable(data) {
    const tbody = document.querySelector('.table__body');
    tbody.innerHTML = data.map(ciclo => `
      <tr class="table__row">
        <td class="table__cell table__cell--checkbox">
          <input type="checkbox" class="table__checkbox" data-id="${ciclo.id}" ${selectedIds.includes(ciclo.id) ? 'checked' : ''} />
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

  function updateCicloStatus(ids, estado) {
    ids.forEach(id => {
      const ciclo = ciclosCultivos.find(c => String(c.id) === String(id));
      if (ciclo) ciclo.estado = estado;
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

  function renderPaginatedTable(list) {
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, total);
    const pageItems = list.slice(startIdx, endIdx);
    renderCiclosTable(pageItems);
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
    const controlsDiv = document.querySelector('.pagination__controls');
    if (!controlsDiv) return;

    // Limpia los botones de página anteriores (excepto prev y next)
    controlsDiv.querySelectorAll('.pagination__button--page').forEach(btn => btn.remove());

    const prevBtn = controlsDiv.querySelector('.pagination__button--prev');
    const nextBtn = controlsDiv.querySelector('.pagination__button--next');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Inserta los botones de página (1, 2, 3, ...)
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'pagination__button pagination__button--page' + (i === currentPage ? ' pagination__button--active' : '');
      pageBtn.textContent = i;
      pageBtn.onclick = () => {
        if (currentPage !== i) {
          currentPage = i;
          renderPaginatedTable(filteredCiclos);
        }
      };
      nextBtn.parentNode.insertBefore(pageBtn, nextBtn);
    }

    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderPaginatedTable(filteredCiclos); } };
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderPaginatedTable(filteredCiclos); } };
  }

  // --- Eventos checkboxes ---
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
  if (thHeader) {
    thHeader.addEventListener('change', function() {
      const checked = this.checked;
      document.querySelectorAll('.table__checkbox').forEach(cb => { cb.checked = checked; });
      const bar = document.querySelector('.actions-bar__checkbox');
      if (bar) bar.checked = checked;
      updateSelectionCount();
    });
  }

  // --- Botones individuales y masivos ---
  document.querySelector('.table__body').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const row = btn.closest('tr');
    const id = row.querySelector('.table__cell--id').textContent;
    if (btn.classList.contains('table__action-button--view')) {
      // alert(`Ver ciclo: ${id}`);
    } else if (btn.classList.contains('table__action-button--edit')) {
      // alert(`Editar ciclo: ${id}`);
    } else if (btn.classList.contains('table__action-button--enable')) {
      updateCicloStatus([id], 'Activo');
      renderPaginatedTable(filteredCiclos);
    } else if (btn.classList.contains('table__action-button--disable')) {
      updateCicloStatus([id], 'Inactivo');
      renderPaginatedTable(filteredCiclos);
    }
  });

  // Botones de barra de acciones masiva
  const enableBtn = document.querySelector('.button--enable');
  const disableBtn = document.querySelector('.button--disable');
  if (enableBtn) {
    enableBtn.addEventListener('click', () => {
      const ids = getSelectedIds();
      if (ids.length === 0) return;
      updateCicloStatus(ids, 'Activo');
      renderPaginatedTable(filteredCiclos);
      document.querySelector('.actions-bar__checkbox').checked = false;
      document.querySelector('.table__checkbox-header').checked = false;
      updateSelectionCount();
    });
  }
  if (disableBtn) {
    disableBtn.addEventListener('click', () => {
      const ids = getSelectedIds();
      if (ids.length === 0) return;
      updateCicloStatus(ids, 'Inactivo');
      renderPaginatedTable(filteredCiclos);
      document.querySelector('.actions-bar__checkbox').checked = false;
      document.querySelector('.table__checkbox-header').checked = false;
      updateSelectionCount();
    });
  }

  // --- Filtros funcionales ---
  const filtersDiv = document.querySelector('.filters');
  const filterBtn = document.querySelector('.button--filter');
  const closeBtn = document.querySelector('.filters__close');
  const searchInput = document.querySelector('.filters__search');
  const clearBtn = document.querySelector('.button--clear');

  // Mostrar/ocultar panel de filtros
  if (filterBtn && filtersDiv) {
    filterBtn.onclick = () => filtersDiv.classList.remove('hidden');
  }
  if (closeBtn && filtersDiv) {
    closeBtn.onclick = () => filtersDiv.classList.add('hidden');
  }

  // Filtrado por texto (nombre o ID)
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      filteredCiclos = ciclosCultivos.filter(c =>
        c.nombre.toLowerCase().includes(q) || String(c.id).toLowerCase().includes(q)
      );
      currentPage = 1;
      renderPaginatedTable(filteredCiclos);
    });
  }

  // Limpiar filtros
  if (clearBtn && searchInput) {
    clearBtn.onclick = () => {
      searchInput.value = '';
      filteredCiclos = [...ciclosCultivos];
      currentPage = 1;
      renderPaginatedTable(filteredCiclos);
    };
  }

  // --- Modal de Generar Reporte avanzado funcional ---
  const reportModal = document.getElementById('reportModal');
  const openReportBtn = document.querySelector('.button--report');
  const closeReportBtn = document.getElementById('closeReportModal');
  const cancelReportBtn = document.getElementById('cancelReportBtn');
  const generateReportBtn = document.getElementById('generateReportBtn');
  const reportForm = document.getElementById('reportForm');

  if (openReportBtn && reportModal) {
    openReportBtn.onclick = () => reportModal.classList.add('modal--active');
  }
  if (closeReportBtn && reportModal) {
    closeReportBtn.onclick = () => reportModal.classList.remove('modal--active');
  }
  if (cancelReportBtn && reportModal) {
    cancelReportBtn.onclick = (e) => {
      e.preventDefault();
      reportModal.classList.remove('modal--active');
    };
  }
  if (generateReportBtn && reportModal) {
    generateReportBtn.onclick = (e) => {
      e.preventDefault();
      // Obtener configuración del formulario
      const format = document.getElementById('reportFormat').value;
      const includeInactive = document.getElementById('includeInactive').checked;
      const includeDetails = document.getElementById('includeDetails').checked;
      const includeSensors = document.getElementById('includeSensors').checked;
      const includeSupplies = document.getElementById('includeSupplies').checked;
      // Filtrar datos según opciones (ejemplo: solo activos si no incluye inactivos)
      let data = filteredCiclos;
      if (!includeInactive) {
        data = data.filter(c => c.estado === 'Activo');
      }
      // Generar solo CSV (otros formatos pueden implementarse después)
      if (format === 'csv') {
        const headers = ['ID', 'Nombre', 'Periodo Inicio', 'Periodo Final', 'Estado'];
        const rows = data.map(c => [c.id, c.nombre, c.periodoInicio, c.periodoFinal, c.estado]);
        let csvContent = headers.join(',') + '\n';
        csvContent += rows.map(r => r.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte_ciclos_cultivos.csv';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        alert('Por ahora solo está disponible la descarga en formato CSV.');
      }
      reportModal.classList.remove('modal--active');
    };
  }

  // Asegúrate de que los imports y rutas JS apunten al nuevo nombre del HTML si es necesario en rutas relativas
  // Inicializar
  filteredCiclos = [...ciclosCultivos];
  renderPaginatedTable(filteredCiclos);
});
