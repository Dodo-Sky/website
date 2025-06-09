import * as components from '../../components.js';
import { postDataServer } from '../../apiServer.js';

export async function renderPremium() {
  const departmentName = localStorage.getItem('departmentName');
  const selectUnit = document.querySelector('.selectUnit');
  const content = document.querySelector('.badTrips-table');
  content.innerHTML = '';

  const unitNameEl = document.querySelector('.selectUnit');
  const unitName = unitNameEl.value;
  const premiumArr = await postDataServer('couriers_premium', { unitName: unitName });

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  content.append(tableEl);

  const captionEl = components.getTagCaption('Еженедельный бонус в зависимости от рейтинга скорости (не менее 40 заказов). 1 место - большая пицца, 2 место - средняя, 3 место - маленькая');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH('Номер недели');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Период');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('ФИО');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Бонус');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Рейтинг по скорости');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Кол-во заказов');
  trEl.append(thEl);

  thEl = components.getTagTH('Промокод');
  trEl.append(thEl);

  thEl = components.getTagTH('Решение');
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  premiumArr.forEach((premium) => {
    trEl = components.getTagTR();
    tBody.append(trEl);

    let week = components.getTagTD(premium.week);
    trEl.append(week);

    let dateWeek = components.getTagTD(premium.dateWeek);
    trEl.append(dateWeek);

    let fio = components.getTagTD(premium.fio);
    trEl.append(fio);

    let bonus = components.getTagTD(premium.bonus);
    trEl.append(bonus);

    let avgRaiting = components.getTagTD(premium.avgRaiting);
    trEl.append(avgRaiting);

    let allOrders = components.getTagTD(premium.allOrders);
    trEl.append(allOrders);

    let promocode = components.getTagTD();
    if (premium.promocode === null) {
      promocode.textContent = 'На рассмотрении';
    }
    trEl.append(promocode);

    let tdEl = components.getTagTD();
    let okEl = components.getTagButton('Подтвердить');
    okEl.className = 'btn btn-outline-success btn-sm me-2 button_ok';
    tdEl.append(okEl);

    let cancelEl = components.getTagButton('Отказ');
    cancelEl.className = 'btn btn-outline-danger btn-sm button_cancel';
    tdEl.append(cancelEl);
    trEl.append(tdEl);

    if (premium.promocode) {
        promocode.textContent = premium.promocode;
        cancelEl.disabled = true;
        okEl.disabled = true;
      }

    cancelEl.addEventListener('click', async (e) => {
      premium.promocode = 'Отказ';
      const query = await postDataServer('edit_premium', { premium });
      cancelEl.disabled = true;
      okEl.disabled = true;
      console.log(query);
    });
  });

  tableEl.append(captionEl, theadEl, tBody);
}