import { getServerApi, postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderTable } from './renderTable_badTrips.js';
import { renderRaiting } from './raiting.js';
import * as filter from './filter_badTrips.js';

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, time, dataFromServer, filterToCourier, timeZoneShift) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(data, time, dataFromServer, filterToCourier, timeZoneShift);
  }
}

const content = document.getElementById('content');

export async function render(name, breadcrumbs) {
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
  const departmentName = localStorage.getItem('departmentName');
  const couriersOrder = await postDataServer ('query_couriersOrder', {departmentName: departmentName});
  const unitsSettings = await getServerApi(`unitsSettings`);
  const timeZoneShift = unitsSettings.find((el) => couriersOrder[0].unitId === el.unitId)?.timeZoneShift;
  console.log(timeZoneShift);
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

  const updateEl = components.getTagDiv('col-auto');
  const btnUpdate = components.getTagButton('Обновить');
  btnUpdate.setAttribute('id', 'update');
  updateEl.append(btnUpdate);
  row.append(updateEl);

  const referenceDiv = components.getTagDiv('col-auto');
  const reference = components.getTagButton('Справка по программе Проблемные поездки');
  reference.classList = 'btn btn-outline-secondary reference';
  referenceDiv.append(reference);
  row.append(referenceDiv);

  reference.addEventListener('click', function (e) {
    window.open(
      'https://docs.google.com/document/d/1fgS1kdMy6bWIAm0Vr0_WQzOISTmEJRnkcOpGarn0DEE/edit?usp=sharing',
    );
  });

  // навигация по программе и рейтингу
  const ulEl = components.getTagUL_nav();
  ulEl.classList.add('nav-tabs');
  const programEl = components.getTagLI_nav('Программа');
  programEl.classList.add('programNav');
  programEl.classList.add('active');
  const raitingEl = components.getTagLI_nav('Рейтинг курьеров');
  raitingEl.classList.add('raitingNav');
  ulEl.append(programEl, raitingEl);

  programEl.addEventListener('click', () => {
    programEl.classList.add('active');
    raitingEl.classList.remove('active');
    const selectUnit = document.querySelector('.selectUnit');

    const fullDataUnit = couriersOrder.filter((el) => el.unitName === selectUnit.value);
    editDataNoChange(fullDataUnit, 0, couriersOrder, timeZoneShift);
  });
  raitingEl.addEventListener('click', () => {
    raitingEl.classList.add('active');
    programEl.classList.remove('active');
    renderRaiting(timeZoneShift);
  });

  const badTrips_table = components.getTagDiv('badTrips-table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');

  content.append(row, ulEl, badTrips_table);

  // const sortEl = components.getTagDiv('row');
  // sortEl.classList.add('start-50');
  // let sortLabelDiv = components.getTagDiv('col-auto');
  // const sortLabel = components.getTagLabel('sort', 'Сортировка');
  // sortLabel.className = 'col-form-label';
  // sortEl.append(sortLabelDiv);
  // sortLabelDiv.append(sortLabel);

  // sortLabelDiv = components.getTagDiv('col-auto');
  // sortEl.append(sortLabelDiv);
  // const sortSelect = components.getTagSelect();
  // sortSelect.setAttribute('id', 'sort');
  // sortLabelDiv.append(sortSelect);
  // const dateOption = components.getTagOption('По дате', 'По дате');
  // const courierOption = components.getTagOption('По курьеру', 'По курьеру');
  // sortSelect.append(dateOption, courierOption);

  // const badTrips_table = components.getTagDiv('badTrips-table');
  // const title = components.getTagH(3, name);
  // title.classList.add('text-center');
  // title.classList.add('sticky-top');

  // content.append(title, row, sortEl, badTrips_table);

  getListUnits(couriersOrder, timeZoneShift);

  // Обработчик обновить
  btnUpdate.addEventListener('click', () => {
    filter.update(timeZoneShift);
  });
}

function getListUnits(couriersOrder, timeZoneShift) {
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
  startRender(couriersOrder, unitsName, timeZoneShift);
}

async function startRender (couriersOrder, unitsName, timeZoneShift) {
  let fullDataUnit = couriersOrder.filter((el) => el.unitName === unitsName[0]);
  renderTable(fullDataUnit, 0, couriersOrder, timeZoneShift);

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    fullDataUnit = couriersOrder.filter((el) => el.unitName === e.target.value);
    const programNav = document.querySelector('.programNav');
    programNav.classList.add('active');
    const raitingNav = document.querySelector('.raitingNav');
    raitingNav.classList.remove('active');
    editDataNoChange(fullDataUnit, 0, couriersOrder, timeZoneShift);
  });

  // document.getElementById('sort').addEventListener('change', function (e) {
  //   if (e.target.value === 'По курьеру') {
  //     fullDataUnit.sort((a, b) => a.fio.localeCompare(b.fio));
  //     editDataNoChange(fullDataUnit, 0, couriersOrder, true, timeZoneShift);
  //   }
  //   if (e.target.value === 'По дате') {
  //     fullDataUnit.sort((a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt));
  //     editDataNoChange(fullDataUnit, 0, couriersOrder, timeZoneShift);
  //   }
  // });
}
