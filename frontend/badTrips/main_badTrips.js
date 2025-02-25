import { getServerApi } from "../apiServer.js";
import * as components from "../components.js";
import { renderTable } from "./renderTable_badTrips.js";

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data) {
    const btns = document.querySelector(".tBody").querySelectorAll(".arrayData-btn-save");
    let isCnanges = false;
    btns.forEach((element) => {
      if (!element.disabled) isCnanges = true;
    });
    if (isCnanges) {
      alert("Сохраните данные");
    } else {
      renderTable (data);
    }
  }

const content = document.getElementById("content");

export async function render(name, breadcrumbs) {
  const breadcrumb = document.querySelector(".breadcrumb");
  breadcrumb.innerHTML = "";
  let navMainEl = components.getTagLI_breadcrumb("Главная");
  let navManaergEl = components.getTagLI_breadcrumb(breadcrumbs);
  let navControlEl = components.getTagLI_breadcrumbActive(name);
  breadcrumb.append(navMainEl, navManaergEl, navControlEl);

  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const ordersFilter = await getServerApi("ordersFilter");
  let spiner = document.querySelector(".spinner-border");
  spiner.style.display = "none";

  const row = components.getTagDiv("row");
  const units = components.getTagDiv("col-auto");
  units.setAttribute("id", "units");
  row.append(units);

  const divEl = components.getTagDiv("badTrips-table");
  const title = components.getTagH(3, name);
  title.classList.add("text-center");
  title.classList.add("sticky-top");

  content.append(title, row, divEl);

  getListUnits(ordersFilter);
  filterData(ordersFilter);
}

function getListUnits(ordersFilter) {
  let unitsName = [];
  ordersFilter.forEach((order) => {
    if (!unitsName.includes(order.unitName)) {
      unitsName.push(order.unitName);
    }
  });
  unitsName = unitsName.sort();
  const select = components.getTagSelect();
  select.classList.add("selectUnit");
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    select.append(option);
  });

  const unitsEl = document.getElementById("units");
  unitsEl.append(select);
}

function filterData(ordersFilter) {
  let ordersFilterPizzeria = ordersFilter.filter((el) => el.unitName === "Тюмень-1");
  renderTable(ordersFilterPizzeria);

  document.querySelector(".selectUnit").addEventListener("change", function (e) {
    ordersFilterPizzeria = ordersFilter.filter((el) => el.unitName === e.target.value);
    editDataNoChange(ordersFilterPizzeria);
  });

  // сортировка по времени
  const tableContent = document.querySelector(".badTrips-table");
  let filterData;

  tableContent.addEventListener("click", function (e) {
    // сортировка по дате
    if (e.target.textContent === "За прошедшие сутки") {
      filterData = ordersFilterPizzeria.filter((el) => {
        let now = new Date();
        return new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 1));
      });
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "За прошедшие 3 дня") {
      filterData = ordersFilterPizzeria.filter((el) => {
        let now = new Date();
        return new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 3));
      });
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "За последнюю неделю") {
      filterData = ordersFilterPizzeria.filter((el) => {
        let now = new Date();
        return new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 7));
      });
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "Показать за все время" || e.target.textContent === "Показать все") {
      renderTable(ordersFilterPizzeria);
    }
    // сортировка по менеджеру и управляющему
    if (e.target.textContent === "Только просроченные менеджером") {
      filterData = ordersFilterPizzeria.filter((el) => el.graphistComment === "Просрочка");
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "В работе менеджера (пустые)") {
      filterData = ordersFilterPizzeria.filter((el) => !el.graphistComment);
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "Только просроченные управляющим") {
      filterData = ordersFilterPizzeria.filter((el) => el.directorComment === "Просрочка");
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "В работе управляющего (пустые)") {
      filterData = ordersFilterPizzeria.filter((el) => !el.directorComment);
      editDataNoChange(filterData);
    }
  });
}
