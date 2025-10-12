import { addDays, endOfWeek, format, startOfWeek } from "date-fns";

import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { getTagSpan } from "../../components.js";
import { parseIsoDate } from "../../utils";
import { getCourierStaffingYears } from "./api.js";
import { renderCourierStaffing } from "./renderCourierStaffing.js";
import { renderCourierStaffingChart } from "./renderCourierStaffingChart.js";
import { renderDiscipline } from "./renderDiscipline.js";
import { renderDisciplineHistory } from "./renderDisciplineHistory.js";
import { renderOrdersHistory } from "./renderOrdersHistory.js";
import { renderProblemOrders } from "./renderProblemOrders.js";

const departmentName = localStorage.getItem('departmentName');

const tabs = {
  discipline: {
    label: 'Соблюдение дисциплины',
    tableId: 'planning_discipline_table',
    renderData: async (container,from, to) => {
      const table = await renderDiscipline(departmentName, from, to);
      const chart = components.getTagDiv("planning_discipline_history");
      chart.id = 'planning_discipline_history';
      container.append(table, chart);

      await renderDisciplineHistory(chart, departmentName)
    },
    render: async (spinnerWrap, container, request) => {
      spinnerWrap.style.display = 'flex';
      container.style.display = 'none';

      const [minMaxDate] = await postDataServer('planning_discipline_min_max_date', { departmentName });
      const { periodRow, inputTo, inputFrom, btnApply } = components.getPeriodSelector(container);
      const span = getTagSpan();
      span.classList.add('col-auto');
      span.textContent = `Внимание. Не ранее ${parseIsoDate(minMaxDate.minDate)}. Не позднее ${parseIsoDate(minMaxDate.maxDate)}`;
      periodRow.append(span);

      btnApply.addEventListener('click', async () => {
        spinnerWrap.style.display = 'flex';
        container.style.display = 'none';

        const oldTable = document.querySelector(`#${tabs.discipline.tableId}`);
        if (oldTable) oldTable.remove();
        
        const oldChart = document.querySelector("#planning_discipline_history");
        if (oldChart) oldChart.remove()

        await tabs.discipline.renderData(container, inputFrom.value, inputTo.value);

        spinnerWrap.style.display = 'none';
        container.style.display = 'flex';
      });

      await tabs.discipline.renderData(container, request.from, request.to);

      spinnerWrap.style.display = 'none';
      container.style.display = 'flex';
    },
  },
  problemOrders: {
    label: 'Проблемные поездки',
    tableId: 'planning_orders_table',
    renderData: async (container, from, to) => {
      const table = await renderProblemOrders(departmentName, from, to);
      const chart = components.getTagDiv("planning_orders_history");
      chart.id = 'planning_orders_history';
      container.append(table, chart);

      await renderOrdersHistory(chart, departmentName)
    },
    render: async (spinnerWrap, container, request) => {
      spinnerWrap.style.display = 'flex';
      container.style.display = 'none';

      const [minMaxDate] = await postDataServer('planning_orders_min_max_date', { departmentName });
      const { periodRow, inputTo, inputFrom, btnApply } = components.getPeriodSelector(container);
      const span = getTagSpan();
      span.classList.add('col-auto');
      span.textContent = `Внимание. Не ранее ${parseIsoDate(minMaxDate.minDate)}. Не позднее ${parseIsoDate(minMaxDate.maxDate)}`;
      periodRow.append(span);

      btnApply.addEventListener('click', async () => {
        spinnerWrap.style.display = 'flex';
        container.style.display = 'none';

        const oldTable = document.querySelector(`#${tabs.problemOrders.tableId}`);
        if (oldTable) oldTable.remove();
    
        const oldChart = document.querySelector("#planning_orders_history");
        if (oldChart) oldChart.remove()

        await tabs.problemOrders.renderData(container, inputFrom.value, inputTo.value);

        spinnerWrap.style.display = 'none';
        container.style.display = 'flex';
      });

      await tabs.problemOrders.renderData(container, request.from, request.to);

      spinnerWrap.style.display = 'none';
      container.style.display = 'flex';
    },
  },
  courierStaffing: {
    label: 'Укомплектованность курьеров',
    tableId: 'courier_staffing_table',
    searchParams: {
      year: '',
      unitId: '',
    },
    renderData: async (container) => {
      const table = await renderCourierStaffing(tabs.courierStaffing.searchParams.year);
      const chart = components.getTagDiv("courier_staffing_history");
      chart.id = 'courier_staffing_history';
      container.append(table, chart);

      await renderCourierStaffingChart(chart, tabs.courierStaffing.searchParams.year);
    },
    render: async (spinnerWrap, container) => {
      spinnerWrap.style.display = 'flex';
      container.style.display = 'none';

      const years = await getCourierStaffingYears();

      if (years.length > 1) {
        const yearsSelect = components.getTagSelect("courier-staffing-year-select");
        yearsSelect.classList.add('mt-2');
        yearsSelect.classList.add('mb-2');
        yearsSelect.style.width = "max-content";
        yearsSelect.value = years[0].year;
        years.forEach((el) => {
          const option = components.getTagOption(el.year, el.year);
          if (el.year === years[0].year) option.selected = true;
          yearsSelect.append(option);
        });

        yearsSelect.addEventListener('change', async (e) => {
          spinnerWrap.style.display = 'flex';
          container.style.display = 'none';

          const oldTable = document.querySelector(`#${tabs.courierStaffing.tableId}`);
          if (oldTable) oldTable.remove();
          
          const oldChart = document.querySelector("#courier_staffing_history");
          if (oldChart) oldChart.remove()

          tabs.courierStaffing.searchParams.year = e.target.value;
          await tabs.courierStaffing.renderData(container);

          spinnerWrap.style.display = 'none';
          container.style.display = 'flex';
        });
        
        container.append(yearsSelect);

        tabs.courierStaffing.searchParams.year = years[0].year;
        await tabs.courierStaffing.renderData(container);
      } else {
        tabs.courierStaffing.searchParams.year = years[0].year;
        await tabs.courierStaffing.renderData(container);
      }

      spinnerWrap.style.display = 'none';
      container.style.display = 'flex';
    }
  }
};

const renderTabContent = async ({ container, spinnerWrap, tab }) => {
  container.innerHTML = '';

  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = addDays(thisWeekStart, -7)
  const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 })

  await tab.render(spinnerWrap, container, {
    from: format(lastWeekStart, "yyyy-MM-dd"),
    to: format(lastWeekEnd, "yyyy-MM-dd"),
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

  navbar.addEventListener('click', async (e) => {
    const tabKey = e.target?.dataset?.tabKey;
    if (!tabKey || !tabs[tabKey]) return;

    navbar.querySelectorAll('li').forEach((li) => li.classList.remove('active'));
    e.target.classList.add('active');

    await renderTabContent({
      container,
      spinnerWrap,
      tab: tabs[tabKey],
    });
  });

  await renderTabContent({
    container,
    spinnerWrap,
    tab: tabs.discipline,
  });
}
