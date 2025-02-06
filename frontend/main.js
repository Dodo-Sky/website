import { getUnitNameEl, getInputfEl, renderTable } from './js/element.js';
import { validation } from './js/vatidator.js';

const $description = document.querySelector('.description');
const $typeAmount = document.getElementById('typeAmount');
const $date_inp = document.querySelector('.date-inp');
const $start_time = document.querySelector('.start-time');
const $stop_time = document.querySelector('.stop-time');
const $holidays = document.getElementById('inputGroupSelect01');
const $submit = document.getElementById('button-submit');
const $form = document.getElementById('form');
const $amountSize = document.querySelector('.amountSize');

getUnitNameEl('Тюмень');
const $unitName = document.querySelectorAll('.unitName');

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
const $staffType = document.querySelectorAll('.staffType');

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
const $dayWeek_inp = document.querySelectorAll('.dayWeek-inp');

//скрытие
const $wrappper = document.querySelector('.wrappper');
$wrappper.style.display = 'none';

$description.addEventListener('change', function (e) {
  $wrappper.style.display = 'block';
  if (!e.target.value) $wrappper.style.display = 'none';
});

let dataArr  = JSON.parse (localStorage.getItem("dataArr")) ?? []

// обработка формы


$form.addEventListener('submit', function (e) {
  let unitName = [];
  $unitName.forEach((el) => {
    if (el.checked) unitName.push(el.value);
  });
  let staffTypeArr = [];
  $staffType.forEach((el) => {
    if (el.checked) staffTypeArr.push(el.value);
  });
  let dayWeek = [];
  $dayWeek_inp.forEach((el) => {
    if (el.checked) dayWeek.push(el.value);
  });

  dataArr.push({
    description: $description.value,
    amountSize: $amountSize.value,
    date_start: $date_inp.value,
    unitName,
    holiday: $holidays.value,
    typeAmount: $typeAmount.value,
    staffTypeArr,
    dayWeek,
    start_time: $start_time.value,
    stop_time: $stop_time.value,
  });

  localStorage.setItem ('dataArr',JSON.stringify (dataArr))  
  console.log(JSON.parse (localStorage.getItem("dataArr")));
});

renderTable (dataArr)

validation();
