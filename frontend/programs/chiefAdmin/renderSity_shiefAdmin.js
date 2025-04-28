import { getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { addNewCity } from './newCity.js';

export async function renderСity() {
  const table_admin = document.querySelector('.table-admin');

  table_admin.innerHTML = `
  <div class="spinner-border" role="status">
  <span class="visually-hidden">Загрузка...</span>
  </div>`;

  const departments = await getServerApi('departments');
  const authTokens = await getServerApi('authTokens');

  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  table_admin.innerHTML = '';

  const update = components.getTagDiv('col-auto');
  const btnUpdate = components.getTagButton('Добавить новый город');
  btnUpdate.setAttribute('id', 'update');
  update.append(btnUpdate);
  table_admin.append(update);

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  table_admin.append(tableEl);
  const captionEl = components.getTagCaption('Список городов');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH('Город');
  trEl.append(thEl);

  // thEl = components.getTagTH('departmentUUId');
  // trEl.append(thEl);

  thEl = components.getTagTH('Подразделения');
  trEl.append(thEl);

  thEl = components.getTagTH('Организации');
  trEl.append(thEl);

  thEl = components.getTagTH('access_token');
  trEl.append(thEl);

  thEl = components.getTagTH('Админ - логин');
  trEl.append(thEl);

  thEl = components.getTagTH('Админ - пароль');
  trEl.append(thEl);

  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  departments.forEach((city) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let departmentName = components.getTagTD(city.departmentName);
    trEl.append(departmentName);

    // let departmentUUId = components.getTagTD(city.DepartmentUUId);
    // trEl.append(departmentUUId);

    let units = components.getTagTD(city.units.sort().join(', '));
    trEl.append(units);

    let organizations = components.getTagTD(city.organizations.join(', '));
    trEl.append(organizations);

    let access_token = components.getTagTD(city.access_token);
    trEl.append(access_token);

    const { login } = authTokens.find((el) => el.role === 'администратор' && el.departmentName === city.departmentName);
    let loginEl = components.getTagTD(login);
    trEl.append(loginEl);

    const { password } = authTokens.find(
      (el) => el.role === 'администратор' && el.departmentName === city.departmentName,
    );
    let passwordEl = components.getTagTD(password);
    trEl.append(passwordEl);
  });

  tableEl.append(captionEl, theadEl, tBody);

  btnUpdate.addEventListener('click', () => addNewCity(table_admin, btnUpdate, tableEl));
}