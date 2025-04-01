import { getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderTable } from './renderTable_badTrips.js';

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, time, dataFromServer, filterToCourier) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(data, time, dataFromServer, filterToCourier);
  }
}

const content = document.getElementById('content');

export async function render (name, breadcrumbs) {
  const breadcrumb = document.querySelector('.breadcrumb');
  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumb(breadcrumbs);
  let navControlEl = components.getTagLI_breadcrumbActive(name);
  breadcrumb.append(navMainEl, navManaergEl, navControlEl);

  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const couriersOrder = await getServerApi('couriersOrder');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  let row = components.getTagDiv('row');
  const unitsCol = components.getTagDiv('col-auto');
  const sortCol = components.getTagDiv('col-auto');
  row.append(unitsCol, sortCol);

  row.classList.add('mb-3');
  const units = components.getTagDiv('col-auto');
  units.setAttribute('id', 'units');
  unitsCol.append(units);

  const update = components.getTagDiv('col-auto');
  const btnUpdate = components.getTagButton('Обновить');
  btnUpdate.setAttribute('id', 'update');
  update.append(btnUpdate);
  row.append(update);

  const sortEl = components.getTagDiv('row');
  sortEl.classList.add('start-50');
  let sortLabelDiv = components.getTagDiv('col-auto');
  const sortLabel = components.getTagLabel('sort', 'Сортировка');
  sortLabel.className = 'col-form-label';
  sortEl.append(sortLabelDiv);
  sortLabelDiv.append(sortLabel);

  sortLabelDiv = components.getTagDiv('col-auto');
  sortEl.append(sortLabelDiv);
  const sortSelect = components.getTagSelect();
  sortSelect.setAttribute('id', 'sort');
  sortLabelDiv.append(sortSelect);
  const dateOption = components.getTagOption('По дате', 'По дате');
  const courierOption = components.getTagOption('По курьеру', 'По курьеру');
  sortSelect.append(dateOption, courierOption);

  const divEl = components.getTagDiv('badTrips-table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');

  content.append(title, row, sortEl, divEl);

  getListUnits(couriersOrder);
  startRender(couriersOrder);
}

function getListUnits(couriersOrder) {
  let unitsName = [];
  couriersOrder.forEach((order) => {
    if (!unitsName.includes(order.unitName)) {
      unitsName.push(order.unitName);
    }
  });
  unitsName = unitsName.sort();
  const select = components.getTagSelect();
  select.classList.add('selectUnit');
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    select.append(option);
  });

  const unitsEl = document.getElementById('units');
  unitsEl.append(select);
}

function startRender(couriersOrder) {
  let fullDataUnit = couriersOrder.filter((el) => el.unitName === 'Тюмень-1');
  renderTable(fullDataUnit, 0, fullDataUnit);

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    fullDataUnit = couriersOrder.filter((el) => el.unitName === e.target.value);
    editDataNoChange(fullDataUnit, 0, fullDataUnit);
  });

    document.getElementById('sort').addEventListener('change', function (e) {
    if (e.target.value === 'По курьеру') {
      console.log(e.target.value);
      console.log(fullDataUnit);
      fullDataUnit.sort((a, b) => a.fio.localeCompare(b.fio));
      editDataNoChange(fullDataUnit, 0, couriersOrder, true);
    }
    if (e.target.value === 'По дате') {
      fullDataUnit.sort((a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt));
      editDataNoChange(fullDataUnit, 0, couriersOrder);
    }
  });
}