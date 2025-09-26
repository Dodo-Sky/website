import * as components from '../../../components.js';
import { postDataServer } from '../../../apiServer.js';

function parseDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

export const renderRating = async (searchParams) => {
  const spinner = document.querySelector('#bad-trips-tabs-content #rating-tab #bad-trips-rating-spinner');
  const content = document.querySelector('#bad-trips-tabs-content #rating-tab #rating-content');
  content.innerHTML = '';

  const { inputFrom, inputTo, btnApply } = components.getPeriodSelector(content);

  const [initData, { minDate, maxDate }] = await Promise.all([
    fetchRating(searchParams.unitId, inputFrom.value, inputTo.value),
    fetchMinMaxDate(searchParams.unitId),
  ]);

  renderTable(content, initData, minDate, maxDate);
  attachPeriodHandler(btnApply, searchParams.unitId, inputFrom, inputTo, minDate, maxDate);

  spinner.style.display = 'none';
}

const fetchRating = async (unitId, dateFrom, dateTo) => {
  const request = { unitId, dateFrom, dateTo };
  return await postDataServer('couriersRaiting', request);
}

const fetchMinMaxDate = async (unitId) => {
  const res = await postDataServer('minMaxDate', { unitId });
  return res[0];
}

const attachPeriodHandler = (btn, unitId, inputFrom, inputTo, minDate, maxDate) => {
  btn.addEventListener('click', async () => {
    if (inputFrom.value < minDate) {
      alert(`Минимальная дата не ранее ${parseDate(minDate)}`);
      return;
    }
    document.querySelector('#rating-table').remove();
    const data = await fetchRating(unitId, inputFrom.value, inputTo.value);
    renderTable(document.querySelector('#bad-trips-tabs-content #rating-tab'), data, minDate, maxDate);
  });
}

const renderTable = (container, data, minDate, maxDate) => {
  ensureMinMaxNotice(container, minDate, maxDate);

  const table = components.getTagTable();
  table.classList.add('table-sm');
  table.id = 'rating-table';
  container.append(table);

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
  const tooltip_average_deliveryTime = 'Рассчитывается среднее время поездки курьера по всем заказам за выбранный период. Время поездки до гостя, то есть с момента как курьер нажал кнопку "Поехали" до времени отметки о передаче заказа гостю';
  const tooltip_avg_distance = 'Рассчитывается среднее расстояние до гостя и обратно';

  [
    ['ФИО курьера', null],
    ['Рейтинг по скорости', tooltipText],
    ['Cертификаты', null],
    ['Всего заказов', null],
    ['Проблемные поездки', null],
    ['Среднее время поездки', tooltip_average_deliveryTime],
    ['Среднее расстояние', tooltip_avg_distance],
    ['1 заказ за поездку', null],
    ['2 заказа за поездку', null],
    ['3 заказа за поездку', null],
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

    applyRatingStyles(tdRating, courier.averageRaiting, courier.allTrip)

    const certificate_all = components.getTagTD(courier.certificate_all);
    const tdAll = components.getTagTD(courier.allTrip);
    const problem_count = components.getTagTD(courier.problem_count);
    const average_deliveryTime = components.getTagTD(courier.average_deliveryTime);
    const avg_distance = components.getTagTD(courier.avg_distance);
    const td1 = components.getTagTD(courier.oneOrder);
    const td2 = components.getTagTD(courier.twoOrder);
    const td3 = components.getTagTD(courier.threeOrder);

    tr.append(tdFio, tdRating, certificate_all, tdAll, problem_count, average_deliveryTime, avg_distance, td1, td2, td3);
    tbody.append(tr);
  });

  return tbody;
}

const applyRatingStyles = (td, rating, trips) => {
  if (trips <= 15) return;

  if (rating > 160) {
    td.classList.add('bg-success-subtle');
  } else if (rating > 100 && rating < 110) {
    td.classList.add('bg-warning-subtle');
  } else if (rating < 100) {
    td.classList.add('bg-danger-subtle');
  }
}
