import * as components from '../../../components.js';
import { postDataServer } from '../../../apiServer.js';

export const renderPremium = async () => {
  const departmentName = localStorage.getItem('departmentName');
  const unitName = document.querySelector('.selectUnit').value;
  const content = document.querySelector('#bad-trips-tabs-content #premium-tab');
  content.innerHTML = '';

  const premiumArr = await fetchPremium(unitName);
  const table = buildTable(content);
  renderTable(premiumArr, table);
  attachRowHandlers(premiumArr);
};

const fetchPremium = async (unitName) =>
  await postDataServer('render_bonus', { unitName });

const buildTable = (container) => {
  const table = components.getTagTable();
  table.classList.add('table-sm');
  container.append(table);
  return table;
};

const renderTable = (data, table) => {
  table.innerHTML = '';
  const caption = components.getTagCaption(
    'Еженедельный бонус в зависимости от рейтинга скорости (не менее 40 заказов). 1 место - большая пицца, 2 место - средняя, 3 место - маленькая',
  );
  const thead = buildHeader();
  const tbody = buildBody(data);
  table.append(caption, thead, tbody);
};

const buildHeader = () => {
  const thead = components.getTagTHead();
  thead.classList.add('sticky-top');
  const tr = components.getTagTR();
  [
    'Номер недели',
    'Период',
    'ФИО',
    'Бонус',
    'Рейтинг по скорости',
    'Кол-во заказов',
    'Промокод',
    'Основание',
    'Ваше решение',
    'Действие',
  ].forEach((text) => tr.append(components.getTagTH(text)));
  thead.append(tr);
  return thead;
};

const buildBody = (data) => {
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  data.forEach((premium) => {
    const tr = components.getTagTR();
    ['week', 'date_week', 'fio', 'bonus', 'avg_raiting', 'all_orders'].forEach((key) =>
      tr.append(components.getTagTD(premium[key])),
    );

    const promoTd = components.getTagTD(
      premium.hidden_promocode || 'Нет свободного промокода',
    );
    tr.append(promoTd);

    const reasonTd = components.getTagTD(premium.reason_promo);
    tr.append(reasonTd);

    const resolutionTd = createResolutionTd(premium.resolution);
    tr.append(resolutionTd);

    const actionTd = createActionTd(premium);
    tr.append(actionTd);

    tBody.append(tr);
  });

  return tBody;
};

const createResolutionTd = (resolution) => {
  const td = components.getTagTD();
  let text = 'На рассмотрении';
  if (resolution === false) text = 'Отказано';
  else if (resolution === true) text = 'Промокод отправлен курьеру';
  td.textContent = text;
  return td;
};

const createActionTd = (premium) => {
  const td = components.getTagTD();
  const okBtn = components.getTagButton('Подтвердить');
  okBtn.className = 'btn btn-outline-success btn-sm me-2 button_ok';
  const cancelBtn = components.getTagButton('Отказ');
  cancelBtn.className = 'btn btn-outline-danger btn-sm button_cancel';

  if (!premium.promocode || premium.resolution !== null) {
    okBtn.disabled = true;
    cancelBtn.disabled = true;
  }

  td.append(okBtn, cancelBtn);
  return td;
};

const attachRowHandlers = (data) => {
  const rows = Array.from(
    document.querySelectorAll('#bad-trips-tabs-content #premium-tab .tBody tr'),
  );
  rows.forEach((row, idx) => {
    const premium = data[idx];
    const [okBtn, cancelBtn] = row.querySelectorAll('button');
    cancelBtn.addEventListener('click', () => handleResolution(premium, false));
    okBtn.addEventListener('click', () => handleResolution(premium, true));
  });
};

const handleResolution = async (premium, isConfirmed) => {
  premium.resolution = isConfirmed;
  premium.is_send_promocode = isConfirmed;
  const endpoint = isConfirmed ? 'corfirm_resolution' : 'cancel_resolution';
  await postDataServer(endpoint, { premium });
  await renderPremium();
};
