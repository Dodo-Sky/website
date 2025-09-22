import * as components from '../../components.js';
import { renderProgram } from './program/index.js';
import { renderRating } from './rating/index.js';
import { renderPremium } from './premium/index.js';
import { renderUnitSelector } from "../../common/updateUnitSelector";
import { postDataServer } from "../../apiServer";

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

const changeUnitSelector = async (e, searchParams) => {
  searchParams.unitId = e.target.value;
  searchParams.period = "all";
  searchParams.graphistComment = "all"
  searchParams.directorComment = "all"
  searchParams.page = 1;

  const activeTab = getActiveTab();

  if (activeTab) {
    const tabId = activeTab.id

    switch (tabId) {
      case "program-tab":
        const programSpinner = document.querySelector('#bad-trips-tabs-content #program-tab #bad-trips-program-spinner');
        programSpinner.style.display = 'flex';
        await renderProgram(searchParams)
        break
      case "premium-tab":
        const premiumSpinner = document.querySelector('#bad-trips-tabs-content #premium-tab #bad-trips-premium-spinner');
        premiumSpinner.style.display = 'flex';
        await renderPremium(searchParams)
        break
      case "rating-tab":
        const ratingSpinner = document.querySelector('#bad-trips-tabs-content #rating-tab #bad-trips-rating-spinner');
        ratingSpinner.style.display = 'flex';
        await renderRating(searchParams)
    }
  }
}

const btnUpdateListener = async (searchParams) => {
  const activeTab = getActiveTab();

  if (activeTab) {
    const tabId = activeTab.id

    switch (tabId) {
      case "program-tab":
        const programSpinner = document.querySelector('#bad-trips-tabs-content #program-tab #bad-trips-program-spinner');
        programSpinner.style.display = 'flex';
        await renderProgram(searchParams)
        break
      case "premium-tab":
        const premiumSpinner = document.querySelector('#bad-trips-tabs-content #premium-tab #bad-trips-premium-spinner');
        premiumSpinner.style.display = 'flex';
        await renderPremium(searchParams)
        break
      case "rating-tab":
        const ratingSpinner = document.querySelector('#bad-trips-tabs-content #rating-tab #bad-trips-rating-spinner');
        ratingSpinner.style.display = 'flex';
        await renderRating(searchParams)
    }
  }
}

const generateDocs = (containerId) => {
  const container = document.getElementById(containerId);
  const docsCol = components.getTagDiv('col-auto');
  const docsBtn = components.getTagButton('Справка по программе Проблемные поездки');
  docsBtn.classList = 'btn btn-outline-secondary reference';
  docsCol.append(docsBtn);

  docsBtn.addEventListener('click', () => {
    window.open('https://docs.google.com/document/d/1fgS1kdMy6bWIAm0Vr0_WQzOISTmEJRnkcOpGarn0DEE/edit?usp=sharing');
  });

  container.append(docsCol);
}

// навигация по программе и рейтингу
const generateNav = async (searchParams) => {
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
    searchParams.period = "all"
    searchParams.graphistComment = "all"
    searchParams.directorComment = "all"

    programEl.classList.add('active');
    ratingEl.classList.remove('active');
    premiumEl.classList.remove('active');

    const programSpinner = document.querySelector('#bad-trips-tabs-content #program-tab #bad-trips-program-spinner');
    programSpinner.style.display = 'flex';

    changeActiveTab('#bad-trips-tabs-content #program-tab');

    await renderProgram(searchParams);
  });

  ratingEl.addEventListener('click', async () => {
    searchParams.period = "all"
    searchParams.graphistComment = "all"
    searchParams.directorComment = "all"

    ratingEl.classList.add('active');
    programEl.classList.remove('active');
    premiumEl.classList.remove('active');

    const ratingSpinner = document.querySelector('#bad-trips-tabs-content #rating-tab #bad-trips-rating-spinner');
    ratingSpinner.style.display = 'flex';

    changeActiveTab('#bad-trips-tabs-content #rating-tab');

    await renderRating(searchParams);
  });

  premiumEl.addEventListener('click', async () => {
    searchParams.period = "all"
    searchParams.graphistComment = "all"
    searchParams.directorComment = "all"

    premiumEl.classList.add('active');
    programEl.classList.remove('active');
    ratingEl.classList.remove('active');

    const premiumSpinner = document.querySelector('#bad-trips-tabs-content #premium-tab #bad-trips-premium-spinner');
    premiumSpinner.style.display = 'flex';

    changeActiveTab('#bad-trips-tabs-content #premium-tab');

    await renderPremium(searchParams);
  });

  return navEl;
}

const generateTabs = () => {
  const tabs = components.getTagDiv('tab-content')
  tabs.id = 'bad-trips-tabs-content';

  const programTabContent = components.getTagDiv(['tab-pane', 'fade', 'show', 'active'], "program-tab");
  const programContent = components.getTagDiv("program-content", "program-content");
  const programSpinner = components.getSpinner("bad-trips-program-spinner");
  programTabContent.append(programSpinner, programContent);

  const ratingTabContent = components.getTagDiv(['tab-pane', 'fade'], "rating-tab");
  const ratingContent = components.getTagDiv("rating-content", "rating-content");
  const ratingSpinner = components.getSpinner("bad-trips-rating-spinner");
  ratingTabContent.append(ratingSpinner, ratingContent);

  const premiumTabContent = components.getTagDiv(['tab-pane', 'fade'], "premium-tab");
  const premiumContent = components.getTagDiv("premium-content", "premium-content");
  const premiumSpinner = components.getSpinner("bad-trips-premium-spinner");
  premiumTabContent.append(premiumSpinner, premiumContent);

  tabs.append(programTabContent, ratingTabContent, premiumTabContent)

  return tabs
}

export async function render() {
  const searchParams = {
    unitId: '',
    period: "all", // all | week | 3days | day
    graphistComment: "all", // all | inwork | delay
    directorComment: "all", // all | inwork | delay
    page: 1,
    size: 30,
  }
  const departmentName = localStorage.getItem('departmentName');

  content.innerHTML = ""

  const title = components.getTagH(3, "Проблемные поездки", ["text-center", "sticky-top"]);

  content.append(
      title,
      components.getTagDiv(['row', 'mb-2'], "bad-trips-unit-selector"),
      await generateNav(searchParams),
      generateTabs()
  );

  const units = await postDataServer('get_units', { payload: departmentName });
  const filteredUnits = units.filter(unit => unit.type === "Пиццерия" || unit.type === "ПРЦ");
  searchParams.unitId = filteredUnits[0].id;

  renderUnitSelector({
    units: filteredUnits,
    programName: "bad-trips",
    selectListener: async (e) => await changeUnitSelector(e, searchParams),
    btnListener: async () => await btnUpdateListener(searchParams)
  });

  generateDocs("bad-trips-unit-selector")

  await renderProgram(searchParams);
}
