import * as components from '../../../components.js';
import { postDataServer } from '../../../apiServer.js';
import { startOfWeek, endOfWeek, addDays, format } from "date-fns";


// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

function parseDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

// export async function renderRating () {
//   const departmentName = localStorage.getItem('departmentName');
//   const selectUnit = document.querySelector('.selectUnit');
//   const content = document.querySelector('#bad-trips-tabs-content #rating-tab');
//   content.innerHTML = '';
//
//   // даты
//   let now = new Date();
//   now.setHours(now.getHours());
//   const dateTo = now.toISOString().slice(0, 10);
//
//   let fromEl = new Date();
//   fromEl.setHours(fromEl.getHours());
//   fromEl.setDate(fromEl.getDate() - 30);
//   const dateFrom = fromEl.toISOString().slice(0, 10);
//
//   // добавление периода
//   let rowEl = components.getTagDiv('row');
//   rowEl.classList.add('g-3');
//   rowEl.classList.add('rowEl');
//   content.append(rowEl);
//
//   let colEl = components.getTagDiv('col-auto');
//   colEl.textContent = 'Выберете период';
//   rowEl.append(colEl);
//
//   colEl = components.getTagDiv('col-auto');
//   rowEl.append(colEl);
//
//   let rowEl1 = components.getTagDiv('row');
//   rowEl1.classList.add('g-3');
//   colEl.append(rowEl1);
//   let labelFrom = components.getTagLabel('inputFrom', 'C: ');
//   labelFrom.classList.add('col');
//   let inputFrom = components.getTagInput('date', dateFrom);
//   inputFrom.classList.add('col');
//   inputFrom.setAttribute('id', 'inputFrom');
//   rowEl1.append(labelFrom, inputFrom);
//
//   rowEl1 = components.getTagDiv('row');
//   rowEl1.classList.add('g-3');
//   colEl.append(rowEl1);
//   let labelTo = components.getTagLabel('labelTo', 'По: ');
//   labelTo.classList.add('col');
//   let inputTo = components.getTagInput('date', dateTo);
//   inputTo.classList.add('col');
//   inputTo.setAttribute('id', 'inputTo');
//   rowEl1.append(labelTo, inputTo);
//
//   colEl = components.getTagDiv('col-auto');
//   let btnEl = components.getTagButton('Выбрать');
//   colEl.append(btnEl);
//   btnEl.classList.add('arrayData-btn-save');
//   rowEl.append(colEl);
//
//   const tableEl = components.getTagTable();
//   tableEl.classList.add('table-sm');
//   content.append(tableEl);
//
//   const requestStart = {
//     departmentName,
//     unitName: selectUnit.value,
//     dateFrom: inputFrom.value,
//     dateTo: inputTo.value,
//   };
//
//   const renderDataStart = await postDataServer ('couriersRaiting', requestStart);
//
//   const {minDate, maxDate} = (await postDataServer('minMaxDate', {unitName : selectUnit.value}))[0];
//   renderTable(renderDataStart, minDate, maxDate);
//
//   btnEl.addEventListener('click', async () => {
//     if (minDate > inputFrom.value) {
//       alert(`Минимальная дата не ранее ${parseDate(minDate)}`);
//       return;
//     }
//
//     const request = {
//       departmentName,
//       unitName: selectUnit.value,
//       dateFrom: inputFrom.value,
//       dateTo: inputTo.value,
//     };
//     let renderData = await postDataServer('couriersRaiting', request);
//     renderTable (renderData, minDate, maxDate);
//   });
// }
//
// function renderTable(renderData, minDate, maxDate) {
//   const rowEl = document.querySelector('.rowEl');
//   const colEl = document.querySelector('.colEl');
//
//   if (!colEl) {
//     const colEl = components.getTagDiv('col-auto');
//     colEl.classList.add('colEl');
//     let maxMin = components.getTagSpan();
//     maxMin.textContent = `Внимание. Не ранее ${parseDate(minDate)}. Не позднее ${parseDate(maxDate)}`;
//     colEl.append(maxMin);
//     rowEl.append(colEl);
//   }
//
//   const tableEl = document.querySelector('#bad-trips-tabs-content #rating-tab table');
//   tableEl.innerHTML = '';
//
//   const captionEl = components.getTagCaption('Рейтинг по скорости');
//
//   // Заголовок таблицы THead
//   const theadEl = components.getTagTHead();
//   theadEl.classList.add('sticky-top');
//   let trEl = components.getTagTR();
//
//   let thEl = components.getTagTH('ФИО курьера');
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   thEl = components.getTagTH(
//     'Рейтинг по скорости  ',
//     'Рейтинг определяется как деление планового времени доставки на фактическое. Например плановое время доставки 10 минут а фактически курьер успел за 8 минут то рейтинг будет 125 ( 10мин  / 8мин * 100). У самых быстрых курьеров самый высокий рейтинг. Если рейтинг превышает ниже 100 то это означает что курьер чаще возит свои заказы превышая прогнозное время',
//   );
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   thEl = components.getTagTH('Всего заказов');
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   thEl = components.getTagTH('Поездки с 1 заказом');
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   thEl = components.getTagTH('Поездки с 2 заказами');
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   thEl = components.getTagTH('Поездки с 3 заказами');
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   // Тело таблицы tBody
//   const tBody = components.getTagTBody();
//   tBody.classList.add('tBody');
//
//   renderData.forEach((courier) => {
//     trEl = components.getTagTR();
//     tBody.append(trEl);
//     let fio = components.getTagTD(courier.fio);
//     trEl.append(fio);
//
//     let rating = components.getTagTD (courier.averageRaiting);
//     if (+courier.averageRaiting > 160  && +courier.allTrip >= 10) rating.classList.add('bg-success-subtle');
//     if (+courier.averageRaiting > 100 && +courier.averageRaiting < 110 && courier.allTrip >= 10) {
//       rating.classList.add('bg-warning-subtle');
//     }
//     if (+courier.averageRaiting < 100 && +courier.allTrip >= 10) rating.classList.add('bg-danger-subtle');
//     trEl.append(rating);
//
//     let allTrip = components.getTagTD(courier.allTrip);
//     trEl.append(allTrip);
//
//     let oneOrder = components.getTagTD(courier.oneOrder);
//     trEl.append(oneOrder);
//
//     let twoOrder = components.getTagTD(courier.twoOrder);
//     trEl.append(twoOrder);
//
//     let threeOrder = components.getTagTD(courier.threeOrder);
//     trEl.append(threeOrder);
//   });
//
//   tableEl.append(captionEl, theadEl, tBody);
// }

export const renderRating = async () => {
  const departmentName = localStorage.getItem('departmentName');
  const selectUnit = document.querySelector('.selectUnit');
  const content = document.querySelector('#bad-trips-tabs-content #rating-tab');
  content.innerHTML = '';

  const { inputFrom, inputTo, btnApply } = buildPeriodSelector(content);
  const unitName = selectUnit.value;

  const [initData, { minDate, maxDate }] = await Promise.all([
    fetchRating(departmentName, unitName, inputFrom.value, inputTo.value),
    fetchMinMaxDate(unitName),
  ]);

  renderTable(content, initData, minDate, maxDate);
  attachPeriodHandler(btnApply, departmentName, selectUnit, inputFrom, inputTo, minDate, maxDate);
}

const buildPeriodSelector = (container) => {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = addDays(thisWeekStart, -7)
  const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 })

  const row = components.getTagDiv('row');
  row.classList.add('g-3', 'rowEl');
  container.append(row);

  const label = components.getTagDiv('col-auto');
  label.textContent = 'Выберете период';
  row.append(label);

  const cols = components.getTagDiv('col-auto');
  row.append(cols);

  const groupFrom = components.getTagDiv('row');
  groupFrom.classList.add('g-3');
  const lblFrom = components.getTagLabel('inputFrom', 'C: ');
  lblFrom.classList.add('col');
  const inputFrom = components.getTagInput('date', format(lastWeekStart, "yyyy-MM-dd"));
  inputFrom.id = 'inputFrom';
  inputFrom.classList.add('col');
  groupFrom.append(lblFrom, inputFrom);
  cols.append(groupFrom);

  const groupTo = components.getTagDiv('row');
  groupTo.classList.add('g-3');
  const lblTo = components.getTagLabel('labelTo', 'По: ');
  lblTo.classList.add('col');
  const inputTo = components.getTagInput('date', format(lastWeekEnd, "yyyy-MM-dd"));
  inputTo.id = 'inputTo';
  inputTo.classList.add('col');
  groupTo.append(lblTo, inputTo);
  cols.append(groupTo);

  const btnCol = components.getTagDiv('col-auto');
  const btnApply = components.getTagButton('Выбрать');
  btnApply.classList.add('arrayData-btn-save');
  btnCol.append(btnApply);
  row.append(btnCol);

  const tbl = components.getTagTable();
  tbl.classList.add('table-sm');
  container.append(tbl);

  return { inputFrom, inputTo, btnApply };
}

