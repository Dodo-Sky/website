export { filterToDate, filterToDirector, filterToManager, update };
import { renderTable } from './renderTable_ discipline.js';
import { postDataServer } from '../../apiServer.js';

function filterToManager(value, fullDataUnit) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = fullDataUnit.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (value === 'Показать все') {
    editDataNoChange(defectFilterUnit, 0, fullDataUnit);
  }
  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.managerDecision === 'Просрочка');
    editDataNoChange(filterData, 0, fullDataUnit);
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'Только просроченные';
  }
  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.managerDecision);
    editDataNoChange(filterData, 0, fullDataUnit);
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'В работе';
  }
}

function filterToDirector(value, fullDataUnit) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = fullDataUnit.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (value === 'Показать все') {
    editDataNoChange(defectFilterUnit, 0, fullDataUnit);
  }
  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.unitDirectorControl === 'Просрочка');
    editDataNoChange(filterData, 0, fullDataUnit);
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'Только просроченные';
  }
  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.unitDirectorControl);
    editDataNoChange(filterData, 0, fullDataUnit);
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'В работе';
  }
}

function filterToDate(timeValue, discipline, timeZoneShift) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = discipline.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (timeValue !== 0) {
    filterData = defectFilterUnit.filter((el) => {
      let now = new Date();
      now.setHours(now.getHours() + timeZoneShift);
      return new Date(el.scheduledShiftStartAtLocal) > new Date(now.setDate(now.getDate() - timeValue));
    });
  } else {
    filterData = defectFilterUnit;
  }
  editDataNoChange(filterData, timeValue, discipline, timeZoneShift);
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
  const departmentName = localStorage.getItem('departmentName');
  const discipline = await postDataServer('render_disciplina', { departmentName: departmentName });

  console.log(discipline);
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const manager = document.querySelector('.manager-defects');
  const unitDirector = document.querySelector('.unitDirector-defects');
  const fullDataUnit = discipline.filter((el) => el.unitName === selectUnit.value);
  let filterData;

  if (manager.dataset.condition === 'Только просроченные') {
    filterData = fullDataUnit.filter((el) => el.managerDecision === 'Просрочка');
    editDataNoChange(filterData, 0, discipline);
    return;
  }
  if (manager.dataset.condition === 'В работе') {
    console.log(manager.dataset.condition);
    filterData = fullDataUnit.filter((el) => !el.managerDecision);
    editDataNoChange(filterData, 0, discipline);
    return;
  }
  if (unitDirector.dataset.condition === 'Только просроченные') {
    filterData = fullDataUnit.filter((el) => el.unitDirectorControl === 'Просрочка');
    editDataNoChange(filterData, 0, discipline);
    return;
  }
  if (unitDirector.dataset.condition === 'В работе') {
    filterData = fullDataUnit.filter((el) => !el.unitDirectorControl);
    editDataNoChange(filterData, 0, discipline);
    return;
  }

  if (selectedBTN.value === '0') {
    editDataNoChange(fullDataUnit, selectedBTN.value, discipline, timeZoneShift);
    return;
  }
  filterData = fullDataUnit.filter((el) => {
    let now = new Date();
    now.setHours(now.getHours() + timeZoneShift);
    return new Date(el.scheduledShiftStartAtLocal) > new Date(now.setDate(now.getDate() - selectedBTN.value));
  });
  editDataNoChange(filterData, selectedBTN.value, discipline, timeZoneShift);
}

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(renderData, time, discipline, timeZoneShift) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(renderData, time, discipline, timeZoneShift);
  }
}
