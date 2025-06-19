import { getServerApi } from '../../apiServer.js';
import { getTagDiv } from '../../components.js';
import * as components from '../../components.js';
import { renderUsersTable } from './renderTable_admin.js';
import { promocode } from './promo_code.js';


export async function render() {
  // навигация по админке
  const naviEl = components.getTagUL_nav();
  naviEl.classList.add('nav-tabs');

  const users = components.getTagLI_nav('Пользователи');
  users.classList.add('users');
  users.classList.add('active');

  const promo_code = components.getTagLI_nav('Промокоды');
  promo_code.classList.add('promo_code');

  naviEl.append(users, promo_code);

  const content = document.querySelector('#content');

  const content_admin = getTagDiv('content_admin');
  content.append(naviEl, content_admin);

  users.addEventListener('click', () => {
    users.classList.add('active');
    promo_code.classList.remove('active');
    render_user();
  });
  promo_code.addEventListener('click', () => {
    promo_code.classList.add('active');
    users.classList.remove('active');
    promocode ();
  });

  render_user();
}

async function render_user() {
  const content = document.querySelector('.content_admin');

  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  let authTokens = await getServerApi('authTokens');
  authTokens = authTokens.filter((el) => el.departmentName === localStorage.getItem('departmentName'));
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const units = [...new Set(authTokens.map((el) => el.unitName))].sort();
  const roles = [...new Set(authTokens.map((el) => el.role))].sort();

  content.innerHTML = '';

  const row = components.getTagDiv('row');
  content.append(row);
  let col_auto = components.getTagDiv('col-auto');
  row.append(col_auto);

  // Кнопка "Добавить пользователя"
  const addUserBtn = components.getTagButton('Добавить пользователя');
  addUserBtn.classList.add('btn-primary');
  addUserBtn.setAttribute('data-bs-toggle', 'modal');
  addUserBtn.setAttribute('data-bs-target', '#addUserModal');
  col_auto.append(addUserBtn);

  // сортировка по Юниту
  col_auto = components.getTagDiv('col-auto');
  row.append(col_auto);
  let row2 = components.getTagDiv('row');
  col_auto.append(row2);
  col_auto = components.getTagDiv('col-auto');
  row2.append(col_auto);
  let labelEl = components.getTagLabel('sort-unitName', 'По подразделению');
  col_auto.append(labelEl);
  col_auto = components.getTagDiv('col-auto');
  row2.append(col_auto);
  let selectEl = components.getTagSelect();
  selectEl.setAttribute('id', 'sort-unitName');
  col_auto.append(selectEl);
  units.forEach((unit) => {
    let optEl = components.getTagOption(unit, unit);
    selectEl.append(optEl);
  });

  // сортировка по роли
  col_auto = components.getTagDiv('col-auto');
  row.append(col_auto);
  row2 = components.getTagDiv('row');
  col_auto.append(row2);
  col_auto = components.getTagDiv('col-auto');
  row2.append(col_auto);
  labelEl = components.getTagLabel('sort-role', 'По роли');
  col_auto.append(labelEl);
  col_auto = components.getTagDiv('col-auto');
  row2.append(col_auto);
  selectEl = components.getTagSelect();
  selectEl.setAttribute('id', 'sort-role');
  col_auto.append(selectEl);
  roles.forEach((unit) => {
    let optEl = components.getTagOption(unit, unit);
    selectEl.append(optEl);
  });

  const table_admin = getTagDiv('table-admin');
  content.append(table_admin);

  renderUsersTable(authTokens);

  // сортировка по unitName
  const sortUnitName = document.querySelector('#sort-unitName');
  sortUnitName.addEventListener('change', (e) => {
    let filterData = authTokens.filter((el) => el.unitName === e.target.value);
    renderUsersTable(filterData);
  });

  // сортировка по role
  const sortRole = document.querySelector('#sort-role');
  sortRole.addEventListener('change', (e) => {
    let filterData = authTokens.filter((el) => el.role === e.target.value);
    renderUsersTable(filterData);
  });
}
