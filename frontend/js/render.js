import { validation } from './validator.js';
import { deletePayout } from './deletePayout.js';

async function getData() {
  const response = await fetch(
    'http://178.46.153.198:1860/globalGet?payload=settingPremium',
  );
  return await response.json();
}

export async function renderTable() {
  let arrPremium = await getData();

  const $tbody = document.querySelector('.table-light');
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

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.holiday;
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
    editButton.setAttribute('data', el.id);
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
  validation();
  deletePayout ();
}
