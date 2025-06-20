import { getServerApi, postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderProgram } from './program/index.js';
import { updateProgram } from './program/update.js';
import { renderRating } from './rating/index.js';
import { renderPremium } from './premium/index.js';
import { updatePremium } from './premium/update.js';

const content = document.getElementById('content');

const getActiveTab = () => {
  const tabs = document.querySelectorAll('#bad-trips-tabs-content .tab-pane')
  return Array.from(tabs).find((tab) => tab.classList.contains('active'));
}

const changeActiveTab = (className) => {
  document.querySelectorAll('.tab-pane').forEach((tabPane) => {
    tabPane.classList.remove('active');
    tabPane.classList.remove('show');
  })

  const tab = document.querySelector(className);
  tab.classList.add('active');
  tab.classList.add('show');
}

const fetchData = async () => {
  content.innerHTML = `
    <div class='spinner-border' role='status'>
    <span class='visually-hidden'>Загрузка...</span>
    </div>`;

  const departmentName = localStorage.getItem('departmentName');

  const couriersOrder = await postDataServer('query_couriersOrder', { departmentName: departmentName });
  const unitsSettings = await getServerApi(`unitsSettings`);

  let spinner = document.querySelector('.spinner-border');
  spinner.style.display = 'none';

  return { couriersOrder, unitsSettings };
}

// Проверка данных на отсутствие несохраненных данных
const checkUnsavedChanges = async  (data, time, dataFromServer, filterToCourier) => {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isChanges = false;

  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    if (!btn.disabled) {
      isChanges = true;
      break;
    }
  }

  if (isChanges) {
    alert('Сохраните данные');
  } else {
    await renderProgram(data, time, dataFromServer, filterToCourier);
  }
}

const generateBreadcrumbs = (name, breadcrumbs) => {
  const breadcrumb = document.querySelector('.breadcrumb');

  breadcrumb.innerHTML = '';

  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManagerEl = components.getTagLI_breadcrumb(breadcrumbs);
  let navControlEl = components.getTagLI_breadcrumbActive(name);

  breadcrumb.append(navMainEl, navManagerEl, navControlEl);
}

const generateHeader = () => {
  let row = components.getTagDiv('row');
  const unitsCol = components.getTagDiv('col-auto');
  const sortCol = components.getTagDiv('col-auto');
  row.append(unitsCol, sortCol);

  row.classList.add('mb-3');
  const units = components.getTagDiv('col-auto');
  units.setAttribute('id', 'units');
  unitsCol.append(units);

  const updateEl = components.getTagDiv('col-auto');
  const btnUpdate = components.getTagButton('Обновить');
  btnUpdate.setAttribute('id', 'update');
  updateEl.append(btnUpdate);
  row.append(updateEl);
  btnUpdate.addEventListener('click', async () => {
    const activeTab = getActiveTab();

    if (activeTab) {
      const tabId = activeTab.id

      switch (tabId) {
        case "program-tab":
          await updateProgram()
          break
        case "premium-tab":
          await updatePremium()
          break
      }
    }
  })

  const referenceDiv = components.getTagDiv('col-auto');
  const reference = components.getTagButton('Справка по программе Проблемные поездки');
  reference.classList = 'btn btn-outline-secondary reference';
  referenceDiv.append(reference);
  row.append(referenceDiv);

  reference.addEventListener('click', function (e) {
    window.open('https://docs.google.com/document/d/1fgS1kdMy6bWIAm0Vr0_WQzOISTmEJRnkcOpGarn0DEE/edit?usp=sharing');
  });

  return row;
}

