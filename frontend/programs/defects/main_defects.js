import { getServerApi, getDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderTable } from './renderTable_defects.js';
import * as filter from './filter_defects.js';

const content = document.getElementById('content');

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, time, dataFromServer, timeZoneShift) {
  const btns = document.querySelector('.tBody').querySelectorAll('.btn');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(data, time, dataFromServer, timeZoneShift);
  }
}

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
  const defects = await getServerApi('defects');
  let staffData = await getDataServer('defecstStaff');
  const unitsSettings = await getServerApi(`unitsSettings`);
  const departmentName = localStorage.getItem('departmentName');
  const timeZoneShift = unitsSettings.find((el) => el.departmentName === departmentName)?.timeZoneShift;
  localStorage.setItem('staffData', JSON.stringify(staffData));
  let spiner = document.querySelector('.spinner-border');
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

  const divEl = components.getTagDiv('defects-table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');

  content.append(title, row, divEl);

  // Обработчик обновить
  btnUpdate.addEventListener('click', () => filter.update(timeZoneShift));

  getListUnits(defects);
  startRender(defects, timeZoneShift);
}

function getListUnits(defects) {
  let unitsName = [];
  defects.forEach((defect) => {
    if (!unitsName.includes(defect.unitName)) {
      unitsName.push(defect.unitName);
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

function startRender(defects, timeZoneShift) {
  let fullDataUnit = defects.filter((el) => el.unitName === 'Тюмень-1');
  renderTable(defects, 0, fullDataUnit, timeZoneShift);

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    fullDataUnit = defects.filter((el) => el.unitName === e.target.value);
    editDataNoChange(defects, 0, fullDataUnit, timeZoneShift);
  });
}
