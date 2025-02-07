import { getUnitNameEl, getDayWeek, getStaffType } from './js/element.js';
import { renderTable } from './js/render.js';
import { addPayout } from './js/addPayout.js';

// асинхронная
getUnitNameEl();

getDayWeek();

// асинхронная
getStaffType();

// рендер таблицы асинхронная (валидацию сделал в рендере)
renderTable();

// обработка формы и добавление новых выплат
addPayout ();

//скрытие формы
const $description = document.querySelector('.description');
const $wrappper = document.querySelector('.wrappper');
$wrappper.style.display = 'none';

$description.addEventListener('change', function (e) {
  $wrappper.style.display = 'block';
  if (!e.target.value) $wrappper.style.display = 'none';
});