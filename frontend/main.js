import { getUnitNameEl, getDayWeek, getStaffType } from './settingPayout/markupHtml.js';
import { renderTable } from './settingPayout/renderTable.js';
import { validation } from './settingPayout/validator.js';
import { renderData } from './unitsSettings/renderData.js';
import * as components from "./components.js";

// включение подсказок с внешней библиотеки
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);

async function start() {
  //разметка в HTML
  await getUnitNameEl();
  getDayWeek();
  await getStaffType();

  // прорисовка таблицы
  renderTable();

  // валидация формы
  validation();
}
start();

document.querySelector('.main-settingPayout').style.display = 'none'
renderData ()


// const unitSettings_content = document.querySelector('.unitSettings_content')

// const diEl = components.getDivTableEl ()
// const table = components.getTableEl ()
// unitSettings_content.append (diEl)
// diEl.append (table)

// const tBody = components.getTbodyEl ()
// const trEl = components.getTrEl ()

// const name = components.getTdEl ('name')
// const family = components.getTdEl ('family')
// table.append (tBody)
// tBody.append (trEl)
// trEl.append (name, family)

// console.log(table);




