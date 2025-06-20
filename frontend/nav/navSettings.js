import * as components from '../components.js';
import { main_unitsSettings } from '../programs/unitsSettings/main-unitsSettings.js';
import { settingsBadTrips } from '../programs/badTrips/settings.js';

const content = document.getElementById('content');

export function renderLeftNav() {
  content.innerHTML = '';
  const divEl_row = components.getTagDiv('row');
  const divEl_navLeft = components.getTagDiv('navLeft');
  divEl_navLeft.classList.add('col-md-3');

  const nav = components.getTagUL_nav();
  nav.classList.add('flex-column');
  nav.classList.add('nav-underline');
  nav.classList.add('bg-body-tertiary');

  const navUnits = components.getTagLI_nav('Настройка подразделений');
  navUnits.classList.add('active');
  navUnits.classList.add('leftMenu');
  // const navSettingPay = components.getTagLI_nav("Настройки динамичной оплаты");
  // navSettingPay.classList.add("leftMenu");
  // const navSupply = components.getTagLI_nav('Настройки уведомления сырья');
  // navSupply.classList.add('leftMenu');
  const badTrips = components.getTagLI_nav('Проблемные поездки');
  badTrips.classList.add('leftMenu');

  nav.append(navUnits, badTrips);
  // nav.append(navUnits, navSettingPay, navSupply, badTrips);
  divEl_navLeft.append(nav);

  //подготвка контейнера для контента настроек
  const divEl_content = components.getTagDiv('contentSetting');
  divEl_content.classList.add('col-md-9');

  divEl_row.append(divEl_navLeft, divEl_content);
  content.append(divEl_row);

  main_unitsSettings();
  makeActiveNav();
  getActiveSettingsMenu();
}

// отрисовка активные/неактивные кнопки левого меню навигации
function makeActiveNav() {
  const navItems = document.querySelectorAll('.leftMenu');
  navItems.forEach((navItem) => {
    navItem.addEventListener('click', function (e) {
      navItems.forEach((el) => el.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
}

//   запуск программ-настроек с левого меню навигации
function getActiveSettingsMenu() {
  const contentSetting = document.querySelector('.contentSetting');
  const navItems = document.querySelectorAll('.leftMenu');
  navItems.forEach((navItem) => {
    navItem.addEventListener('click', async function (e) {
      if (e.target.textContent === 'Настройки динамичной оплаты') {
        contentSetting.innerHTML = '';
        const module = await import('../programs/settingPayout/renderTable.js');
        module.renderTable();
      }

      if (e.target.textContent === 'Настройка подразделений') {
        contentSetting.innerHTML = '';
        main_unitsSettings();
      }

      if (e.target.textContent === 'Настройки уведомления сырья') {
        contentSetting.innerHTML = '';
        const titte = components.getTagH(5, `Программа ${e.target.textContent} в разработке`);
        titte.classList.add('text-center');
        contentSetting.append(titte);
      }

      if (e.target.textContent === 'Проблемные поездки') {
        contentSetting.innerHTML = '';
        const title = e.target.textContent;
        settingsBadTrips(title);
      }
    });
  });
}
