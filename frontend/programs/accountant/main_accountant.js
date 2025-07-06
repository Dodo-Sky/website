import { postDataServer } from '../../apiServer.js';
import { getTagDiv } from '../../components.js';
import * as components from '../../components.js';

export async function render() {
  // навигация по админке
  const naviEl = components.getTagUL_nav();
  naviEl.classList.add('nav-tabs');

  const parking_payment = components.getTagLI_nav('Оплата парковки');
  parking_payment.classList.add('parking_payment');
  parking_payment.classList.add('active');

  naviEl.append(parking_payment);

  const content = document.querySelector('#content');

  const content_accountant = getTagDiv('content_accountant');
  content.append(naviEl, content_accountant);

  render_parking_payment();
}

async function render_parking_payment() {
  const content = document.querySelector('.content_accountant');

  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const departmentName = localStorage.getItem('departmentName');
  const parking_payment_arr = await postDataServer('parking_payment', {
    departmentName: departmentName,
  });
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';
  content.innerHTML = '';

  const tbl = components.getTagTable();
  tbl.classList.add('table-sm');
  content.append (tbl);

  const caption = components.getTagCaption('Список выплат за парковки');
  const thead = buildParkingHeader();
  const tbody = buildParkingBody(parking_payment_arr);

  tbl.append(caption, thead, tbody);
}

const buildParkingHeader = () => {
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    ['ФИО', 'Сумма', 'Описание выплаты', 'Дата выплаты'].forEach((label) => {
      const th = components.getTagTH(label);
      tr.append(th);
    });
  
    thead.append(tr);
    return thead;
  }

  const buildParkingBody = (data) => {
    console.log(data);
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');
  
    data.forEach(pay => {
      const tr = components.getTagTR();
      const tdFio = components.getTagTD(pay.fio);
      const tdAmount = components.getTagTD(pay.amount);
      const td_comment = components.getTagTD(pay.comment);
      const td_onlocal = components.getTagTD(pay.onlocal);  
      tr.append(tdFio, tdAmount, td_comment, td_onlocal);
      tbody.append(tr);
    });
    return tbody;
  }
