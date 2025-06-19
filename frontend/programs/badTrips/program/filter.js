export { filterToDate, filterToDirector, filterToManager };

import { checkUnsavedChanges } from "./checkUnsavedChanges.js";
import { renderProgram } from './index.js';

const filterToManager = async (value, fullDataUnit) => {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = fullDataUnit.filter((el) => el.unitName === selectUnit.value);
  let filterData;

  if (value === 'Показать все') {
    await checkUnsavedChanges(defectFilterUnit, 0, fullDataUnit);
  }

  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.graphistComment === 'Просрочка');
    await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'Только просроченные';
  }

  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.graphistComment);
    await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
    const manager = document.querySelector('.manager-defects');
    manager.dataset.condition = 'В работе';
  }
}

const filterToDirector = async (value, fullDataUnit) => {
  let selectUnit = document.querySelector('.selectUnit');
  let defectFilterUnit = fullDataUnit.filter((el) => el.unitName === selectUnit.value);
  let filterData;

  if (value === 'Показать все') {
    await checkUnsavedChanges(() => renderProgram(defectFilterUnit, 0, fullDataUnit));
  }

  if (value === 'Только просроченные') {
    filterData = defectFilterUnit.filter((el) => el.directorComment === 'Просрочка');
    await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'Только просроченные';
  }

  if (value === 'В работе') {
    filterData = defectFilterUnit.filter((el) => !el.directorComment);
    await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
    const unitDirector = document.querySelector('.unitDirector-defects');
    unitDirector.dataset.condition = 'В работе';
  }
}

const filterToDate = async (timeValue, dataFromServer) => {
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

  await checkUnsavedChanges(() => renderProgram(filterData, timeValue, dataFromServer));
}
