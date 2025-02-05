import { getUnitNameEl, getInputfEl } from './js/element.js';
import { validation } from "./js/vatidator.js";


const $description = document.querySelector('.description');
const $typeAmount = document.getElementById('typeAmount');
const $date_inp = document.querySelector('.date-inp');
const $unitName = document.querySelectorAll('.unitName');
const $start_time = document.querySelector('.start-time');
const $stop_time = document.querySelector('.stop-time');
const $holidays = document.getElementById('inputGroupSelect01');
const $submit = document.getElementById('button-submit');
const $form = document.getElementById('form');

getUnitNameEl('Тюмень');

const staffType = [
  'Автомобильный',
  'Управляющий',
  'Наставник',
  'Инструктор',
  'Кассир',
  'Пиццамейкер',
  'Менеджер',
  'Стажер-кассир',
  'Универсал',
  'Стажер-пиццамейкер',
  'Кандидат-пиццамейкер',
  'Стажер-менеджер',
  'Клинер',
  'Кандидат-кассир',
];
getInputfEl('typeAll', 'staffType', staffType);

const dayWeek = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суботта',
  'Воскресение',
];
getInputfEl('dayWeek', 'dayWeek-inp', dayWeek);


// скрытие
const $wrappper = document.querySelector('.wrappper');
$wrappper.style.display = 'none';

$description.addEventListener('change', function (e) {
  $wrappper.style.display = 'block';
  if (!e.target.value) $wrappper.style.display = 'none';
});


// $form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   let unitName = [];
//   $unitName.forEach((el) => {
//     if (el.checked) unitName.push(el.value);
//   });
//   if (unitName.length === 0) {
//     alert('Выберите хотя бы одну пиццерию');

//   }
//   console.log(unitName);
// });

validation ()