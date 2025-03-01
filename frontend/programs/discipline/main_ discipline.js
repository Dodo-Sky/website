import { getServerApi } from "../../apiServer.js";
import * as components from "../../components.js";
import { renderTable } from "./renderTable_ discipline.js";

//Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, time) {
  const btns = document.querySelector(".tBody").querySelectorAll(".arrayData-btn-save");
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert("Сохраните данные");
  } else {
    renderTable(data, time);
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
  const discipline = await getServerApi("discipline");
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

  const divEl = components.getTagDiv("discipline-table");
  const title = components.getTagH(3, name);
  title.classList.add("text-center");
  title.classList.add("sticky-top");

  content.append(title, row, divEl);

  getListUnits(discipline);
  filterData(discipline);
}

function getListUnits(discipline) {
  let unitsName = [];
  discipline.forEach((order) => {
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

function filterData(discipline) {
  let dataUnit = discipline.filter((el) => el.unitName === "Тюмень-1");
  renderTable(dataUnit, "все время");

  document.querySelector(".selectUnit").addEventListener("change", function (e) {
    dataUnit = discipline.filter((el) => el.unitName === e.target.value);
    editDataNoChange(dataUnit, "все время");
  });

  // обновить
  let btnUpdate = document.getElementById("update");
  let selectUnit = document.querySelector(".selectUnit");
  btnUpdate.addEventListener("click", async function (e) {
    const discipline = await getServerApi("discipline");
    let data = discipline.filter((el) => el.unitName === selectUnit.value);
    filterData = data.filter((el) => {
      let now = new Date();
      return new Date(el.scheduledShiftStartAtLocal) > new Date(now.setDate(now.getDate() - 1));
    });
    editDataNoChange(filterData, "за сутки");
  });

  // сортировка по времени
  const tableContent = document.querySelector(".discipline-table");
  let filterData;

  tableContent.addEventListener("click", function (e) {
    // сортировка по дате
    if (e.target.textContent === "За прошедшие сутки") {
      filterData = dataUnit.filter((el) => {
        let now = new Date();
        return new Date(el.scheduledShiftStartAtLocal) > new Date(now.setDate(now.getDate() - 1));
      });
      editDataNoChange(filterData, "за сутки");
    }
    if (e.target.textContent === "За прошедшие 3 дня") {
      filterData = dataUnit.filter((el) => {
        let now = new Date();
        return new Date(el.scheduledShiftStartAtLocal) > new Date(now.setDate(now.getDate() - 3));
      });
      editDataNoChange(filterData, "за 3 дня");
    }
    if (e.target.textContent === "За последнюю неделю") {
      filterData = dataUnit.filter((el) => {
        let now = new Date();
        return new Date(el.scheduledShiftStartAtLocal) > new Date(now.setDate(now.getDate() - 7));
      });
      editDataNoChange(filterData, "за неделю");
    }
    if (e.target.textContent === "Показать за все время" || e.target.textContent === "Показать все") {
      renderTable(dataUnit, "все время");
    }
    // сортировка по менеджеру и управляющему
    if (e.target.textContent === "Только просроченные менеджером") {
      filterData = dataUnit.filter((el) => el.managerDecision === "Просрочка");
      editDataNoChange(filterData, "все время");
    }
    if (e.target.textContent === "В работе менеджера (пустые)") {
      filterData = dataUnit.filter((el) => !el.managerDecision);
      editDataNoChange(filterData, "все время");
    }
    if (e.target.textContent === "Только просроченные управляющим") {
      filterData = dataUnit.filter((el) => el.unitDirectorControl === "Просрочка");
      editDataNoChange(filterData, "все время");
    }
    if (e.target.textContent === "В работе управляющего (пустые)") {
      filterData = dataUnit.filter((el) => !el.unitDirectorControl);
      editDataNoChange(filterData, "все время");
    }
  });
}