const fetchRating = async (departmentName, unitName, dateFrom, dateTo) => {
  const request = { departmentName, unitName, dateFrom, dateTo };
  return await postDataServer('couriersRaiting', request);
}

const fetchMinMaxDate = async (unitName) => {
  const res = await postDataServer('minMaxDate', { unitName });
  return res[0];
}

const attachPeriodHandler = (btn, departmentName, selectUnit, inputFrom, inputTo, minDate, maxDate) => {
  btn.addEventListener('click', async () => {
    if (inputFrom.value < minDate) {
      alert(`Минимальная дата не ранее ${parseDate(minDate)}`);
      return;
    }
    const data = await fetchRating(departmentName, selectUnit.value, inputFrom.value, inputTo.value);
    renderTable(document.querySelector('#bad-trips-tabs-content #rating-tab'), data, minDate, maxDate);
  });
}

const renderTable = (container, data, minDate, maxDate) => {
  ensureMinMaxNotice(container, minDate, maxDate);

  const table = container.querySelector('table');
  table.innerHTML = '';

  const caption = components.getTagCaption('Рейтинг по скорости');
  const thead = buildRatingHeader();
  const tbody = buildRatingBody(data);

  table.append(caption, thead, tbody);
}

const ensureMinMaxNotice = (container, minDate, maxDate) => {
  if (!container.querySelector('.colEl')) {
    const noticeCol = components.getTagDiv('col-auto');
    noticeCol.classList.add('colEl');
    const span = components.getTagSpan();
    span.textContent = `Внимание. Не ранее ${parseDate(minDate)}. Не позднее ${parseDate(maxDate)}`;
    noticeCol.append(span);
    container.querySelector('.rowEl').append(noticeCol);
  }
}

