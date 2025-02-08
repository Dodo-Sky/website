import { renderTable } from './renderTable.js';
import { validator } from './validator.js';
import { getServerApi, putServerApi } from '../apiServer.js';



const $description = document.querySelector('.description');
const $amountSize = document.querySelector('.amountSize');
const $date_start = document.querySelector('.date-inp');
const $start_time = document.querySelector('.start-time');
const $stop_time = document.querySelector('.stop-time');
const $typeAmount = document.getElementById('typeAmount');
const $holidays = document.getElementById('inputGroupSelect01');

export async function editPayout() {
  const editButton = document.querySelectorAll('.editButton');
  const arrPremium = await getServerApi ('settingPremium');

  editButton.forEach((button) => {
    button.addEventListener('click', async function (e) {
      const $wrappper = document.querySelector('.wrappper');
      $wrappper.style.display = 'block';
      document.getElementById('button-submit').textContent = 'Редактировать';

      // формирование данных в форму с файла
      const id = e.target.dataset.id;
      const premium = arrPremium?.find((el) => el.id === id);

      const $unitName = document.querySelectorAll('.unitName');
      $unitName.forEach((el) => {
        if (premium.unitName.includes(el.value)) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      });
      const $staffType = document.querySelectorAll('.staffType');
      $staffType.forEach((el) => {
        if (premium.staffTypeArr.includes(el.value)) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      });
      const $dayWeek_inp = document.querySelectorAll('.dayWeek-inp');
      $dayWeek_inp.forEach((el) => {
        if (premium.dayWeek.includes(el.value)) {
          el.checked = true;
        } else {
          el.checked = false;
        }
      });
      $description.value = premium.description;
      $amountSize.value = premium.amountSize;
      $date_start.value = premium.date_start;
      $start_time.value = premium.start_time;
      $stop_time.value = premium.stop_time;
      $holidays.value = premium.holiday;
      $typeAmount.value = premium.typeAmount;

      // добавление новых данных
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
        await putServerApi(premium.id, dataToServer)

        document.querySelector(".table-light").innerHTML = ""
        renderTable()
        $form.reset()
        const $wrappper = document.querySelector(".wrappper")
        $wrappper.style.display = "none"
        document.getElementById("button-submit").textContent = "Добавить новую запись"
      });
    });
  });
}
