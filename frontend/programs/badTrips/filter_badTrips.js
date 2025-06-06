export { filterToDate, filterToDirector, filterToManager, update };
import { renderTable } from './renderTable_badTrips.js';
import { postDataServer } from '../../apiServer.js';

function filterToManager(value, fullDataUnit) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = fullDataUnit.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (value === 'Показать все') {
    editDataNoChange(defectFilterUnit, 0, fullDataUnit);
  }
  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.graphistComment === 'Просрочка');
    editDataNoChange(filterData, 0, fullDataUnit);
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'Только просроченные';
  }
  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.graphistComment);
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
    filterData = defectFilterUnit.filter((el) => el.directorComment === 'Просрочка');
    editDataNoChange(filterData, 0, fullDataUnit);
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'Только просроченные';
  }
  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.directorComment);
    editDataNoChange(filterData, 0, fullDataUnit);
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'В работе';
  }
}

async function filterToDate (timeValue, dataFromServer) {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = dataFromServer.filter((el) => el.unitName === selectUnit.value);
  let filterData;
  if (timeValue !== 0) {
    filterData = defectFilterUnit.filter((el) => {
      let now = new Date();
      now.setHours(now.getHours());
      return new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - timeValue));
    });
  } else {
    filterData = defectFilterUnit;
  }
  editDataNoChange(filterData, timeValue, dataFromServer);
}

async function update() {
  const time_defects = document.querySelector('.time-defects');
  const selectedBTN = time_defects.querySelector('button');
  const selectUnit = document.querySelector('.selectUnit');
  const tBody = document.querySelector('.tBody');
  const departmentName = localStorage.getItem('departmentName');

  tBody.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const defectsUpdate = await postDataServer ('query_couriersOrder', {departmentName: departmentName});
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';
  
  const manager = document.querySelector('.manager-defects');
  const unitDirector = document.querySelector('.unitDirector-defects');
  const fullDataUnit = defectsUpdate.filter((el) => el.unitName === selectUnit.value);
  let filterData;

  if (manager.dataset.condition === 'Только просроченные') {
    filterData = fullDataUnit.filter((el) => el.graphistComment === 'Просрочка');
    editDataNoChange(filterData, 0, fullDataUnit);
    return;
  }
  if (manager.dataset.condition === 'В работе') {
    filterData = fullDataUnit.filter((el) => !el.graphistComment);
    editDataNoChange(filterData, 0, fullDataUnit);
    return;
  }
  if (unitDirector.dataset.condition === 'Только просроченные') {
    filterData = fullDataUnit.filter((el) => el.directorComment === 'Просрочка');
    editDataNoChange(filterData, 0, fullDataUnit);
    return;
  }
  if (unitDirector.dataset.condition === 'В работе') {
    filterData = fullDataUnit.filter((el) => !el.directorComment);
    editDataNoChange(filterData, 0, fullDataUnit);
    return;
  }

  if (selectedBTN.value === '0') {
    editDataNoChange(fullDataUnit, selectedBTN.value, fullDataUnit);
    return;
  }
  filterData = fullDataUnit.filter((el) => {
    let now = new Date();
    now.setHours(now.getHours());
    return new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - selectedBTN.value));
  });
  editDataNoChange(filterData, selectedBTN.value, fullDataUnit);
}

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(renderData, time, fullDataUnit) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(renderData, time, fullDataUnit);
  }
}
