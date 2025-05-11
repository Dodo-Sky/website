
import * as components from '../../components.js';
import { renderСity } from './renderSity_shiefAdmin.js';
import { renderUnits } from "./renderUnits_shiefAdmin.js";

const content = document.querySelector('#content');

export async function render() {
  const navbar = components.getTagDiv('navbar');
  const tableContent = components.getTagDiv('table-admin');

  const title = components.getTagH(3, name);
  title.classList.add('text-center');

  content.append(title, navbar, tableContent);

  navbar.addEventListener('click', (e) => {
    if (e.target.textContent === 'Список городов') {
      renderСity();
    }
    if (e.target.textContent === 'Подразделения') {
      renderUnits();
    }
  });

  getNavbar(navbar);
}

function getNavbar(navbar) {
  const navEl = components.getTagNav();
  const ulEL_nav = components.getTagUL_nav();
  ulEL_nav.classList.add('nav-tabs');
  const navItem = components.getTagLI_navItem();
  ulEL_nav.append(navItem);

  const liEl_city = components.getTagLI_nav('Список городов');
  liEl_city.classList.add('nav-Navbar');
  liEl_city.classList.add('active');
  const liEl_units = components.getTagLI_nav('Подразделения');
  liEl_units.classList.add('nav-Navbar');
  ulEL_nav.append(navItem, liEl_city, liEl_units);
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
  renderСity();
}
