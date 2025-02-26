import * as components from "../../components.js";
import { editData } from "./edit_defects.js";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

export async function renderTable(defects) {
  defects.sort((a, b) => new Date(a.soldAtLocal) - new Date(b.soldAtLocal));

  const tableContent = document.querySelector(".defects-table");
  tableContent.innerHTML = "";
  const staffData = JSON.parse(localStorage.getItem("staffData"));

  const tableEl = components.getTagTable();
  tableEl.classList.add("table-sm");
  tableContent.append(tableEl);

  const captionEl = components.getTagCaption("Программа контроля списания забракованных продуктов");

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add("sticky-top");

  let trEl = components.getTagTR();

  // Время
  let thEl = components.getTagTH();
  //thEl.classList.add ('class="w-25 p-3"')
  thEl.classList.add("dropend");
  let btnDropdown = components.getTagButton_dropdown("Время");
  let ulDrop = components.getTagUL_dropdownMenu();
  let liDrpop = components.getTagLI_dropdownItem("За прошедшие сутки");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("За прошедшие 3 дня");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("За последнюю неделю");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("Показать за все время");
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH("Продукт");
  trEl.append(thEl);
  thEl = components.getTagTH("В мусорке?");
  trEl.append(thEl);
  thEl = components.getTagTH("Причина брака");
  trEl.append(thEl);
  thEl = components.getTagTH("Лицо допустившее брак");
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.setAttribute("data-bs-toggle", "tooltip");
  thEl.setAttribute("data-bs-placement", "top");
  thEl.setAttribute("data-bs-custom-class", "tooltip");
  thEl.setAttribute("data-bs-title", "This top tooltip is themed via CSS variables.");

  thEl.classList.add("dropend");
  btnDropdown = components.getTagButton_dropdown("Решение менеджера");
  // количество задач в работе
  let count = defects.filter((el) => !el.decisionManager).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  //  Количество просроченных менеджером задач
  let countDelays = defects.filter((el) => el.decisionManager === "Просрочка").length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem("Показать все");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("Только просроченные менеджером");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("В работе менеджера (пустые)");
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  // решение управляющего
  thEl = components.getTagTH();
  thEl.classList.add("dropend");
  btnDropdown = components.getTagButton_dropdown("Решение управляющего");
  // количество задач в работе
  count = defects.filter((el) => !el.control).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  countDelays = defects.filter((el) => el.control === "Просрочка").length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem("Показать все");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("Только просроченные управляющим");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("В работе управляющего (пустые)");
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH("Управление");
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add("tBody");

  defects.forEach((defect) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let soldAtLocal = components.getTagTD(defect.soldAtLocal);
    trEl.append(soldAtLocal);
    let productName = components.getTagTD(defect.productName);
    trEl.append(productName);

    let disposalTD = components.getTagTD();
    let disposalInput = components.getTagInput("text", defect.disposal);
    disposalInput.setAttribute("size", "20");
    disposalInput.classList.add("defects-disposal");
    disposalTD.append(disposalInput);
    trEl.append(disposalTD);
    defect.disposal;

    let reasonDefectTD = components.getTagTD();
    let reasonDefectTextarea = components.getTagTextarea();
    reasonDefectTextarea.textContent = defect.reasonDefect;
    reasonDefectTextarea.classList.add("defects-reasonDefect");
    reasonDefectTextarea.setAttribute("cols", "75");
    reasonDefectTD.append(reasonDefectTextarea);
    trEl.append(reasonDefectTD);

    let nameViolatorTD = components.getTagTD();
    let nameViolatorTextarea = components.getTagInput();
    nameViolatorTextarea.value = defect.nameViolator;
    nameViolatorTextarea.classList.add("defects-nameViolator");
    nameViolatorTextarea.setAttribute("list", "datalistOptions");
    let datalist = components.getTagDatalist();
    datalist.setAttribute("id", "datalistOptions");
    staffData.forEach((el) => {
      let option = components.getTagOption("", el);
      datalist.append(option);
    });
    nameViolatorTD.append(nameViolatorTextarea, datalist);
    trEl.append(nameViolatorTD);

    let decisionManagerTD = components.getTagTD();
    let decisionManagerTextarea = components.getTagTextarea();
    decisionManagerTextarea.textContent = defect.decisionManager;
    decisionManagerTextarea.classList.add("defects-decisionManager");
    decisionManagerTextarea.setAttribute("cols", "45");
    decisionManagerTD.append(decisionManagerTextarea);

    if (defect.decisionManager === "Просрочка") {
      decisionManagerTextarea.classList.add("text-danger");
    }
    trEl.append(decisionManagerTD);

    let controlTD = components.getTagTD();
    let controlTextarea = components.getTagTextarea();
    controlTextarea.textContent = defect.control;
    controlTextarea.classList.add("defects-control");
    controlTextarea.setAttribute("cols", "45");
    controlTD.append(controlTextarea);

    if (defect.control === "Просрочка") {
      controlTextarea.classList.add("text-danger");
    }
    trEl.append(controlTD);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton("Сохранить");
    btnEl.classList.add("defects-btn-save");
    btnEl.setAttribute("data-id", `${defect.soldAtLocal}+${defect.productId}`);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  editData();
}
