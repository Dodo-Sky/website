import { getServerApi, postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';

export async function main_planing(name, breadcrumbs) {
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
  let planning = await postDataServer('planning', { payload: departmentName });
  console.log(planning);
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const ulEl = components.getTagUL_nav();
  ulEl.classList.add('nav-tabs');
  const dicscipline = components.getTagLI_nav('Соблюдение дисциплины');
  dicscipline.classList.add('planning-nav');
  dicscipline.classList.add('dicscipline');
  dicscipline.classList.add('active');
  const idTelegrammKitchen = components.getTagLI_nav('Проблемные поездки');
  idTelegrammKitchen.classList.add('planning-nav');

  ulEl.append(dicscipline, idTelegrammKitchen);

  const divEl = components.getTagDiv('table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');
  content.append(title, ulEl, divEl);

  const tableEl = buildTable(planning);
  divEl.append(tableEl);
}

const buildTable = (arrayData) => {
  const table = components.getTagTable();
  table.classList.add('table-sm');

  const caption = components.getTagCaption(
    'Эффективность работы с графиками за последние 7 дней',
  );
  const thead = buildHeader();
  const tbody = buildBody(arrayData);

  table.append(caption, thead, tbody);
  return table;
};

const buildHeader = () => {
  const thead = components.getTagTHead();
  thead.classList.add('sticky-top');
  const tr = components.getTagTR();

  tr.append(
    components.getTagTH('Пиццерия'),
    components.getTagTH('Продление смен (час)'),
    components.getTagTH('Вне графика (час)'),
    components.getTagTH('Опоздания (час)'),
    components.getTagTH('Всего (отрицательные)'),
    components.getTagTH('Всего (положительные)'),
    components.getTagTH('Сумма часов'),
  );

  thead.append(tr);
  return thead;
};

const buildBody = (arrayData) => {
  const tbody = components.getTagTBody();
  tbody.classList.add('tBody');

  arrayData.forEach((order) => {
    const tr = components.getTagTR();
    const extension = components.getTagTD(order['Продление смен (час)']);
    if (order['Ранг продления'] === '1') {
      extension.classList.add('bg-danger-subtle');
    }
    if (order['Ранг продления'] === '2') {
      extension.classList.add('bg-warning-subtle');
    }
    if (order['Ранг продления'] === '8') {
      extension.classList.add('bg-success-subtle');
    }
    if (order['Ранг продления'] === '9') {
      extension.classList.add('bg-success-subtle');
    }

    const delays = components.getTagTD(order['Опоздания (час)']);
    if (order['Ранг по опозданиям'] === '1') {
      delays.classList.add('bg-danger-subtle');
    }
    if (order['Ранг по опозданиям'] === '2') {
      delays.classList.add('bg-warning-subtle');
    }
    if (order['Ранг по опозданиям'] === '8') {
      delays.classList.add('bg-success-subtle');
    }
    if (order['Ранг по опозданиям'] === '9') {
      delays.classList.add('bg-success-subtle');
    }

    tr.append(
      components.getTagTD(order.name),
      extension,
      components.getTagTD(order['Вне графика (час)']),
      delays,
      components.getTagTD(order['Всего (отрицательные)']),
      components.getTagTD(order['Всего (положительные)']),
      components.getTagTD(order['Сумма часов']),
    );

    tbody.append(tr);
  });

  return tbody;
};
