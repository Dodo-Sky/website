import { validator } from './validator.js';
import { renderTable } from './renderTable.js';
import { createServerApi } from '../apiServer.js';

// обработка результата с формы после валидации
export function initPayloadAddHandlers () {
  validator.onSuccess(async function () {
    const $description = document.querySelector('.description');
    const $typeAmount = document.getElementById('typeAmount');
    const $date_inp = document.querySelector('.date-inp');
    const $start_time = document.querySelector('.start-time');
    const $stop_time = document.querySelector('.stop-time');
    const $holidays = document.getElementById('inputGroupSelect01');
    const $amountSize = document.querySelector('.amountSize');
    const $staffType = document.querySelectorAll('.staffType');
    const $dayWeek_inp = document.querySelectorAll('.dayWeek-inp');
    const $unitName = document.querySelectorAll('.unitName');
    const $form = document.getElementById('form');

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
    // перевожу значения в true false
    let holiday = $holidays.value ? true : false;

    const dataToServer = {
      description: $description.value,
      amountSize: $amountSize.value,
      date_start: $date_inp.value,
      unitName,
      holiday,
      typeAmount: $typeAmount.value,
      staffTypeArr,
      dayWeek,
      start_time: $start_time.value,
      stop_time: $stop_time.value,
    };

    await createServerApi(dataToServer);

    // чистим таблицу
    document.querySelector('.table-light').innerHTML = '';

    // рендерим новые данные
    renderTable();

    // стираем форму
    $form.reset ();

    // скрываем форму
    const $wrappper = document.querySelector('.wrappper');
    $wrappper.style.display = 'none';
  });
}