// навигация по программе и рейтингу
const generateNav = async (couriersOrder) => {
  const navEl = components.getTagUL_nav();
  navEl.classList.add('nav-tabs');

  const programEl = components.getTagLI_nav('Программа');
  programEl.id = "program-nav"
  programEl.classList.add('programNav');
  programEl.classList.add('active');

  const ratingEl = components.getTagLI_nav('Рейтинг курьеров');
  ratingEl.id = "rating-nav"
  ratingEl.classList.add('ratingNav');

  const premiumEl = components.getTagLI_nav('Бонусы');
  premiumEl.id = "premium-nav"
  premiumEl.classList.add('premiumNav');

  navEl.append(programEl, ratingEl);

  let role = localStorage.getItem('role');
  if (
      role === 'управляющий' ||
      role === 'менеджер офиса' ||
      role === 'администратор' ||
      role === 'Администратор всей сети'
  ) {
    navEl.append(premiumEl);
  }

  programEl.addEventListener('click', async () => {
    programEl.classList.add('active');
    ratingEl.classList.remove('active');
    premiumEl.classList.remove('active');

    changeActiveTab('#bad-trips-tabs-content #program-tab');
    const selectUnit = document.querySelector('.selectUnit');
    const fullDataUnit = couriersOrder.filter((el) => el.unitName === selectUnit.value);

    await checkUnsavedChanges(fullDataUnit, 0, couriersOrder);
  });

  ratingEl.addEventListener('click', async () => {
    ratingEl.classList.add('active');
    programEl.classList.remove('active');
    premiumEl.classList.remove('active');

    changeActiveTab('#bad-trips-tabs-content #rating-tab');

    await renderRating();
  });

  premiumEl.addEventListener('click', async () => {
    premiumEl.classList.add('active');
    programEl.classList.remove('active');
    ratingEl.classList.remove('active');

    changeActiveTab('#bad-trips-tabs-content #premium-tab');

    await renderPremium();
  });

  return navEl;
}

const generateTabs = () => {
  const tabs = components.getTagDiv('tab-content')
  tabs.id = 'bad-trips-tabs-content';

  const programContent = components.getTagDiv(['tab-pane', 'fade', 'show', 'active', 'program-content']);
  programContent.id = "program-tab"
  const ratingContent = components.getTagDiv(['tab-pane', 'fade', 'rating-content']);
  ratingContent.id = "rating-tab"
  const premiumContent = components.getTagDiv(['tab-pane', 'fade', 'premium-content']);
  premiumContent.id = "premium-tab"

  tabs.append(programContent, ratingContent, premiumContent)

  return tabs
}

const generateTitle = () => {
  const title = components.getTagH(3, name);

  title.classList.add('text-center');
  title.classList.add('sticky-top');

  return title;
}

const getListUnits = (couriersOrder) => {
  let unitsSet = new Set();

  couriersOrder.forEach((order) => {
    unitsSet.add(order.unitName);
  });

  const unitsName = Array.from(unitsSet).sort();
  const select = components.getTagSelect();
  select.classList.add('selectUnit');

  for (const unit of unitsName) {
    const option = components.getTagOption(unit, unit);
    select.appendChild(option);
  }

  const unitsEl = document.getElementById('units');
  unitsEl.append(select);
  return unitsName;
}

const startRender = async (couriersOrder, unitsName) => {
  let fullDataUnit = couriersOrder.filter((el) => el.unitName === unitsName[0]);
  await renderProgram(fullDataUnit, 0, couriersOrder);

  document.querySelector('.selectUnit').addEventListener('change', async (e) => {
    fullDataUnit = couriersOrder.filter((el) => el.unitName === e.target.value);

    await checkUnsavedChanges(fullDataUnit, 0, couriersOrder);

    const activeTab = getActiveTab();

    if (activeTab) {
      const tabId = activeTab.id

      switch (tabId) {
        case "program-tab":
          await updateProgram()
          break
        case "rating-tab":
          await renderRating()
          break
        case "premium-tab":
          await updatePremium()
          break
      }
    }
  });
}

export async function render(name, breadcrumbs) {
  generateBreadcrumbs(name, breadcrumbs);

  const { couriersOrder, unitsSettings } = await fetchData()

  content.append(generateTitle(), generateHeader(), await generateNav(couriersOrder), generateTabs());

  const unitsName = getListUnits(couriersOrder);
  await startRender(couriersOrder, unitsName);
}
