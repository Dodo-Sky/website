import * as components from "../../components.js";
import { editData } from "./edit_discipline.js";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

export async function renderTable(arrayData, time) {
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
  thEl = components.getTagTH("Подробности");
  trEl.append(thEl);
  thEl = components.getTagTH("Коментарий сотрудника");
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.classList.add("dropend");
  btnDropdown = components.getTagButton_dropdown("Менеджер");
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
  btnDropdown = components.getTagButton_dropdown("Управляющий");
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

  arrayData.forEach((schedule) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let time = components.getTagTD(new Date (schedule.scheduledShiftStartAtLocal).toLocaleString().slice (0, 17));
    trEl.append(time);
    let fio = components.getTagTD(schedule.fio);
    trEl.append(fio);
    let typeViolation = components.getTagTD(schedule.typeViolation);
    trEl.append(typeViolation);

    // Тип правонарушения с модальным окном
    let more = components.getTagTD();
    let fade = components.getTagDiv("modal");
    fade.classList.add("fade");
    fade.setAttribute("id", schedule.scheduleId);
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
    ФИО сотрудника: ${schedule.fio}<br>
    Описание правонарушения: ${schedule.typeViolation}<br> <br>

    <b>Временные данные</b><br>
    Начало смены по графику: ${new Date (schedule.scheduledShiftStartAtLocal).toLocaleString().slice (0, 17)}<br>
    Начало смены - факт: ${new Date (schedule.clockInAtLocal).toLocaleString().slice (0, 17)}<br>
    Окончание смены по графику: ${new Date (schedule.scheduledShiftEndAtLocal).toLocaleString().slice (0, 17)} <br>
    Окончание смены - факт: ${new Date (schedule.clockOutAtLocal).toLocaleString().slice (0, 17)} <br>
`;
    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);
    let btnOrder = components.getTagButton('подробнее');
    btnOrder.setAttribute("data-bs-toggle", "modal");
    btnOrder.setAttribute("data-bs-target", `#${schedule.scheduleId}`);
    btnOrder.classList.add("btn-secondary");
    more.append(btnOrder, fade);
    trEl.append(more);

    let courierComment = components.getTagTD(schedule.commentStaff);
    trEl.append(courierComment);

    let graphistComment = components.getTagTD();
    let graphistCommentTextarea = components.getTagTextarea();
    graphistCommentTextarea.textContent = schedule.managerDecision;
    graphistCommentTextarea.classList.add("discipline-managerDecision");
    graphistCommentTextarea.setAttribute("cols", "75");
    if (schedule.managerDecision === "Просрочка") {
      graphistCommentTextarea.classList.add("text-danger");
    }
    graphistComment.append(graphistCommentTextarea);
    trEl.append(graphistComment);

    let directorComment = components.getTagTD();
    let directorCommentTextarea = components.getTagTextarea();
    directorCommentTextarea.textContent = schedule.unitDirectorControl;
    directorCommentTextarea.classList.add("discipline-unitDirectorControl");
    directorCommentTextarea.setAttribute("cols", "75");
    if (schedule.unitDirectorControl === "Просрочка") {
      directorCommentTextarea.classList.add("text-danger");
    }
    directorComment.append(directorCommentTextarea);
    trEl.append(directorComment);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton("Сохранить");
    btnEl.classList.add("arrayData-btn-save");
    btnEl.setAttribute("data-id", schedule.scheduleId ?? schedule.staffId + schedule.clockInAtLocal);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  editData();
}
