import * as components from "../components.js";
import { editData } from "./edit_badTrips.js";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

export async function renderTable(arrayData) {
  arrayData.sort((a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt));

  const tableContent = document.querySelector(".badTrips-table");
  tableContent.innerHTML = "";

  const tableEl = components.getTagTable();
  tableEl.classList.add("table-sm");
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption("Программа контроля за проблемными поездками курьеров");

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add("sticky-top");
  let trEl = components.getTagTR();

  // Время
  let thEl = components.getTagTH();
  thEl.classList.add("dropend");
  let btnDropdown = components.getTagButton_dropdown("Время");
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

  thEl = components.getTagTH("ФИО курьера");
  trEl.append(thEl);

  thEl = components.getTagTH("№ заказа");
  trEl.append(thEl);
  thEl = components.getTagTH("Коментарий курьера");
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.classList.add("dropend");
  btnDropdown = components.getTagButton_dropdown("Менеджер");
  // количество задач в работе
  count = arrayData.filter((el) => !el.graphistComment).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  //  Количество просроченных менеджером задач
  let countDelays = arrayData.filter((el) => el.graphistComment === "Просрочка").length;
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
  count = arrayData.filter((el) => !el.directorComment).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add("badge");
    spanWork.classList.add("text-bg-secondary");
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  countDelays = arrayData.filter((el) => el.directorComment === "Просрочка").length;
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
    let time = components.getTagTD(order.handedOverToDeliveryAt);
    trEl.append(time);
    let fio = components.getTagTD(order.fio);
    trEl.append(fio);

    let sertificate = order.wasLateDeliveryVoucherGiven ? `<b>Выдан</b>` : "Нет";
    let isFalseDelivery = order.isFalseDelivery ? "<b>Да</b> - уточните у курьера где он сделал отметку о выдаче заказе" : "Нет";

    // Номер заказа с модальным окном
    let orderNumber = components.getTagTD();
    if (order.expiration >= 10 && order.expiration < 20) orderNumber.classList.add("bg-danger-subtle");
    if (order.expiration >= 20) orderNumber.classList.add("bg-danger");
    let fade = components.getTagDiv("modal");
    fade.classList.add("fade");
    fade.setAttribute("id", order.orderId);
    fade.setAttribute("tabindex", "-1");
    fade.setAttribute("data-bs-backdrop", "static");
    fade.setAttribute("data-bs-keyboard", "false");
    let divDialog = components.getTagDiv("modal-dialog");
    let divContent = components.getTagDiv("modal-content");
    let divHeader = components.getTagDiv("modal-header");
    let titleH1 = components.getTagH(1, "Подробная информация о поездке курьера");
    titleH1.classList.add("modal-title");
    titleH1.classList.add("fs-5");
    let closeBtn = components.getTagButton_close();
    let modalBody = components.getTagDiv("modal-body");
    modalBody.innerHTML = `
    <b>Общие данные</b><br>
    ФИО курьера: ${order.fio}<br>
    Номер заказа: ${order.orderNumber}<br>
    Рекомендации: ${order.decisionManager}<br>
    Тип проблемы: ${order.typeOfOffense}<br><br>

    <b>Временные данные</b><br>
    Время начала поездки: ${order.handedOverToDeliveryAt}<br>
    Время окончания поездки: ${order.orderFulfilmentFlagAt}<br>
    Прогнозное время поездки: ${order.predictedDeliveryTimeMin}  минут <br>
    extraTime: ${order.extraTime}  минут <br>
    Фактическое время поездки: ${order.deliveryTimeMin} минут <br>
    Просрочка: <b>${order.expiration} минут</b><br><br>

    <b>Параметры поездки</b><br>
    Сектор доставки: ${order.sectorName}<br>
    Выдан ли сертификат? ${sertificate}<br>
    <a href="#" data-bs-toggle="tooltip" title="Была ли доставка заказа некорректной. Причины некорректных заказов:

Неверная отметка геолокации: если курьер отметился у клиента в радиусе более, чем 300 метров.

Не реальное время поездки курьера:

Заказ выдан через мобильное приложение: если время, когда курьер доставил заказ меньше трети прогноза, то заказ будет некорректным. Заказ выдан через кассу доставки: берется время из поездки, а не заказа: не было определено прогнозного времени — поездка короче 6 минут считается читом. есть прогнозное время поездки и реальная поездка меньше чем прогнозное время деленное пополам.">Некорректная доставка</a>: ${isFalseDelivery}
    `;
    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);
    let btnOrder = components.getTagButton(order.orderNumber);
    btnOrder.setAttribute("data-bs-toggle", "modal");
    btnOrder.setAttribute("data-bs-target", `#${order.orderId}`);
    btnOrder.classList.add("btn-secondary");
    orderNumber.append(btnOrder, fade);
    trEl.append(orderNumber);

    let courierComment = components.getTagTD(order.courierComment);
    trEl.append(courierComment);

    let graphistComment = components.getTagTD();
    let graphistCommentTextarea = components.getTagTextarea();
    graphistCommentTextarea.textContent = order.graphistComment;
    graphistCommentTextarea.classList.add("badTrips-graphistComment");
    graphistCommentTextarea.setAttribute("cols", "75");
    graphistComment.append(graphistCommentTextarea);
    trEl.append(graphistComment);

    let directorComment = components.getTagTD();
    let directorCommentTextarea = components.getTagTextarea();
    directorCommentTextarea.textContent = order.directorComment;
    directorCommentTextarea.classList.add("badTrips-directorComment");
    directorCommentTextarea.setAttribute("cols", "75");
    directorComment.append(directorCommentTextarea);
    trEl.append(directorComment);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton("Сохранить");
    btnEl.classList.add("arrayData-btn-save");
    btnEl.setAttribute("data-id", order.orderId);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  editData();
}
