import * as components from '../../components.js';
import { editData } from './edit_badTrips.js';
import * as filter from './filter_badTrips.js';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

export async function renderTable(arrayData, time, fullDataUnit, filterToCourier) {
  if (!filterToCourier) {
    arrayData.sort((a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt));
  }

  const tableContent = document.querySelector('.badTrips-table');
  tableContent.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption('Программа контроля за проблемными поездками курьеров');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH();
  thEl.classList.add('dropend');
  thEl.classList.add('time-defects');
  let btnDropdown = components.getTagButton_dropdown();
  btnDropdown.value = time;
  if (time == 0) btnDropdown.textContent = 'Все время';
  if (time == 1) btnDropdown.textContent = 'За сутки';
  if (time == 3) btnDropdown.textContent = 'За 3 дня';
  if (time == 7) btnDropdown.textContent = 'За неделю';
  btnDropdown.classList.add('btn-time');

  // количество задач в период
  let count = arrayData.length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  let ulDrop = components.getTagUL_dropdownMenu();
  let liDrpop = components.getTagLI_dropdownItem('За прошедшие сутки');
  liDrpop.value = 1;
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('За прошедшие 3 дня');
  ulDrop.append(liDrpop);
  liDrpop.value = 3;
  liDrpop = components.getTagLI_dropdownItem('За последнюю неделю');
  ulDrop.append(liDrpop);
  liDrpop.value = 7;
  liDrpop = components.getTagLI_dropdownItem('Показать за все время');
  ulDrop.append(liDrpop);
  liDrpop.value = 0;
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH('ФИО курьера');
  trEl.append(thEl);

  thEl = components.getTagTH('№ заказа');
  trEl.append(thEl);
  thEl = components.getTagTH('Коментарий курьера');
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.classList.add('manager-defects');
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Решение менеджера');
  // количество задач в работе
  count = arrayData.filter((el) => !el.graphistComment).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  //  Количество просроченных менеджером задач
  let countDelays = arrayData.filter((el) => el.graphistComment === 'Просрочка').length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem('Показать все');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('Только просроченные');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('В работе');
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  // решение управляющего
  thEl = components.getTagTH();
  thEl.classList.add('unitDirector-defects');
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Решение управляющего');
  // количество задач в работе
  count = arrayData.filter((el) => !el.directorComment.content).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  countDelays = arrayData.filter((el) => el.directorComment.content === 'Просрочка').length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem('Показать все');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('Только просроченные');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('В работе');
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH('Управление');
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  arrayData.forEach((order) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let time = components.getTagTD(new Date(order.handedOverToDeliveryAt).toLocaleString().slice(0, 17));
    trEl.append(time);
    let fio = components.getTagTD(order.fio);
    trEl.append(fio);

    let sertificate = order.wasLateDeliveryVoucherGiven ? `<b>Выдан</b>` : 'Нет';
    let isFalseDelivery = order.isFalseDelivery
      ? '<b>Да</b> - уточните у курьера где он сделал отметку о выдаче заказе'
      : 'Нет';

    // Номер заказа с модальным окном
    let orderNumber = components.getTagTD();
    let fade = components.getTagDiv('modal');
    fade.classList.add('fade');
    fade.setAttribute('id', order.orderId);
    fade.setAttribute('tabindex', '-1');
    fade.setAttribute('data-bs-backdrop', 'static');
    fade.setAttribute('data-bs-keyboard', 'false');
    let divDialog = components.getTagDiv('modal-dialog');
    let divContent = components.getTagDiv('modal-content');
    let divHeader = components.getTagDiv('modal-header');
    let titleH1 = components.getTagH(1, 'Подробная информация о поездке курьера');
    titleH1.classList.add('modal-title');
    titleH1.classList.add('fs-5');
    let closeBtn = components.getTagButton_close();
    let modalBody = components.getTagDiv('modal-body');
    let dateResponceCourier = order.dateResponceCourier ? order.dateResponceCourier : 'Нет ответа от курьера';
    modalBody.innerHTML = `
    <b>Общие данные</b><br>
    ФИО курьера: ${order.fio}<br>
    Номер заказа: ${order.orderNumber}<br>
    Рекомендации: ${order.decisionManager}<br>
    Тип проблемы: ${order.typeOfOffense}<br>
    Количество заказов за поездку: ${order.tripOrdersCount}<br><br>

    <b>Временные данные</b><br>

    Время <a href="#" data-bs-toggle="tooltip" title="Время начала поездки = время нажатия курьером кнопки Поехали. 

Если курьер отжимает кнопку поехали не в курьерской, то это считется фальсификацией данных">начала</a>: поездки ${new Date(
      order.handedOverToDeliveryAt,
    )
      .toLocaleString()
      .slice(0, 17)}<br>
    Время окончания поездки: ${new Date(order.orderFulfilmentFlagAt).toLocaleString().slice(0, 17)}<br>
    Прогнозное время поездки: ${order.predictedDeliveryTimeMin}  минут <br>
    extraTime: ${order.extraTime}  минут <br>
    Фактическое время поездки: ${order.deliveryTimeMin} минут <br>
    Просрочка: <b>${order.expiration} минут</b><br>
    Время ответа курьером: ${dateResponceCourier} <br><br>

    <b>Параметры поездки</b><br>
    Сектор доставки: ${order.sectorName}<br>
    Выдан ли сертификат? ${sertificate}<br>
    <a href="#" data-bs-toggle="tooltip" title="Была ли доставка заказа некорректной. Причины некорректных заказов:

Неверная отметка геолокации: если курьер отметился у клиента в радиусе более, чем 300 метров.

Не реальное время поездки курьера:

Заказ выдан через мобильное приложение: если время, когда курьер доставил заказ меньше трети прогноза, то заказ будет некорректным. Заказ выдан через кассу доставки: берется время из поездки, а не заказа: не было определено прогнозного времени — поездка короче 6 минут считается читом. есть прогнозное время поездки и реальная поездка меньше чем прогнозное время деленное пополам.">Некорректная</a> доставка: ${isFalseDelivery}
    `;

    // добавляем фото
    if (order.urlPhoto) {
      const modalElement = document.createElement('div');
      modalElement.className = 'modal fade';
      modalElement.id = 'fullscreenModal';
      modalElement.tabIndex = -1;
      modalElement.setAttribute('aria-hidden', 'true');

      modalElement.innerHTML = `
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content bg-dark position-relative">
      <button type="button" class="z-3 btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
      <div class="modal-body p-0 d-flex justify-content-center align-items-center">
        <img id="modalImage" src="" class="" alt="Full Image">
      </div>
    </div>
  </div>
`;
      document.body.appendChild(modalElement);
      // Инициализируем Bootstrap-модалку
      const bootstrapModal = new bootstrap.Modal(modalElement);
      const photo = document.createElement('img');
      photo.src = order.urlPhoto;
      photo.width = 300;
      modalBody.appendChild(photo);
      photo.onclick = () => {
        const modalImage = modalElement.querySelector('#modalImage');
        modalImage.src = order.urlPhoto;
        bootstrapModal.show();
      };
    }

    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);
    let btnOrder = components.getTagButton(order.orderNumber);
    btnOrder.setAttribute('data-bs-toggle', 'modal');
    btnOrder.setAttribute('data-bs-target', `#${order.orderId}`);
    btnOrder.classList.add('position-relative');

    if (order.urlPhoto) {
      let span = document.createElement('span');
      span.classList = 'badge text-bg-success';
      span.textContent = 'фото';
      btnOrder.append(span);
    }

    if (order.wasLateDeliveryVoucherGiven) {
      const spanEl = components.getTagSpan_badge('серт');
      btnOrder.append(spanEl);
    }

    if (order.isFalseDelivery) {
      const spanEl = components.getTagSpan_badge('некорр');
      btnOrder.append(spanEl);
    }

    if (order.expiration >= 20) btnOrder.classList.add('btn-outline-danger');
    if (order.expiration >= 10 && order.expiration < 20) btnOrder.classList.add('btn-outline-warning');
    btnOrder.classList.add('btn-outline-secondary');
    btnOrder.classList.remove('btn-primary');

    orderNumber.append(btnOrder, fade);
    trEl.append(orderNumber);

    let courierComment = components.getTagTD(order.courierComment);
    trEl.append(courierComment);

    let graphistComment = components.getTagTD();
    let graphistCommentTextarea = components.getTagTextarea(order.graphistComment);
    graphistCommentTextarea.classList.add('badTrips-graphistComment');
    graphistCommentTextarea.setAttribute('cols', '75');
    if (order.graphistComment === 'Просрочка') {
      graphistCommentTextarea.classList.add('bg-danger-subtle');
    }
    graphistComment.append(graphistCommentTextarea);
    trEl.append(graphistComment);

    let directorComment = components.getTagTD();
    let directorCommentTextarea = components.getTagTextarea(order.directorComment.content);
    directorCommentTextarea.classList.add('badTrips-directorComment');
    directorCommentTextarea.setAttribute('cols', '75');
    let role = localStorage.getItem('role');
    if (role === 'менеджер смены') {
      directorCommentTextarea.disabled = true;
    }
    if (order.directorComment.content === 'Просрочка') {
      directorCommentTextarea.classList.add('bg-danger-subtle');
    }
    directorComment.append(directorCommentTextarea);
    trEl.append(directorComment);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton('Сохранить');
    btnEl.classList.add('arrayData-btn-save');
    btnEl.setAttribute('data-id', order.orderId);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);

  editData(fullDataUnit);

  // Обработчик фильтрации по дате
  const time_defects = document.querySelector('.time-defects');
  const liTimes = time_defects.querySelectorAll('li');
  liTimes.forEach((el) => {
    el.addEventListener('click', () => filter.filterToDate(el.value, fullDataUnit));
  });

  // Обработчик обновить
  let btnUpdate = document.getElementById('update');
  btnUpdate.addEventListener('click', filter.update);

  // обработчик решений менеджера смены
  const manager = document.querySelector('.manager-defects');
  const liManagers = manager.querySelectorAll('li');
  liManagers.forEach((el) => {
    el.addEventListener('click', () => filter.filterToManager(el.textContent, fullDataUnit));
  });

  // обработчик решений управляющего
  const unitDirector = document.querySelector('.unitDirector-defects');
  const liDirectors = unitDirector.querySelectorAll('li');
  liDirectors.forEach((el) => {
    el.addEventListener('click', () => filter.filterToDirector(el.textContent, fullDataUnit));
  });
}
