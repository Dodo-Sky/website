import { getUnitNameEl, getDayWeek, getStaffType } from './js/markupHtml.js';
import { renderTable } from './js/render.js';
import { addPayout } from './js/addPayout.js';
import { validation } from './js/validator.js';
import { deletePayout } from './js/deletePayout.js';
import { editPayout } from './js/editPayout.js';

async function start () {
  //разметка
  await getUnitNameEl();
  getDayWeek();
  await getStaffType();

  // прорисовка
  await renderTable();

  // прочие функции
  addPayout();
  await deletePayout ();
  await editPayout ()

  // валидация
  validation();
}

start ()


//скрытие формы
const $description = document.querySelector('.description');
const $wrappper = document.querySelector('.wrappper');
$wrappper.style.display = 'none';

$description.addEventListener('change', function (e) {
  $wrappper.style.display = 'block';
  if (!e.target.value) $wrappper.style.display = 'none';
});
