import * as components from '../../components.js';
import { postDataServer } from '../../apiServer.js';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

function YYYYMMDDtoDDMMYYYY(date) {
  const [year, monts, day] = date.split('-');
  return `${day}.${monts}.${year}`;
}

export async function renderRaiting (timeZoneShift) {
  const departmentName = localStorage.getItem('departmentName');
  const selectUnit = document.querySelector('.selectUnit');
  const content = document.querySelector('.badTrips-table');
  content.innerHTML = '';

  // даты
  let now = new Date();
  // now.setHours(now.getHours() + timeZoneShift);
  now.setHours(now.getHours());
  const dateTo = now.toISOString().slice(0, 10);

  let fromEl = new Date();
  // fromEl.setHours(fromEl.getHours() + timeZoneShift);
  fromEl.setHours(fromEl.getHours());
  fromEl.setDate(fromEl.getDate() - 30);
  const dateFrom = fromEl.toISOString().slice(0, 10);

  // добавление периода
  let rowEl = components.getTagDiv('row');
  rowEl.classList.add('g-3');
  rowEl.classList.add('rowEl');
  content.append(rowEl);

  let colEl = components.getTagDiv('col-auto');
  colEl.textContent = 'Выберете период';
  rowEl.append(colEl);

  colEl = components.getTagDiv('col-auto');
  rowEl.append(colEl);

  let rowEl1 = components.getTagDiv('row');
  rowEl1.classList.add('g-3');
  colEl.append(rowEl1);
  let labelFrom = components.getTagLabel('inputFrom', 'C: ');
  labelFrom.classList.add('col');
  let inputFrom = components.getTagInput('date', dateFrom);
  inputFrom.classList.add('col');
  inputFrom.setAttribute('id', 'inputFrom');
  rowEl1.append(labelFrom, inputFrom);

  rowEl1 = components.getTagDiv('row');
  rowEl1.classList.add('g-3');
  colEl.append(rowEl1);
  let labelTo = components.getTagLabel('labelTo', 'По: ');
  labelTo.classList.add('col');
  let inputTo = components.getTagInput('date', dateTo);
  inputTo.classList.add('col');
  inputTo.setAttribute('id', 'inputTo');
  rowEl1.append(labelTo, inputTo);

  colEl = components.getTagDiv('col-auto');
  let btnEl = components.getTagButton('Выбрать');
  colEl.append(btnEl);
  btnEl.classList.add('arrayData-btn-save');
  rowEl.append(colEl);

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  content.append(tableEl);

  const requestStart = {
    departmentName,
    unitName: selectUnit.value,
    dateFrom: inputFrom.value,
    dateTo: inputTo.value,
  };

  const renderDataStart = await postDataServer ('couriersRaiting', requestStart);
  const {minDate, maxDate} = (await postDataServer('minMaxDate', {unitName : selectUnit.value}))[0];
  renderTable(renderDataStart, minDate, maxDate);

  btnEl.addEventListener('click', async () => {
    if (minDate > inputFrom.value) {
      alert(`Минимальная дата не ранее ${YYYYMMDDtoDDMMYYYY(minDate)}`);
      return;
    }

    const request = {
      departmentName,
      unitName: selectUnit.value,
      dateFrom: inputFrom.value,
      dateTo: inputTo.value,
    };
    let renderData = await postDataServer('couriersRaiting', request);
    renderTable (renderData, minDate, maxDate);
  });
}

function renderTable(renderData, minDate, maxDate) {
  const rowEl = document.querySelector('.rowEl');
  const colEl = document.querySelector('.colEl');

  if (!colEl) {
    const colEl = components.getTagDiv('col-auto');
    colEl.classList.add('colEl');
    let maxMin = components.getTagSpan();
    maxMin.textContent = `Внимание. Не ранее ${YYYYMMDDtoDDMMYYYY(minDate)}. Не позднее ${YYYYMMDDtoDDMMYYYY(maxDate)}`;
    colEl.append(maxMin);
    rowEl.append(colEl);
  }

  const tableEl = document.querySelector('.table-sm');
  tableEl.innerHTML = '';

  const captionEl = components.getTagCaption('Рейтинг по скорости');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH('ФИО курьера');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH(
    'Рейтинг по скорости  ',
    'Рейтинг определяется как деление фактического времени доставки на плановое. Например плановое время доставки 10 минут а фактически курьер успел за 7 минут то рейтинг будет 70 (7мин / 10мин * 100). У самых быстрых курьеров самый низкий рейтинг. Если рейтинг превышает 100 то это означает что курьер чаще возит свои заказы превышая прогнозное время',
  );
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Всего заказов');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Поездки с 1 заказом');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Поездки с 2 заказами');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Поездки с 3 заказами');
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  renderData.forEach((courier) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let fio = components.getTagTD(courier.fio);
    trEl.append(fio);

    let raiting = components.getTagTD (courier.averageRaiting);
    if (+courier.averageRaiting > 160  && +courier.allTrip >= 10) raiting.classList.add('bg-success-subtle');
    if (+courier.averageRaiting > 100 && +courier.averageRaiting < 110 && courier.allTrip >= 10) {
      raiting.classList.add('bg-warning-subtle');
    }
    if (+courier.averageRaiting < 100 && +courier.allTrip >= 10) raiting.classList.add('bg-danger-subtle');
    trEl.append(raiting);

    let allTrip = components.getTagTD(courier.allTrip);
    trEl.append(allTrip);

    let oneOrder = components.getTagTD(courier.oneOrder);
    trEl.append(oneOrder);

    let twoOrder = components.getTagTD(courier.twoOrder);
    trEl.append(twoOrder);

    let threeOrder = components.getTagTD(courier.threeOrder);
    trEl.append(threeOrder);
  });

  tableEl.append(captionEl, theadEl, tBody);
}
