import * as components from "../../components.js";
import { editData } from "./edtt_idTelegramm.js";

export async function renderTable(arrayData, staffData) {
  console.log(arrayData);
  await arrayData.sort((a, b) => a.lastName.localeCompare(b.lastName));

  const tableContent = document.querySelector(".table");
  tableContent.innerHTML = "";

  const tableEl = components.getTagTable();
  tableEl.classList.add("table-sm");
  tableContent.append(tableEl);

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add("sticky-top");
  let trEl = components.getTagTR();

  // ФИО
  let thEl = components.getTagTH();
  thEl.classList.add("dropend");
  let btnDropdown = components.getTagButton_dropdown("ФИО сотрудника");
  btnDropdown.classList.add("btn-time");
  // количество задач в период
  let count = arrayData.length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  thEl.append(btnDropdown);
  trEl.append(thEl);

  thEl = components.getTagTH("Телефон");
  trEl.append(thEl);
  thEl = components.getTagTH("Статус");
  trEl.append(thEl);


  // ID телеграмм
   thEl = components.getTagTH();
  thEl.classList.add("dropend");
   btnDropdown = components.getTagButton_dropdown("ID телеграмм");

    btnDropdown.classList.add("position-relative");
  btnDropdown.classList.add("btn-secondary");
  let countDelays = arrayData.filter((el) => !el.idTelegramm).length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }

  let countId = arrayData.length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = countId;
    btnDropdown.append(spanWork);
  }
  let ulDrop = components.getTagUL_dropdownMenu();
  let liDrpop = components.getTagLI_dropdownItem("Все сотрудники");
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem("Без id");
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
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
    let fio = components.getTagTD(`${staff.lastName} ${staff.firstName} ${staff.patronymicName}`);
    trEl.append(fio);
    let phoneNumber = components.getTagTD(staff.phoneNumber);
    trEl.append(phoneNumber);
    let status = components.getTagTD(staff.status);
    trEl.append(status);

    let idTelegramm = components.getTagTD();
    let inputTelegramm = components.getTagInput("number", staff.idTelegramm);
    inputTelegramm.classList.add("idTelegramm-idTelegramm");
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
  editData(staffData);
}
