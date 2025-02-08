import { getUnitNameEl, getDayWeek, getStaffType } from './settingPayout/markupHtml.js';
import { renderTable } from './settingPayout/renderTable.js';
import { addPayout } from './settingPayout/addPayout.js';
import { validation } from './settingPayout/validator.js';
import { deletePayout } from './settingPayout/deletePayout.js';
import { editPayout } from './settingPayout/editPayout.js';

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

  // валидация
  validation();
}

start();

//скрытие формы
const $description = document.querySelector('.description');
const $wrappper = document.querySelector('.wrappper');
$wrappper.style.display = 'none';

$description.addEventListener('change', function (e) {
  $wrappper.style.display = 'block';
  if (!e.target.value) $wrappper.style.display = 'none';
});

// включение подсказок
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
