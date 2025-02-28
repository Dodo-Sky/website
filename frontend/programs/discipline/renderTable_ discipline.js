import * as components from "../../components.js";
//import { editData } from "./edit_badTrips.js";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

export async function renderTable(arrayData, time) {
  console.log(time);
  console.log(arrayData);
  arrayData.sort((a, b) => new Date(a.scheduledShiftStartAtLocal) - new Date(b.scheduledShiftStartAtLocal));

  const tableContent = document.querySelector(".discipline-table");
  tableContent.innerHTML = "";

  const tableEl = components.getTagTable();
  tableEl.classList.add("table-sm");
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption("Программа контроля за соблюдение дисциплины персоналом");

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add("sticky-top");
  let trEl = components.getTagTR();

  // Время
  let thEl = components.getTagTH();
  thEl.classList.add("dropend");
  let btnDropdown = components.getTagButton_dropdown(time);
  btnDropdown.classList.add ('btn-time');
  // количество задач в период
  let count = arrayData.length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
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

  thEl = components.getTagTH("ФИО сотрудника");
  trEl.append(thEl);

  thEl = components.getTagTH("Описание нарушения");
  trEl.append(thEl);
  thEl = components.getTagTH("Коментарий сотрудника");
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.classList.add("dropend");
  btnDropdown = components.getTagButton_dropdown("Решение менеджера");
  // количество задач в работе
  count = arrayData.filter((el) => !el.managerDecision).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  //  Количество просроченных менеджером задач
  let countDelays = arrayData.filter((el) => el.managerDecision === "Просрочка").length;
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
  btnDropdown = components.getTagButton_dropdown("Контроль управляющего");
  // количество задач в работе
  count = arrayData.filter((el) => !el.unitDirectorControl).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  countDelays = arrayData.filter((el) => el.unitDirectorControl === "Просрочка").length;
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

  arrayData.forEach((order) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let time = components.getTagTD(order.scheduledShiftStartAtLocal);
    trEl.append(time);
    let fio = components.getTagTD(order.fio);
    trEl.append(fio);

    let sertificate = order.wasLateDeliveryVoucherGiven ? `<b>Выдан</b>` : "Нет";
    let isFalseDelivery = order.isFalseDelivery ? "<b>Да</b> - уточните у курьера где он сделал отметку о выдаче заказе" : "Нет";

    // Тип правонарушения с модальным окном
    let typeViolation = components.getTagTD();
    // if (order.expiration >= 10 && order.expiration < 20) orderNumber.classList.add("bg-danger-subtle");
    // if (order.expiration >= 20) orderNumber.classList.add("bg-danger");
    let fade = components.getTagDiv("modal");
    fade.classList.add("fade");
    fade.setAttribute("id", order.scheduleId);
    fade.setAttribute("tabindex", "-1");
    fade.setAttribute("data-bs-backdrop", "static");
    fade.setAttribute("data-bs-keyboard", "false");
    let divDialog = components.getTagDiv("modal-dialog");
    let divContent = components.getTagDiv("modal-content");
    let divHeader = components.getTagDiv("modal-header");
    let titleH1 = components.getTagH(1, "Подробная информация о правонарушении");
    titleH1.classList.add("modal-title");
    titleH1.classList.add("fs-5");
    let closeBtn = components.getTagButton_close();
    let modalBody = components.getTagDiv("modal-body");
    modalBody.innerHTML = `
    <b>Общие данные</b><br>
    ФИО сотрудника: ${order.fio}<br>
    Описание правонарушения: ${order.typeViolation}<br>

    <b>Временные данные</b><br>
    Начало смены по графику: ${order.scheduledShiftStartAtLocal}<br>
    Начало смены - факт: ${order.clockInAtLocal}<br>
    Окончание смены по графику: ${order.clockOutAtLocal}  минут <br>
    Окончание смены - факт: ${order.clockOutAtLocal}  минут <br>
`;
    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);
    let btnOrder = components.getTagButton(order.typeViolation);
    btnOrder.setAttribute("data-bs-toggle", "modal");
    btnOrder.setAttribute("data-bs-target", `#${order.scheduleId}`);
    btnOrder.classList.add("btn-secondary");
    typeViolation.append(btnOrder, fade);
    trEl.append(typeViolation);

    let courierComment = components.getTagTD(order.commentStaff);
    trEl.append(courierComment);

    let graphistComment = components.getTagTD();
    let graphistCommentTextarea = components.getTagTextarea();
    graphistCommentTextarea.textContent = order.managerDecision;
    graphistCommentTextarea.classList.add("discipline-graphistComment");
    graphistCommentTextarea.setAttribute("cols", "75");
    graphistComment.append(graphistCommentTextarea);
    trEl.append(graphistComment);

    let directorComment = components.getTagTD();
    let directorCommentTextarea = components.getTagTextarea();
    directorCommentTextarea.textContent = order.unitDirectorControl;
    directorCommentTextarea.classList.add("discipline-directorComment");
    directorCommentTextarea.setAttribute("cols", "75");
    directorComment.append(directorCommentTextarea);
    trEl.append(directorComment);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton("Сохранить");
    btnEl.classList.add("arrayData-btn-save");
    btnEl.setAttribute("data-id", order.scheduleId);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  //editData();
}
