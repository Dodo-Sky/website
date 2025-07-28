import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderDiscipline } from "./renderDiscipline.js";
import { renderDisciplineHistory } from "./renderDisciplineHistory.js";
import { renderOrdersHistory } from "./renderOrdersHistory.js";
import { renderProblemOrders } from "./renderProblemOrders.js";
import { getTagSpan } from "../../components.js";
import { parseIsoDate } from "../../utils";

const tabs = {
  discipline: {
    label: 'Соблюдение дисциплины',
    tableId: 'planning_discipline_table',
    minMaxDateEndpoint: 'planning_discipline_min_max_date',
    render: async (spinnerWrap, container, request) => {
      spinnerWrap.style.display = 'flex';
      container.style.display = 'none';

      const table = await renderDiscipline(request.departmentName, request.from, request.to);
      const chart = components.getTagDiv("planning_discipline_history");
      chart.id = 'planning_discipline_history';
      container.append(table, chart);

      await renderDisciplineHistory(chart, request.departmentName)

      spinnerWrap.style.display = 'none';
      container.style.display = 'flex';
    },
  },
  problemOrders: {
    label: 'Проблемные поездки',
    tableId: 'planning_orders_table',
    minMaxDateEndpoint: 'planning_orders_min_max_date',
    render: async (spinnerWrap, container, request) => {
      spinnerWrap.style.display = 'flex';
      container.style.display = 'none';

      const table = await renderProblemOrders(request.departmentName, request.from, request.to);
      const chart = components.getTagDiv("planning_orders_history");
      chart.id = 'planning_orders_history';
      container.append(table, chart);

      await renderOrdersHistory(chart, request.departmentName)

      spinnerWrap.style.display = 'none';
      container.style.display = 'flex';
    },
  },
};

const fetchAllMinMaxDates = async (departmentName) => {
  const entries = await Promise.all(
      Object.entries(tabs).map(async ([key, tab]) => {
        const res = await postDataServer(tab.minMaxDateEndpoint, { departmentName });

        return [key, res[0]];
      })
  );

  return Object.fromEntries(entries);
}

const renderTabContent = async ({ container, spinnerWrap, departmentName, tab, minMax }) => {
  container.innerHTML = '';

  const { periodRow, inputTo, inputFrom, btnApply } = components.getPeriodSelector(container);

  const { minDate, maxDate } = minMax;
  const span = getTagSpan();
  span.classList.add('col-auto');
  span.textContent = `Внимание. Не ранее ${parseIsoDate(minDate)}. Не позднее ${parseIsoDate(maxDate)}`;
  periodRow.append(span);

  btnApply.addEventListener('click', async () => {
    const oldTable = document.querySelector(`#${tab.tableId}`);
    if (oldTable) oldTable.remove();

    await tab.render(spinnerWrap, container, {
      departmentName,
      from: inputFrom.value,
      to: inputTo.value,
    });
  });

  await tab.render(spinnerWrap, container, {
    departmentName,
    from: inputFrom.value,
    to: inputTo.value,
  });
}

export async function main_reports(name, breadcrumbs) {
  const breadcrumb = document.querySelector('.breadcrumb');
  breadcrumb.innerHTML = '';
  breadcrumb.append(
      components.getTagLI_breadcrumb('Главная'),
      components.getTagLI_breadcrumb(breadcrumbs),
      components.getTagLI_breadcrumbActive(name)
  );

  const departmentName = localStorage.getItem('departmentName');
  content.innerHTML = ``;

  const spinnerWrap = components.getTagDiv('spinnerWrap');
  spinnerWrap.style.display = 'flex';
  spinnerWrap.style.margin = '50px';
  const spinner = components.getTagDiv('spinner-border');
  spinner.dataset.role = "status"
  spinner.style.margin = "auto"
  const round = components.getTagSpan("visually-hidden")
  spinner.append(round)
  spinnerWrap.append(spinner);

  const navbar = components.getTagUL_nav();
  navbar.classList.add('nav-tabs');

  const container = components.getTagDiv('row');
  const title = components.getTagH(3, name);
  title.classList.add('text-center', 'sticky-top');

  content.append(title, navbar, spinnerWrap, container);

  Object.entries(tabs).forEach(([key, tab]) => {
    const navItem = components.getTagLI_nav(tab.label);
    navItem.classList.add('planning-nav');
    if (key === 'discipline') navItem.classList.add('active');
    navItem.dataset.tabKey = key;
    navbar.append(navItem);
  });

  const minMaxByTab = await fetchAllMinMaxDates(departmentName);

  navbar.addEventListener('click', async (e) => {
    const tabKey = e.target?.dataset?.tabKey;
    if (!tabKey || !tabs[tabKey]) return;

    navbar.querySelectorAll('li').forEach((li) => li.classList.remove('active'));
    e.target.classList.add('active');

    await renderTabContent({
      container,
      spinnerWrap,
      departmentName,
      tab: tabs[tabKey],
      minMax: minMaxByTab[tabKey],
    });
  });

  await renderTabContent({
    container,
    spinnerWrap,
    departmentName,
    tab: tabs.discipline,
    minMax: minMaxByTab.discipline
  });
}
