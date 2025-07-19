import { getServerApi, postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import {renderDiscipline} from "./renderDiscipline.js";
import {renderProblemOrders} from "./renderProblemOrders.js";

export async function main_planing(name, breadcrumbs) {
  const breadcrumb = document.querySelector('.breadcrumb');
  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumb(breadcrumbs);
  let navControlEl = components.getTagLI_breadcrumbActive(name);
  breadcrumb.append(navMainEl, navManaergEl, navControlEl);

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

  const departmentName = localStorage.getItem('departmentName');

  const navbar = components.getTagUL_nav();
  navbar.classList.add('nav-tabs');
  const dicscipline = components.getTagLI_nav('Соблюдение дисциплины');
  dicscipline.classList.add('planning-nav');
  dicscipline.classList.add('dicscipline');
  dicscipline.classList.add('active');
  const problemOrders = components.getTagLI_nav('Проблемные поездки');
  problemOrders.classList.add('planning-nav');

  navbar.append(dicscipline, problemOrders);

  const table = components.getTagDiv('table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');
  content.append(title, navbar, spinnerWrap, table);

  navbar.addEventListener('click', async (e) => {
    if (e.target.textContent === 'Соблюдение дисциплины') {
      dicscipline.classList.add('active');
      problemOrders.classList.remove('active');
      spinnerWrap.style.display = 'flex';
      table.innerHTML = ""
      table.append(await renderDiscipline(departmentName));
      spinnerWrap.style.display = 'none';
    }
    if (e.target.textContent === 'Проблемные поездки') {
      problemOrders.classList.add('active');
      dicscipline.classList.remove('active');
      spinnerWrap.style.display = 'flex';
      table.innerHTML = ""
      table.append(await renderProblemOrders(departmentName));
      spinnerWrap.style.display = 'none';
    }
  });

  table.append(await renderDiscipline(departmentName));
  spinnerWrap.style.display = 'none';
}
