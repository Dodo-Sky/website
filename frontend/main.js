import { getUnitNameEl, getDayWeek, getStaffType } from './settingPayout/markupHtml.js';
import { renderTable } from './settingPayout/renderTable.js';
import { addPayout } from './settingPayout/addPayout.js';
import { validation } from './settingPayout/validator.js';
import { deletePayout } from './settingPayout/deletePayout.js';
import { editPayout } from './settingPayout/editPayout.js';

// включение подсказок с внешней библиотеки
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);

// указываю порядок запуска функций
async function start() {
  //разметка в HTML
  await getUnitNameEl();
  getDayWeek();
  await getStaffType();

  // прорисовка
  await renderTable();

  // прочие функции
  addPayout();
  await deletePayout();
  await editPayout();

  // валидация формы
  validation();
}

start();