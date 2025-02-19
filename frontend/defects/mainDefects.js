import { getServerApi } from "../apiServer.js";
import * as components from "../components.js";
import { renderTable } from "./renderTable.js";

const content = document.getElementById("content");

export async function render(name) {
  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const defects = await getServerApi("defects");

  let spiner = document.querySelector(".spinner-border");
  spiner.style.display = "none";

  const row = components.getTagDiv("row");
  const units = components.getTagDiv("col-auto");
  units.setAttribute("id", "units");
  row.append(units);

  const divEl = components.getTagDiv_table();

  content.append(name, row, divEl);

  getListUnits(defects);
  filterData(defects);
}

function getListUnits(defects) {
  let unitsName = [];
  defects.forEach((defect) => {
    if (!unitsName.includes(defect.unitName)) {
      unitsName.push(defect.unitName);
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

function filterData(defects) {
  let defectFilter = defects.filter((el) => el.unitName === "Тюмень-1");
  renderTable (defectFilter);

  document.querySelector(".selectUnit").addEventListener("change", function (e) {
    defectFilter = defects.filter((el) => el.unitName === e.target.value);
    renderTable (defectFilter);
  });

  // сортировка по времени
  const tableContent = document.querySelector(".table-responsive");
  let filterData;
  
  tableContent.addEventListener("click", function (e) {
    // сортировка по дате
    if (e.target.textContent === "За прошедшие сутки") {
      filterData = defectFilter.filter((el) => {
        let now = new Date();
        return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 1));
      });
      renderTable(filterData);
    }
    if (e.target.textContent === "За прошедшие 3 дня") {
      filterData = defectFilter.filter((el) => {
        let now = new Date();
        return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 3));
      });
      renderTable(filterData);
    }
    if (e.target.textContent === "За последнюю неделю") {
      filterData = defectFilter.filter((el) => {
        let now = new Date();
        return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 7));
      });
      renderTable(filterData);
    }
    if (e.target.textContent === "Показать за все время" || e.target.textContent === "Показать все") {
      renderTable(defectFilter);
    }
    // сортировка по менеджеру и управляющему
    if (e.target.textContent === "Только просроченные менеджером") {
      filterData = defectFilter.filter((el) => el.decisionManager === "Просрочка");
      renderTable(filterData);
    }
    if (e.target.textContent === "В работе менеджера (пустые)") {
      filterData = defectFilter.filter((el) => !el.decisionManager);
      renderTable(filterData);
    }
    if (e.target.textContent === "Только просроченные управляющим") {
      filterData = defectFilter.filter((el) => el.control === "Просрочка");
      renderTable(filterData);
    }
    if (e.target.textContent === "В работе управляющего (пустые)") {
      filterData = defectFilter.filter((el) => !el.control);
      renderTable(filterData);
    }
  });
}
