import { getServerApi, getDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { render_interviewTable } from './interviewTable.js';
import { renderDataToPizzeria } from './renderTable_ dismissed.js';
import { render_cancelContact } from './cancelContact.js';

const content = document.querySelector('#content');

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
  const dataFromServer = await getServerApi('dismissed');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const navbar = components.getTagDiv('navbar');
  const dismissed_table = components.getTagDiv('dismissed-table');

  const title = components.getTagH(3, name);
  title.classList.add('text-center');

  content.append(title, navbar, dismissed_table);

  navbar.addEventListener('click', (e) => {
    if (e.target.textContent === 'Выходное интервью') {
      render_interviewTable(dataFromServer);
    }
    if (e.target.textContent === 'Отмена решения') {
      render_cancelContact(getDataToContact(dataFromServer));
    }
  });

  getNavbar(dataFromServer, navbar);
}

function getNavbar(dataFromServer, navbar) {
  const navEl = components.getTagNav();
  const ulEL_nav = components.getTagUL_nav();
  ulEL_nav.classList.add('nav-tabs');
  const navItem = components.getTagLI_navItem();
  ulEL_nav.append(navItem);

  const selectEl = components.getTagSelect();
  selectEl.classList.add('nav-link');
  selectEl.classList.add('nav-Navbar');
  selectEl.classList.add('active');
  let unitsName = [...new Set(dataFromServer.map((el) => el.unitName))];
  unitsName = unitsName.filter((el) => el !== 'Офис').sort();
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    selectEl.append(option);
  });
  navItem.append(selectEl);

  const liEl_prz = components.getTagLI_nav('Выходное интервью');
  liEl_prz.classList.add('nav-Navbar');
  const liEl_ofis = components.getTagLI_nav('Отмена решения');
  liEl_ofis.classList.add('nav-Navbar');
  ulEL_nav.append(navItem, liEl_prz, liEl_ofis);
  navEl.append(ulEL_nav);
  navbar.append(navEl);

  // активация кнопок
  let nav_Navbar = document.querySelectorAll('.nav-Navbar');
  nav_Navbar.forEach((element) => {
    element.addEventListener('click', function (e) {
      nav_Navbar.forEach((el) => {
        el.classList.remove('active');
      });
      if (e.target.className.includes('nav-Navbar')) {
        e.target.classList.add('active');
      }
    });
  });
  filterData(dataFromServer, navbar);
}

function filterData(dataFromServer, navbar) {
  let dataUnit;
  let dataFromServerToContact = getDataToContact(dataFromServer);
  let selectEl = navbar.querySelector('.form-select');

  dataUnit = dataFromServerToContact.filter((el) => el.unitName === 'Тюмень-1');
  renderDataToPizzeria(dataUnit, 'все время');

  selectEl.addEventListener('change', function (e) {
    dataUnit = dataFromServerToContact.filter((el) => el.unitName === e.target.value);
    editDataNoChange(dataUnit, 'все время');
  });

  // сортировка по времени
  const tableContent = document.querySelector('.dismissed-table');
  let filterData;

  tableContent.addEventListener('click', function (e) {

    // сортировка по должности
    let pozitionArr = ['Все', ...new Set(dataUnit.map((el) => el.positionName))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    pozitionArr.forEach((pozition) => {
      if (e.target.textContent === pozition) {
        filterData = dataUnit.filter((el) => el.positionName === pozition);
        editDataNoChange(filterData, 'за все время');
      }
      if (e.target.textContent === 'Все') {
        editDataNoChange(dataUnit, 'за все время');
      }
    });

    // сортировка по дате
    if (e.target.textContent === 'За прошедшие сутки') {
      filterData = dataUnit.filter((el) => {
        let now = new Date();
        return new Date(el.dateOfCall) > new Date(now.setDate(now.getDate() - 1));
      });
      editDataNoChange(filterData, 'за сутки');
    }
    if (e.target.textContent === 'За прошедшие 3 дня') {
      filterData = dataUnit.filter((el) => {
        let now = new Date();
        return new Date(el.dateOfCall) > new Date(now.setDate(now.getDate() - 3));
      });
      editDataNoChange(filterData, 'за 3 дня');
    }
    if (e.target.textContent === 'За последнюю неделю') {
      filterData = dataUnit.filter((el) => {
        let now = new Date();
        return new Date(el.dateOfCall) > new Date(now.setDate(now.getDate() - 7));
      });
      editDataNoChange(filterData, 'за неделю');
    }
    if (
      e.target.textContent === 'Показать за все время' ||
      e.target.textContent === 'Показать все'
    ) {
      editDataNoChange(dataUnit, 'все время');
    }

    // сортировка по менеджеру и управляющему
    if (e.target.textContent === 'Только просроченные управляющим') {
      filterData = dataUnit.filter((el) => el.result === 'Просрочка');
      editDataNoChange(filterData, 'все время');
    }
    if (e.target.textContent === 'В работе управляющего (пустые)') {
      filterData = dataUnit.filter((el) => !el.result);
      editDataNoChange(filterData, 'все время');
    }
  });
}

//Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, time) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderDataToPizzeria(data, time);
  }
}

function getDataToContact(dismissed) {
  const result = [];
  for (const staff of dismissed) {
    if (!staff.contact) continue;
    staff.contact.forEach((contact) => {
      result.push({
        staffId: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        patronymicName: staff.patronymicName,
        phoneNumber: staff.phoneNumber,
        unitName: staff.unitName,
        positionName: staff.positionName,
        status: staff.status,
        hiredOn: staff.hiredOn,
        dismissedOn: staff.dismissedOn,
        dismissalComment: staff.dismissalComment,
        dismissalReason: staff.dismissalReason,
        commentHR: staff.commentHR,
        dateBack: staff.dateBack,
        furtherCall: staff.furtherCall,
        dateOfCall: contact.dateOfCall,
        resolutionManager: contact.resolutionManager,
        countCall: contact.countCall,
        violation: contact.violation,
        message: contact.message,
        result: contact.result,
        idContact: contact.idContact,
        cancelResolutionHR: contact.cancelResolutionHR,
      });
    });
  }
  return result;
}
