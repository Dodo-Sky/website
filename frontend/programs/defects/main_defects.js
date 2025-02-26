import { getServerApi, getDataServer } from "../../apiServer.js";
import * as components from "../../components.js";
import { renderTable } from "./renderTable_defects.js";

const content = document.getElementById("content");

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data) {
  const btns = document.querySelector(".tBody").querySelectorAll(".btn");
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert("Сохраните данные");
  } else {
    renderTable(data);
  }
}

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
  const defects = await getServerApi("defects");
  let staffData = await getDataServer("defecstStaff")
  localStorage.setItem("staffData", JSON.stringify(staffData));

  let spiner = document.querySelector(".spinner-border");
  spiner.style.display = "none";

  let row = components.getTagDiv("row");
  const units = components.getTagDiv("col-auto");
  units.setAttribute("id", "units");
  row.append(units);

  const update = components.getTagDiv("col-auto");
  const btnUpdate = components.getTagButton("Обновить");
  btnUpdate.setAttribute("id", "update");
  update.append(btnUpdate);
  row.append(update);

  const divEl = components.getTagDiv("defects-table");
  const title = components.getTagH(3, name);
  title.classList.add("text-center");

  content.append(title, row, divEl);

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
  console.log(select);
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    select.append(option);
  });

  const unitsEl = document.getElementById("units");
  unitsEl.append(select);
}

function filterData(defects) {
  let defectFilter = defects.filter((el) => el.unitName === "Тюмень-1");
  renderTable(defectFilter);

  document.querySelector(".selectUnit").addEventListener("change", function (e) {
    defectFilter = defects.filter((el) => el.unitName === e.target.value);
    editDataNoChange(defectFilter);
  });

  // обновить 
  let btnUpdate = document.getElementById ('update')
  let selectUnit = document.querySelector('.selectUnit');
  btnUpdate.addEventListener('click', async function (e) {
    const defects = await getServerApi("defects");
    defectFilter = defects.filter((el) => el.unitName === selectUnit.value);
    filterData = defectFilter.filter((el) => {
      let now = new Date();
      return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 1));
    });
    editDataNoChange(filterData);
});

  // сортировка по времени
  const tableContent = document.querySelector(".defects-table");
  let filterData;

  tableContent.addEventListener("click", function (e) {
    // сортировка по дате
    if (e.target.textContent === "За прошедшие сутки") {
      filterData = defectFilter.filter((el) => {
        let now = new Date();
        return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 1));
      });
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "За прошедшие 3 дня") {
      filterData = defectFilter.filter((el) => {
        let now = new Date();
        return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 3));
      });
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "За последнюю неделю") {
      filterData = defectFilter.filter((el) => {
        let now = new Date();
        return new Date(el.soldAtLocal) > new Date(now.setDate(now.getDate() - 7));
      });
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "Показать за все время" || e.target.textContent === "Показать все") {
      renderTable(defectFilter);
    }
    // сортировка по менеджеру и управляющему
    if (e.target.textContent === "Только просроченные менеджером") {
      filterData = defectFilter.filter((el) => el.decisionManager === "Просрочка");
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "В работе менеджера (пустые)") {
      filterData = defectFilter.filter((el) => !el.decisionManager);
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "Только просроченные управляющим") {
      filterData = defectFilter.filter((el) => el.control === "Просрочка");
      editDataNoChange(filterData);
    }
    if (e.target.textContent === "В работе управляющего (пустые)") {
      filterData = defectFilter.filter((el) => !el.control);
      editDataNoChange(filterData);
    }
  });
}
