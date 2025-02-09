import { getUnitNameEl, getDayWeek, getStaffType } from './settingPayout/markupHtml.js';
import { renderTable } from './settingPayout/renderTable.js';
import { validation } from './settingPayout/validator.js';

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