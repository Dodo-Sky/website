import { getUnitNameEl, getInputfEl } from './js/element.js';
const validator = new JustValidate('#form');
const $description = document.querySelector('.description');
const $amountSize = document.querySelector('.amountSize');
const $typeAmount = document.getElementById('typeAmount');
const $date_inp = document.querySelector('.date-inp');

const $choiceUnit = document.querySelector('.choiceUnit');

const $inputGroupSelect01 = document.getElementById('inputGroupSelect01');

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

const $wrappper = document.querySelector('.wrappper');
$wrappper.style.display = 'none';

// скрытие

$description.addEventListener('change', function (e) {
  $wrappper.style.display = 'block';
  if (!e.target.value) $wrappper.style.display = 'none';
});

const submit = document.getElementById('button-submit');
const $form = document.getElementById('form');

const $typeAll = document.querySelector('.typeAll');

//console.log(typeAmount);


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

const $unitName = document.querySelectorAll('.unitName');

validator.addField($description, [
  {
    rule: 'required',
    errorMessage: 'Введите описание выплаты',
  },
])
.addField($amountSize, [
  {
    rule: 'required',
    errorMessage: 'Введите размер доплаты',
  },
  {
    rule: 'number',
  },
])
.addField($date_inp , [
  {
    rule: 'required',
    errorMessage: 'Укажите дату начала',
  },
])
.addRequiredGroup ($choiceUnit, 'Выберите хотя бы одну пиццерию')
