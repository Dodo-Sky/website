import { getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderTable } from './renderTable_idTelegramm.js';

//Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, staffData) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(data, staffData);
  }
}

const content = document.getElementById('content');

export async function render(name, breadcrumbs) {
  const breadcrumb = document.querySelector('.breadcrumb');
  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumb(breadcrumbs);
  let navControlEl = components.getTagLI_breadcrumbActive(name);
  breadcrumb.append(navMainEl, navManaergEl, navControlEl);

  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;

  const departmentName = localStorage.getItem('departmentName');
  let staffData = await getServerApi(`${departmentName}/staffData`);
  staffData = staffData.filter(
    (el) => el.status !== 'Dismissed' && !el.lastName.includes('Управляющий') && el.staffType !== 'PersonalManager',
  );
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  let row1 = components.getTagDiv('row');
  const units = components.getTagDiv('col-auto');
  units.setAttribute('id', 'units');
  row1.append(units);

  const ulEl = components.getTagUL_nav();
  ulEl.classList.add('nav-tabs');
  const idTelegrammDelivery = components.getTagLI_nav('ID телеграмм курьеров');
  idTelegrammDelivery.classList.add('idTelegramm-nav');
  idTelegrammDelivery.classList.add('couriers');
  idTelegrammDelivery.classList.add('active');
  const idTelegrammKitchen = components.getTagLI_nav('ID телеграмм сотрудников кухни');
  idTelegrammKitchen.classList.add('idTelegramm-nav');

  ulEl.append(idTelegrammDelivery, idTelegrammKitchen);

  const divEl = components.getTagDiv('table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');
  content.append(title, row1, ulEl, divEl);

  getListUnits(staffData);
}

async function getListUnits(staffData) {
  const departmentName = localStorage.getItem('departmentName');
  const unitsSettings = await getServerApi(`unitsSettings`);
  let unitsName = unitsSettings
    .filter((el) => el.departmentName === departmentName && (el.type === 'Пиццерия' || el.type === 'ПРЦ'))
    .map((el) => el.unitName)
    .sort();
  const select = components.getTagSelect();
  select.classList.add('selectUnit');
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    select.append(option);
  });

  const unitsEl = document.getElementById('units');
  unitsEl.append(select);
  filterData(staffData, unitsName);
}

const courierPositionName = [
  'Авто, личное ТС',
  'Пеший',
  'Электро/Вело, личное ТС',
  'Мото, личное ТС',
  'Мото, ТС компании',
  'Авто, ТС компании',
  'Электро/Вело, ТС компании',
];

function filterData(staffData, unitsName) {
  let staffDataPizzeria = staffData.filter((el) => el.unitName === unitsName[0]);
  let filterStaff;

  filterStaff = staffDataPizzeria.filter((el) => courierPositionName.includes(el.positionName));
  renderTable(filterStaff, staffData);

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    staffDataPizzeria = staffData.filter((el) => el.unitName === e.target.value);
    liEl.forEach((element) => element.classList.remove('active'));
    document.querySelector('.couriers').classList.add('active');
    filterStaff = staffDataPizzeria.filter((el) => courierPositionName.includes(el.positionName));
    editDataNoChange(filterStaff, staffData);
  });

  let liEl = document.querySelectorAll('.idTelegramm-nav');
  liEl.forEach((el) => {
    el.addEventListener('click', function (e) {
      liEl.forEach((element) => element.classList.remove('active'));
      e.target.classList.add('active');
      if (e.target.textContent === 'ID телеграмм курьеров') {
        filterStaff = staffDataPizzeria.filter((el) => courierPositionName.includes(el.positionName));
        editDataNoChange(filterStaff, staffData);
      } else {
        filterStaff = staffDataPizzeria.filter((el) => !courierPositionName.includes(el.positionName));
        editDataNoChange(filterStaff, staffData);
      }
    });
  });

  document.getElementById('content').addEventListener('click', function (e) {
    if (e.target.textContent === 'Без id') {
      let filterIdTelegramm = filterStaff.filter((el) => !el.idTelegramm);
      editDataNoChange(filterIdTelegramm, staffData);
    }
    if (e.target.textContent === 'Все сотрудники') {
      editDataNoChange(filterStaff, staffData);
    }
  });
}
