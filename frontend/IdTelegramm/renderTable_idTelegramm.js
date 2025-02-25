import * as components from "../components.js";
import { editData } from "./edtt_idTelegramm.js";

export async function renderTable(arrayData) {
  arrayData.sort((a, b) => a.fio.localeCompare(b.fio));

  const tableContent = document.querySelector(".table");
  tableContent.innerHTML = "";

  const tableEl = components.getTagTable();
  tableEl.classList.add("table-sm");
  tableContent.append(tableEl);

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add("sticky-top");
  let trEl = components.getTagTR();

  let thEl = components.getTagTH("ФИО сотрудника");
  trEl.append(thEl);
  thEl = components.getTagTH("Телефон");
  trEl.append(thEl);
  thEl = components.getTagTH("Статус");
  trEl.append(thEl);

  thEl = components.getTagTH();
  let btnDropdown = components.getTagButton("ID телеграмм");
  btnDropdown.classList.add("position-relative");
  btnDropdown.classList.add("btn-secondary");
  let countDelays = arrayData.filter((el) => !el.idTelegramm).length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  thEl.append(btnDropdown);
  trEl.append(thEl);

  thEl = components.getTagTH("Управление");
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add("tBody");
  arrayData.forEach((staff) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let fio = components.getTagTD(staff.fio);
    trEl.append(fio);
    let phoneNumber = components.getTagTD(staff.phoneNumber);
    trEl.append(phoneNumber);
    let status = components.getTagTD(staff.status);
    trEl.append(status);

    let idTelegramm = components.getTagTD();
    let inputTelegramm = components.getTagInput("number", staff.idTelegramm);
    inputTelegramm.classList.add ('idTelegramm-idTelegramm')
    idTelegramm.append(inputTelegramm);
    trEl.append(idTelegramm);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton("Сохранить");
    btnEl.classList.add("arrayData-btn-save");
    btnEl.setAttribute("data-id", staff.id);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(theadEl, tBody);
  editData();
}
