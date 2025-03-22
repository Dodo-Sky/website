import {
  clearAuthData,
  getLoginForm,
  getUserRole,
  isLoggedIn,
  getUserFioAndUnitName,
} from '../auth/login.js';
import * as components from '../components.js';
const content = document.getElementById('content');

const authInfo = document.querySelector('.auth-info');

// Навигация сверху (хлебные крошки)
const breadcrumb = document.querySelector('.breadcrumb');
breadcrumb.addEventListener('click', function (e) {
  if (e.target?.textContent === 'Главная') showNavMain();
  if (e.target?.textContent === 'Администратор') showNavAdmin();
  if (e.target?.textContent === 'Менеджер офиса') showNavOfis();
  if (e.target?.textContent === 'Управляющий') showNavUnitDirector();
  if (e.target?.textContent === 'Менеджер смены') showNavManager();
});

export function showNavMain() {
  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumbActive('Главная');
  breadcrumb.append(navMainEl);
  if (!isLoggedIn()) {
    content.innerHTML = getLoginForm(() => window.location.reload());
    return;
  }

  const role = getUserRole();

  // первый уровень после авторизации
  let cardRow = components.getCardRow();
  let adminUser = components.getCardNav('Администратор', 'Настройка прав доступа');
  let ofisUser = components.getCardNav('Менеджер офиса', 'Параметры с настройками');
  let unitDirector = components.getCardNav('Управляющий', 'Тут находятся программы');
  let managerUser = components.getCardNav('Менеджер смены', 'Тут находятся программы');

  switch (role) {
    case 'администратор':
      cardRow.append(adminUser, ofisUser, unitDirector, managerUser);
      break;
    case 'менеджер офиса':
      cardRow.append(ofisUser, unitDirector, managerUser);
      break;
    case 'управляющий':
      cardRow.append(unitDirector, managerUser);
      break;
    case 'Гость':
      cardRow.append(unitDirector, managerUser);
      break;
    case 'менеджер смены':
      cardRow.append(managerUser);
      break;
    default:
      alert('Нет информации о роли');
      clearAuthData();
      window.location.reload();
  }
  content.innerHTML = '';
  content.append(cardRow);

  authInfo.innerHTML = '';
  authInfo.append(
    components.getTagP(getUserFioAndUnitName()),
    components.getTagButton_logout(),
  );
}

// старт программ
content.addEventListener('click', async function (e) {
  // Запуск подразделов
  if (e.target?.dataset?.id === 'Управляющий') showNavUnitDirector();
  if (e.target?.dataset?.id === 'Администратор') showNavAdmin();
  if (e.target?.dataset?.id === 'Менеджер офиса') showNavOfis();
  if (e.target?.dataset?.id === 'Менеджер смены') showNavManager();

  // Запуск программ
  if (e.target?.dataset?.id === 'Контроль брака') {
    const nameProgramm = e.target.previousSibling.previousSibling.textContent;
    let breadcrumbs = breadcrumb.lastChild.textContent;
    const module = await import('../programs/defects/main_defects.js');
    module.render(nameProgramm, breadcrumbs);
  }

  if (e.target?.dataset?.id === 'Проблемные поездки') {
    const nameProgramm = e.target.previousSibling.previousSibling.textContent;
    let breadcrumbs = breadcrumb.lastChild.textContent;
    const module = await import('../programs/badTrips/main_badTrips.js');
    module.render(nameProgramm, breadcrumbs);
  }

  if (e.target?.dataset?.id === 'ID телеграмм') {
    const nameProgramm = e.target.previousSibling.previousSibling.textContent;
    let breadcrumbs = breadcrumb.lastChild.textContent;
    const module = await import('../programs/IdTelegramm/main_idTelegramm.js');
    module.render(nameProgramm, breadcrumbs);
  }

  if (e.target?.dataset?.id === 'Соблюдение дисциплины') {
    const nameProgramm = e.target.previousSibling.previousSibling.textContent;
    let breadcrumbs = breadcrumb.lastChild.textContent;
    const module = await import('../programs/discipline/main_ discipline.js');
    module.render(nameProgramm, breadcrumbs);
  }

  if (e.target?.dataset?.id === 'Обзвон уволенных') {
    const nameProgramm = e.target.previousSibling.previousSibling.textContent;
    let breadcrumbs = breadcrumb.lastChild.textContent;
    const module = await import('../programs/dismissed/main_dismissed.js');
    module.render(nameProgramm, breadcrumbs);
  }
});

// навигация администратор
async function showNavAdmin() {
  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumbActive('Администратор');
  breadcrumb.append(navMainEl, navManaergEl);
  authInfo.innerHTML = '';
  authInfo.append(
    components.getTagP(getUserFioAndUnitName()),
    components.getTagButton_logout(),
  );

  const content = document.getElementById('content')
  content.innerHTML = ''
  const module = await import('../programs/admin/main_admin.js');
  module.render();
}

// навигация менеджера офиса
async function showNavOfis() {
  // спинер
  const content = document.getElementById('content');
  content.innerHTML = `
          <div class="spinner-border" role="status">
          <span class="visually-hidden">Загрузка...</span>
          </div>`;
  const module = await import('./navSettings.js');
  module.renderLeftNav();

  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumbActive('Менеджер офиса');
  breadcrumb.append(navMainEl, navManaergEl);

  authInfo.innerHTML = '';
  authInfo.append(
    components.getTagP(getUserFioAndUnitName()),
    components.getTagButton_logout(),
  );
}

// навигация управляющего
function showNavUnitDirector() {
  let cardRow = components.getCardRow();
  let orders = components.getCardNav('Проблемные поездки');
  let diszipline = components.getCardNav('Соблюдение дисциплины');
  let dismissed = components.getCardNav('Обзвон уволенных');
  let badSupply = components.getCardNav('Контроль брака');
  let idTelegramm = components.getCardNav('ID телеграмм');

  cardRow.append(orders, diszipline, badSupply, dismissed, idTelegramm);
  content.innerHTML = '';
  const titte = components.getTagH(5, 'Выберите нужную вам программу');
  titte.classList.add('text-center');
  content.append(titte, cardRow);

  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumbActive('Управляющий');
  breadcrumb.append(navMainEl, navManaergEl);

  authInfo.innerHTML = '';
  authInfo.append(
    components.getTagP(getUserFioAndUnitName()),
    components.getTagButton_logout(),
  );
}

// навигация менеджера смены
function showNavManager() {
  let cardRow = components.getCardRow();
  let diszipline = components.getCardNav('Соблюдение дисциплины');
  let badSupply = components.getCardNav('Контроль брака');

  cardRow.append(diszipline, badSupply);
  content.innerHTML = '';
  const titte = components.getTagH(5, 'Выберите нужную вам программу');
  titte.classList.add('text-center');
  content.append(titte, cardRow);

  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumbActive('Менеджер смены');
  breadcrumb.append(navMainEl, navManaergEl);

  authInfo.innerHTML = '';
  authInfo.append(
    components.getTagP(getUserFioAndUnitName()),
    components.getTagButton_logout(),
  );
}

function showLogin() {
  content.innerHTML = 'страница логина';
}
