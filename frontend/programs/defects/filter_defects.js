export { filterToDate, filterToDirector, filterToManager, update };
import { renderTable } from './renderTable_defects.js';
import { getServerApi } from '../../apiServer.js';

function filterToManager(value, defects) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = defects.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (value === 'Показать все') {
    editDataNoChange(defects, 0, defectFilterUnit);
  }
  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.graphist_comment === 'Просрочка');
    editDataNoChange(defects, 0, filterData);
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'Только просроченные';
  }
  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.graphist_comment);
    editDataNoChange(defects, 0, filterData);
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'В работе';
  }
}

function filterToDirector(value, defects) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = defects.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (value === 'Показать все') {
    editDataNoChange(defects, 0, defectFilterUnit);
  }
  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.manager_comment === 'Просрочка');
    editDataNoChange(defects, 0, filterData);
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'Только просроченные';
  }
  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.manager_comment);
    editDataNoChange(defects, 0, filterData);
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'В работе';
  }
}

async function filterToDate(timeValue, defects, timeZoneShift) {

  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = defects.filter((el) => el.unit_id === selectUnit.value);
  let filterData;
  if (timeValue !== 0) {
    filterData = defectFilterUnit.filter((el) => {
      let now = new Date();
      now.setHours(now.getHours() + timeZoneShift);
      return new Date(el.sold_at_local) > new Date(now.setDate(now.getDate() - timeValue));
    });
  } else {
    filterData = defectFilterUnit;
  }
  editDataNoChange(defects, timeValue, filterData, timeZoneShift);
}

async function update(timeZoneShift) {
  let time_defects = document.querySelector('.time-defects');
  let selectedBTN = time_defects.querySelector('button');
  let selectUnit = document.querySelector('.selectUnit');

  const tBody = document.querySelector('.tBody');
  tBody.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const defectsUpdate = await getServerApi('defects');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const manager = document.querySelector('.manager-defects');
  const unitDirector = document.querySelector('.unitDirector-defects');
  const defects = defectsUpdate.filter((el) => el.unit_id === selectUnit.value);
  let filterData;

  if (manager.dataset.condition === 'Только просроченные') {
    filterData = defects.filter((el) => el.graphist_comment === 'Просрочка');
    editDataNoChange(filterData, 0, defects);
    return;
  }
  if (manager.dataset.condition === 'В работе') {
    console.log(manager.dataset.condition);
    filterData = defects.filter((el) => !el.graphist_comment);
    editDataNoChange(filterData, 0, defects);
    return;
  }
  if (unitDirector.dataset.condition === 'Только просроченные') {
    filterData = defects.filter((el) => el.manager_comment === 'Просрочка');
    editDataNoChange(filterData, 0, defects);
    return;
  }
  if (unitDirector.dataset.condition === 'В работе') {
    filterData = defects.filter((el) => !el.manager_comment);
    editDataNoChange(filterData, 0, defects);
    return;
  }
  console.log(selectedBTN.value);

  if (selectedBTN.value === "0") {
    editDataNoChange(defectsUpdate, selectedBTN.value, defects, timeZoneShift);
    return;
  }
  filterData = defects.filter((el) => {
    let now = new Date();
    now.setHours(now.getHours() + timeZoneShift);
    return new Date(el.sold_at_local) > new Date(now.setDate(now.getDate() - selectedBTN.value));
  });

  editDataNoChange(defectsUpdate, selectedBTN.value, filterData, timeZoneShift);
}

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(defects, time, renderData, timeZoneShift) {
  const btns = document.querySelector('.tBody').querySelectorAll('.btn');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(defects, time, renderData, timeZoneShift);
  }
}
