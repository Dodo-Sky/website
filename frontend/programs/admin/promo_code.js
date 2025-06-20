import { createUser, updateUser, deleteUserByLogin, getUsers, getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { postDataServer } from '../../apiServer.js';

export async function promocode() {
  const content = document.querySelector('.content_admin');
  content.innerHTML = `    
<div class="row">
  <div class="col-4">
    <textarea class="form-control pizza35" placeholder="Промокоды на пиццу 35 см"></textarea>
  </div>
  <div class="col-auto">
    <button type="button" class="btn btn-primary btn_pizza35">Загрузить 35 см</button>
  </div>
</div>

<div class="row">
  <div class="col-4">
    <textarea class="form-control pizza30" placeholder="Промокоды на пиццу 30 см"></textarea>
  </div>
  <div class="col-auto">
    <button type="button" class="btn btn-primary btn_pizza30">Загрузить 30 см</button>
  </div>
</div>

<div class="row">
  <div class="col-4">
    <textarea class="form-control pizza25" placeholder="Промокоды на пиццу 25 см"></textarea>
  </div>
  <div class="col-auto">
    <button type="button" class="btn btn-primary btn_pizza25">Загрузить 25 см</button>
  </div>
</div>
<div class="content_table"></div>    
    `;

  const department_name = localStorage.getItem('departmentName');
  const date_load = new Date().toISOString();
  const btn35 = content.querySelector('.btn_pizza35');
  btn35.addEventListener('click', async () => {
    const textarea = document.querySelector('.pizza35');
    const postData = await postDataServer('set_promocode', {
      promo_code: textarea.value,
      bonus: 'Большая пицца',
      department_name,
      date_load,
    });
    if (postData) textarea.value = '';
  });

  const btn30 = content.querySelector('.btn_pizza30');
  btn30.addEventListener('click', async () => {
    const textarea = document.querySelector('.pizza30');
    const postData = await postDataServer('set_promocode', {
      promo_code: textarea.value,
      bonus: 'Средняя пицца',
      department_name,
      date_load,
    });
    if (postData) textarea.value = '';
  });

  const btn25 = content.querySelector('.btn_pizza25');
  btn25.addEventListener('click', async () => {
    const textarea = document.querySelector('.pizza25');
    const postData = await postDataServer('set_promocode', {
      promo_code: textarea.value,
      bonus: 'Маленькая пицца',
      department_name,
      date_load,
    });
    if (postData) textarea.value = '';
  });

  render_table_promocode();
}

async function render_table_promocode() {
  const tableContent = document.querySelector('.content_table');
  tableContent.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption('Промокоды');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH('Дата добавления');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Промокод');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Бонус');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('ФИО сотрудника');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Дата передачи');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Основание');
  trEl.append(thEl);
  theadEl.append(trEl);

  const department_name = localStorage.getItem('departmentName');
  const promocode_arr = await postDataServer('get_promocode_arr', { department_name: department_name });

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  promocode_arr.forEach((promo) => {
    trEl = components.getTagTR();
    tBody.append(trEl);

    let date_load = components.getTagTD(promo.date_load);
    trEl.append(date_load);

    let promo_code = components.getTagTD(promo.promo_code);
    trEl.append(promo_code);

    let bonus = components.getTagTD(promo.bonus);
    trEl.append(bonus);

    let fio = components.getTagTD(promo.fio);
    trEl.append(fio);

    let date_transfer = components.getTagTD(promo.date_transfer);
    trEl.append(date_transfer);

    let reason_promo = components.getTagTD(promo.reason_promo);
    trEl.append(reason_promo);
  });

  tableEl.append(captionEl, theadEl, tBody);
}
