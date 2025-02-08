import { deletePayout } from './deletePayout.js';
import { editPayout } from './editPayout.js';
import { addPayout } from './addPayout.js';
import { getServerApi } from '../apiServer.js';

export async function renderTable() {
  //скрытие формы
  const $description = document.querySelector('.description');
  const $wrappper = document.querySelector('.wrappper');
  $wrappper.style.display = 'none';

  // раскрытие формы
  $description.addEventListener('change', function (e) {
    $wrappper.style.display = 'block';
    if (!e.target.value) $wrappper.style.display = 'none';
  });

  // очистка
  document.querySelector('.table-light').innerHTML = '';

  // загрузка данных с сервера
  let arrPremium = await getServerApi('settingPremium');

  const $tbody = document.querySelector('.tableBody');
  let count = 1;

  arrPremium.forEach((el) => {
    const $trEl = document.createElement('tr');
    $tbody.append($trEl);

    const $thEl = document.createElement('th');
    $thEl.classList.add('fs-6');
    $thEl.textContent = count;
    $thEl.scope = 'col';
    count++;
    $trEl.append($thEl);

    let $tdEl = document.createElement('td');
    $tdEl.classList.add('fs-6');
    $tdEl.textContent = el.description;
    $trEl.append($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.amountSize;
    $trEl.append($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.date_start;
    $trEl.append($tdEl);

    let unitName = el.unitName.join(' ');
    $tdEl = document.createElement('td');
    $tdEl.textContent = unitName;
    $trEl.append($tdEl);

    let holiday = el.holiday ? 'Оплачиваем' : ' Не оплачиваем';
    $tdEl = document.createElement('td');
    $tdEl.textContent = holiday;
    $trEl.append($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.typeAmount;
    $trEl.append($tdEl);

    let staffTypeArr = el.staffTypeArr.join(' ');
    $tdEl = document.createElement('td');
    $tdEl.textContent = staffTypeArr;
    $trEl.append($tdEl);

    let dayWeek = el.dayWeek.join(' ');
    $tdEl = document.createElement('td');
    $tdEl.textContent = dayWeek;
    $trEl.append($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.start_time;
    $trEl.append($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.stop_time;
    $trEl.append($tdEl);

    $tdEl = document.createElement('td');
    let editButton = document.createElement('button');
    editButton.classList.add('editButton');
    editButton.classList.add('btn');
    editButton.classList.add('btn-outline-success');
    editButton.classList.add('btn-sm');
    editButton.type = 'button';
    editButton.textContent = 'Редактировать';
    editButton.style.marginBottom = '10px';
    editButton.setAttribute('data-id', el.id);
    $trEl.append($tdEl);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-outline-danger');
    deleteButton.classList.add('btn-sm');
    deleteButton.textContent = 'Удалить';
    deleteButton.type = 'button';
    deleteButton.setAttribute('data-id', el.id);
    $trEl.append($tdEl);
    $tdEl.append(editButton, deleteButton);
  });

  addPayout();
  deletePayout();
  editPayout();
}