const buildRatingHeader = () => {
  const thead = components.getTagTHead();
  thead.classList.add('sticky-top');
  const tr = components.getTagTR();

  const tooltipText = 'Рейтинг определяется как деление планового времени доставки на фактическое. Например плановое время доставки 10 минут а фактически курьер успел за 8 минут то рейтинг будет 125 ( 10мин  / 8мин * 100). У самых быстрых курьеров самый высокий рейтинг. Если рейтинг превышает ниже 100 то это означает что курьер чаще возит свои заказы превышая прогнозное время';

  [
    ['ФИО курьера', null],
    ['Рейтинг по скорости  ', tooltipText],
    ['Всего заказов', null],
    ['Поездки с 1 заказом', null],
    ['Поездки с 2 заказами', null],
    ['Поездки с 3 заказами', null],
  ].forEach(([label, title]) => {
    const th = components.getTagTH(label, title);
    tr.append(th);
  });

  thead.append(tr);
  return thead;
}

const buildRatingBody = (data) => {
  const tbody = components.getTagTBody();
  tbody.classList.add('tBody');

  data.forEach(courier => {
    const tr = components.getTagTR();

    const tdFio = components.getTagTD(courier.fio);
    const tdRating = components.getTagTD(courier.averageRaiting);
    applyRatingStyles(tdRating, +courier.averageRaiting, +courier.allTrip);
    const tdAll = components.getTagTD(courier.allTrip);
    const td1 = components.getTagTD(courier.oneOrder);
    const td2 = components.getTagTD(courier.twoOrder);
    const td3 = components.getTagTD(courier.threeOrder);

    tr.append(tdFio, tdRating, tdAll, td1, td2, td3);
    tbody.append(tr);
  });

  return tbody;
}

const applyRatingStyles = (td, rating, trips) => {
  if (trips < 10) return;

  if (rating > 160) {
    td.classList.add('bg-success-subtle');
  } else if (rating > 100 && rating < 110) {
    td.classList.add('bg-warning-subtle');
  } else if (rating < 100) {
    td.classList.add('bg-danger-subtle');
  }
}
