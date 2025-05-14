import { getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderTable } from './renderTable_ discipline.js';
import * as filter from './filter_discipline.js';

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(renderData, time, fullDataUnit, timeZoneShift) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(renderData, time, fullDataUnit, timeZoneShift);
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
  const discipline = await getServerApi('discipline');
  const unitsSettings = await getServerApi(`unitsSettings`);
  const departmentName = localStorage.getItem('departmentName');
  const timeZoneShift = unitsSettings.find((el) => el.departmentName === departmentName)?.timeZoneShift;
  const spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  let row = components.getTagDiv('row');
  const units = components.getTagDiv('col-auto');
  units.setAttribute('id', 'units');
  row.append(units);

  const update = components.getTagDiv('col-auto');
  const btnUpdate = components.getTagButton('Обновить');
  btnUpdate.setAttribute('id', 'update');
  update.append(btnUpdate);
  row.append(update);

  const divEl = components.getTagDiv('discipline-table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');

  content.append(title, row, divEl);

  getListUnits(discipline);
  startRender(discipline, timeZoneShift);

  // Обработчик обновить
  btnUpdate.addEventListener('click', () => filter.update(timeZoneShift));
}

function getListUnits(discipline) {
  let unitsName = [];
  discipline.forEach((order) => {
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

function startRender(discipline, timeZoneShift) {
  let fullDataUnit = discipline.filter((el) => el.unitName === 'Тюмень-1');
  renderTable(fullDataUnit, 0, fullDataUnit, timeZoneShift);

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    fullDataUnit = discipline.filter((el) => el.unitName === e.target.value);
    editDataNoChange(fullDataUnit, 0, discipline, timeZoneShift);
  });
}
