import * as components from '../../../components.js';
import { editData } from './editData.js';
import * as filter from './filter.js';

// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

export const renderProgram = async (arrayData, time, fullDataUnit) => {
    // setupRefresh();
    const tableEl = buildTable(arrayData, time, fullDataUnit);
    const container = document.querySelector('#bad-trips-tabs-content #program-tab');
    container.innerHTML = '';
    container.append(tableEl);
    attachFilters(fullDataUnit);
    await editData(fullDataUnit);
}

// const setupRefresh = () => {
//     const btn = document.querySelector('#update');
//     btn.addEventListener('click', update);
// }

const buildTable = (arrayData, time) => {
    const table = components.getTagTable();
    table.classList.add('table-sm');

    const caption = components.getTagCaption('Программа контроля за проблемными поездками курьеров');
    const thead = buildHeader(arrayData, time);
    const tbody = buildBody(arrayData);

    table.append(caption, thead, tbody);
    return table;
}

const buildHeader = (arrayData, time) => {
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    tr.append(
        createTimeFilterHeader(time, arrayData.length),
        components.getTagTH('ФИО курьера'),
        components.getTagTH('№ заказа'),
        components.getTagTH('Комментарий курьера'),
        createManagerFilterHeader(arrayData),
        createDirectorFilterHeader(arrayData),
        components.getTagTH('Управление')
    );

    thead.append(tr);
    return thead;
}

const createTimeFilterHeader = (time, count) => {
    const th = components.getTagTH();
    th.classList.add('dropend', 'time-defects');

    const btn = components.getTagButton_dropdown();
    btn.value = time;
    btn.textContent = {0: 'Все время', 1: 'За сутки', 3: 'За 3 дня', 7: 'За неделю'}[time];
    if (count) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = count;
        btn.append(span);
    }
    btn.classList.add('btn-time');

    const ul = components.getTagUL_dropdownMenu();
    [ ['За прошедшие сутки', 1],
        ['За прошедшие 3 дня', 3],
        ['За последнюю неделю', 7],
        ['Показать за все время', 0] ]
        .forEach(([label, val]) => {
            const li = components.getTagLI_dropdownItem(label);
            li.value = val;
            ul.append(li);
        });

    th.append(btn, ul);
    return th;
}

const createManagerFilterHeader = (arrayData) => {
    const th = components.getTagTH();
    th.classList.add('dropend', 'manager-defects');

    const btn = components.getTagButton_dropdown('Решение менеджера');
    const inWork = arrayData.filter(el => !el.graphistComment).length;
    const delays = arrayData.filter(el => el.graphistComment === 'Просрочка').length;

    if (inWork) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = inWork;
        btn.append(span);
    }
    if (delays) {
        const span = components.getTagSpan_badge(delays);
        span.textContent = delays;
        btn.append(span);
    }

    const ul = components.getTagUL_dropdownMenu();
    ['Показать все', 'Только просроченные', 'В работе']
        .forEach(label => ul.append(components.getTagLI_dropdownItem(label)));

    th.append(btn, ul);
    return th;
}

const createDirectorFilterHeader = (arrayData) => {
    const th = components.getTagTH();
    th.classList.add('dropend', 'unitDirector-defects');

    const btn = components.getTagButton_dropdown('Решение управляющего');
    const inWork = arrayData.filter(el => !el.directorComment).length;
    const delays = arrayData.filter(el => el.directorComment === 'Просрочка').length;

    if (inWork) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = inWork;
        btn.append(span);
    }
    if (delays) {
        const span = components.getTagSpan_badge(delays);
        span.textContent = delays;
        btn.append(span);
    }

    const ul = components.getTagUL_dropdownMenu();
    ['Показать все', 'Только просроченные', 'В работе']
        .forEach(label => ul.append(components.getTagLI_dropdownItem(label)));

    th.append(btn, ul);
    return th;
}

const buildBody = (arrayData) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    arrayData.forEach(order => {
        const tr = components.getTagTR();
        tr.append(
            components.getTagTD(order.handedOverToDeliveryAtLocal),
            components.getTagTD(order.fio),
            createOrderCell(order),
            components.getTagTD(order.courierComment),
            createTextAreaCell(order.graphistComment, 'badTrips-graphistComment'),
            createTextAreaCell(order.directorComment, 'badTrips-directorComment', localStorage.getItem('role') === 'менеджер смены'),
            createSaveButtonCell(order.orderId)
        );
        tbody.append(tr);
    });

    return tbody;
}

const createOrderCell = (order) => {
    const td = components.getTagTD();
    const btn = components.getTagButton(order.orderNumber);
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', `#${order.orderId}`);
    btn.classList.add('btn-outline-secondary', 'position-relative');
    btn.classList.remove('btn-primary')

    if (order.expiration >= 20) {
        btn.classList.add('btn-outline-danger');
    } else if (order.expiration >= 10) {
        btn.classList.add('btn-outline-warning');
    }

    if (order.urlPhoto) {
        let span = document.createElement('span');
        span.classList = 'badge text-bg-success';
        span.textContent = 'фото';
        btn.append(span)
    }
    if (order.deliveryTransportName === 'OnFoot') {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = 'Пеший';
        btn.prepend(span);
    }
    if (order.deliveryTransportName === 'Bicycle') {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = 'Вело';
        btn.prepend(span);
    }
    if (order.wasLateDeliveryVoucherGiven) btn.append(components.getTagSpan_badge('серт'));
    if (order.isFalseDelivery) btn.append(components.getTagSpan_badge('некорр'));

    const fade = buildModal(order);
    td.append(btn, fade);
    return td;
}

const buildModal = (order) => {
    const fade = components.getTagDiv('modal');
    fade.classList.add('fade');
    fade.id = order.orderId;
    fade.tabIndex = -1;
    fade.setAttribute('data-bs-backdrop', 'static');
    fade.setAttribute('data-bs-keyboard', 'false');

    const dialog = components.getTagDiv('modal-dialog');
    const content = components.getTagDiv('modal-content');
    const header = components.getTagDiv('modal-header');
    const title = components.getTagH(1, 'Подробная информация о поездке курьера');
    title.classList.add('modal-title', 'fs-5');
    const closeBtn = components.getTagButton_close();
    header.append(title, closeBtn);

    const body = components.getTagDiv('modal-body');
    body.innerHTML = generateModalInnerHTML(order);

    if (order.urlPhoto) {
        const photo = document.createElement('img');
        photo.src = order.urlPhoto;
        photo.width = 300;

        body.appendChild(photo);
        buildFullscreenModal(order, photo);
    }

    dialog.append(content);
    content.append(header, body);
    fade.append(dialog);

    return fade;
}

const buildFullscreenModal = (order, thumb) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal fade';
    wrapper.id = 'fullscreenModal';
    wrapper.tabIndex = -1;
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.innerHTML = `
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content bg-dark position-relative">
        <button type="button" class="z-3 btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
        <div class="modal-body p-0 d-flex justify-content-center align-items-center">
          <img id="modalImage" style="height: 100%;" src="${order.urlPhoto}" alt="Full Image">
        </div>
      </div>
    </div>`;
    document.body.append(wrapper);
    wrapper.onclick = () => bsModal.hide()
    const bsModal = new bootstrap.Modal(wrapper);
    thumb.onclick = () => bsModal.show();
}

const generateModalInnerHTML = (order) => {
    const common = `
    <b>Общие данные</b><br>
    ФИО курьера: ${order.fio}<br>
    Номер заказа: ${order.orderNumber}<br>
    Решение менеджера: ${order.decisionManager}<br>
    Тип проблемы: ${order.typeOfOffense}<br>
    Кол-во заказов: ${order.tripOrdersCount}<br><br>`;

    const times = `
    <b>Временные данные</b><br>
    Время начала: ${order.handedOverToDeliveryAtLocal}<br>
    Время окончания: ${order.orderFulfilmentFlagAtLocal}<br>
    Прогноз: ${order.predictedDeliveryTime} мин<br>
    extraTime: ${order.extraTime} мин<br>
    Фактическое: ${order.deliveryTime} мин<br>
    Просрочка: <b>${order.expiration} мин</b><br>
    Ответ курьера: ${order.dateResponceCourier || 'Нет ответа'}<br><br>`;

    if (order.typeOfOffense === 'Долгая сборка заказа') {
        return `
      ${common}
      <b>Параметры сборки</b><br>
      Очередь: ${order.numberOfCouriersInQueue}<br>
      Время на полке: ${order.heatedShelfTime} сек<br>
      Время сборки: ${order.orderAssemblyAvgTime} сек<br><br>
      ${times}`;
    } else if (order.typeOfOffense === 'Три и более заказа за одну поездку') {
        return `
      ФИО курьера: ${order.fio}<br>
      Номера заказов: ${order.orderNumber}<br>
      Тип проблемы: ${order.typeOfOffense}<br>
      Кол-во курьеров в очереди: ${order.numberOfCouriersInQueue}<br>
      Кол-во заказов: ${order.tripOrdersCount}<br>`;
    } else {
        return `
      ${common}
      ${times}
      <b>Параметры поездки</b><br>
      Сектор: ${order.sectorName}<br>
      Сертификат: ${order.wasLateDeliveryVoucherGiven ? '<b>Выдан</b>' : 'Нет'}<br>
      Некорректная доставка: ${order.isFalseDelivery ? '<b>Да</b>' : 'Нет'}<br>`;
    }
}

const createTextAreaCell = (value, cssClass, disabled = false) => {
    const td = components.getTagTD();
    const ta = components.getTagTextarea(value || '');
    ta.classList.add(cssClass);
    ta.setAttribute('cols', '75');
    if (value === 'Просрочка') ta.classList.add('bg-danger-subtle');
    if (disabled) ta.disabled = true;
    td.append(ta);
    return td;
}

const createSaveButtonCell = (id) => {
    const td = components.getTagTD();
    const btn = components.getTagButton('Сохранить');
    btn.classList.add('arrayData-btn-save');
    btn.dataset.id = id;
    btn.disabled = true;
    td.append(btn);
    return td;
}

const attachFilters = (fullDataUnit) => {
    document.querySelectorAll('.time-defects li')
        .forEach(el => el.addEventListener('click', () => filter.filterToDate(el.value, fullDataUnit)));

    document.querySelectorAll('.manager-defects li')
        .forEach(el => el.addEventListener('click', () => filter.filterToManager(el.textContent, fullDataUnit)));

    document.querySelectorAll('.unitDirector-defects li')
        .forEach(el => el.addEventListener('click', () => filter.filterToDirector(el.textContent, fullDataUnit)));
}

// export async function renderProgram(arrayData, time, fullDataUnit, filterToCourier) {
//   const refreshBtn = document.querySelector('#update');
//   refreshBtn.addEventListener('click', update);
//
//   const tableContent = document.querySelector('#bad-trips-tabs-content #program-tab');
//   tableContent.innerHTML = '';
//
//   const tableEl = components.getTagTable();
//   tableEl.classList.add('table-sm');
//   tableContent.append(tableEl);
//   const captionEl = components.getTagCaption('Программа контроля за проблемными поездками курьеров');
//
//   // Заголовок таблицы THead
//   const theadEl = components.getTagTHead();
//   theadEl.classList.add('sticky-top');
//   let trEl = components.getTagTR();
//
//   let thEl = components.getTagTH();
//   thEl.classList.add('dropend');
//   thEl.classList.add('time-defects');
//   let btnDropdown = components.getTagButton_dropdown();
//   btnDropdown.value = time;
//   if (time == 0) btnDropdown.textContent = 'Все время';
//   if (time == 1) btnDropdown.textContent = 'За сутки';
//   if (time == 3) btnDropdown.textContent = 'За 3 дня';
//   if (time == 7) btnDropdown.textContent = 'За неделю';
//   btnDropdown.classList.add('btn-time');
//
//   // количество задач в период
//   let count = arrayData.length;
//   if (count) {
//     const spanWork = components.getTagSpan();
//     spanWork.classList.add('badge');
//     spanWork.classList.add('text-bg-secondary');
//     spanWork.textContent = count;
//     btnDropdown.append(spanWork);
//   }
//   let ulDrop = components.getTagUL_dropdownMenu();
//   let liDrpop = components.getTagLI_dropdownItem('За прошедшие сутки');
//   liDrpop.value = 1;
//   ulDrop.append(liDrpop);
//   liDrpop = components.getTagLI_dropdownItem('За прошедшие 3 дня');
//   ulDrop.append(liDrpop);
//   liDrpop.value = 3;
//   liDrpop = components.getTagLI_dropdownItem('За последнюю неделю');
//   ulDrop.append(liDrpop);
//   liDrpop.value = 7;
//   liDrpop = components.getTagLI_dropdownItem('Показать за все время');
//   ulDrop.append(liDrpop);
//   liDrpop.value = 0;
//   thEl.append(btnDropdown, ulDrop);
//   trEl.append(thEl);
//
//   thEl = components.getTagTH('ФИО курьера');
//   trEl.append(thEl);
//
//   thEl = components.getTagTH('№ заказа');
//   trEl.append(thEl);
//   thEl = components.getTagTH('Коментарий курьера');
//   trEl.append(thEl);
//
//   // решение менеджера
//   thEl = components.getTagTH();
//   thEl.classList.add('manager-defects');
//   thEl.classList.add('dropend');
//   btnDropdown = components.getTagButton_dropdown('Решение менеджера');
//   // количество задач в работе
//   count = arrayData.filter((el) => !el.graphistComment).length;
//   if (count) {
//     const spanWork = components.getTagSpan();
//     spanWork.classList.add('badge');
//     spanWork.classList.add('text-bg-secondary');
//     spanWork.textContent = count;
//     btnDropdown.append(spanWork);
//   }
//   //  Количество просроченных менеджером задач
//   let countDelays = arrayData.filter((el) => el.graphistComment === 'Просрочка').length;
//   if (countDelays) {
//     const spanEl = components.getTagSpan_badge(countDelays);
//     spanEl.textContent = countDelays;
//     btnDropdown.append(spanEl);
//   }
//   ulDrop = components.getTagUL_dropdownMenu();
//   liDrpop = components.getTagLI_dropdownItem('Показать все');
//   ulDrop.append(liDrpop);
//   liDrpop = components.getTagLI_dropdownItem('Только просроченные');
//   ulDrop.append(liDrpop);
//   liDrpop = components.getTagLI_dropdownItem('В работе');
//   ulDrop.append(liDrpop);
//   thEl.append(btnDropdown, ulDrop);
//   trEl.append(thEl);
//
//   // решение управляющего
//   thEl = components.getTagTH();
//   thEl.classList.add('unitDirector-defects');
//   thEl.classList.add('dropend');
//   btnDropdown = components.getTagButton_dropdown('Решение управляющего');
//   // количество задач в работе
//   count = arrayData.filter((el) => !el.directorComment).length;
//   if (count) {
//     const spanWork = components.getTagSpan();
//     spanWork.classList.add('badge');
//     spanWork.classList.add('text-bg-secondary');
//     spanWork.textContent = count;
//     btnDropdown.append(spanWork);
//   }
//   // Количество просроченных управляющим задач
//   countDelays = arrayData.filter((el) => el.directorComment === 'Просрочка').length;
//   if (countDelays) {
//     const spanEl = components.getTagSpan_badge(countDelays);
//     spanEl.textContent = countDelays;
//     btnDropdown.append(spanEl);
//   }
//   ulDrop = components.getTagUL_dropdownMenu();
//   liDrpop = components.getTagLI_dropdownItem('Показать все');
//   ulDrop.append(liDrpop);
//   liDrpop = components.getTagLI_dropdownItem('Только просроченные');
//   ulDrop.append(liDrpop);
//   liDrpop = components.getTagLI_dropdownItem('В работе');
//   ulDrop.append(liDrpop);
//   thEl.append(btnDropdown, ulDrop);
//   trEl.append(thEl);
//
//   thEl = components.getTagTH('Управление');
//   trEl.append(thEl);
//   theadEl.append(trEl);
//
//   // Тело таблицы tBody
//   const tBody = components.getTagTBody();
//   tBody.classList.add('tBody');
//
//   arrayData.forEach((order) => {
//     trEl = components.getTagTR();
//     tBody.append(trEl);
//     // let time = components.getTagTD(new Date(order.handedOverToDeliveryAt).toString().slice(0, 17));
//     let time = components.getTagTD(order.handedOverToDeliveryAtLocal);
//     trEl.append(time);
//     let fio = components.getTagTD(order.fio);
//     trEl.append(fio);
//
//     let sertificate = order.wasLateDeliveryVoucherGiven ? `<b>Выдан</b>` : 'Нет';
//     let isFalseDelivery = order.isFalseDelivery
//       ? '<b>Да</b> - уточните у курьера где он сделал отметку о выдаче заказе'
//       : 'Нет';
//
//     // Номер заказа с модальным окном
//     let orderNumber = components.getTagTD();
//     let fade = components.getTagDiv('modal');
//     fade.classList.add('fade');
//     fade.setAttribute('id', order.orderId);
//     fade.setAttribute('tabindex', '-1');
//     fade.setAttribute('data-bs-backdrop', 'static');
//     fade.setAttribute('data-bs-keyboard', 'false');
//     let divDialog = components.getTagDiv('modal-dialog');
//     let divContent = components.getTagDiv('modal-content');
//     let divHeader = components.getTagDiv('modal-header');
//     let titleH1 = components.getTagH(1, 'Подробная информация о поездке курьера');
//     titleH1.classList.add('modal-title');
//     titleH1.classList.add('fs-5');
//     let closeBtn = components.getTagButton_close();
//     let modalBody = components.getTagDiv('modal-body');
//     let dateResponceCourier = order.dateResponceCourier ? order.dateResponceCourier : 'Нет ответа от курьера';
//     modalBody.innerHTML = `
//     <b>Общие данные</b><br>
//     ФИО курьера: ${order.fio}<br>
//     Номер заказа: ${order.orderNumber}<br>
//     Рекомендации: ${order.decisionManager}<br>
//     Тип проблемы: ${order.typeOfOffense}<br>
//     Количество заказов за поездку: ${order.tripOrdersCount}<br><br>
//
//     <b>Временные данные</b><br>
//
//     Время <a href="#" data-bs-toggle="tooltip" title="Время начала поездки = время нажатия курьером кнопки Поехали.
//
// Если курьер отжимает кнопку поехали не в курьерской, то это считется фальсификацией данных">начала</a>: поездки ${order.handedOverToDeliveryAtLocal}
// <br>
//     Время окончания поездки: ${order.orderFulfilmentFlagAtLocal}<br>
//     Прогнозное время поездки: ${order.predictedDeliveryTime}  минут <br>
//     extraTime: ${order.extraTime}  минут <br>
//     Фактическое время поездки: ${order.deliveryTime} минут <br>
//     Просрочка: <b>${order.expiration} минут</b><br>
//     Время ответа курьером: ${dateResponceCourier} <br><br>
//
//     <b>Параметры поездки</b><br>
//     Сектор доставки: ${order.sectorName}<br>
//     Выдан ли сертификат? ${sertificate}<br>
//     <a href="#" data-bs-toggle="tooltip" title="Была ли доставка заказа некорректной. Причины некорректных заказов:
//
// Неверная отметка геолокации: если курьер отметился у клиента в радиусе более, чем 300 метров.
//
// Не реальное время поездки курьера:
//
// Заказ выдан через мобильное приложение: если время, когда курьер доставил заказ меньше трети прогноза, то заказ будет некорректным. Заказ выдан через кассу доставки: берется время из поездки, а не заказа: не было определено прогнозного времени — поездка короче 6 минут считается читом. есть прогнозное время поездки и реальная поездка меньше чем прогнозное время деленное пополам.">Некорректная</a> доставка: ${isFalseDelivery}
//     `;
//
//     if (order.typeOfOffense === 'Долгая сборка заказа') {
//       modalBody.innerHTML = `
//     <b>Общие данные</b><br>
//     ФИО курьера: ${order.fio}<br>
//     Номер заказа: ${order.orderNumber}<br>
//     Тип проблемы: ${order.typeOfOffense}<br>
//     Количество курьеров в очереди в момент отправки заказа: ${order.numberOfCouriersInQueue}<br>
//     Количество заказов за поездку: ${order.tripOrdersCount}<br><br>
//
//     <b>Временные данные</b><br>
//     Время ожидания заказа на тепловой полке (секунды): ${order.heatedShelfTime}<br>
//     Время <a href="#" data-bs-toggle="tooltip" title="В секундах с округлением. Возможны два случая:
// Курьер встал в очередь, и заказ появился после этого. Тогда для расчета метрики берется время которое заказ пролежал на полке. Так как курьер все это время мог собирать заказ.
// Курьер встал в очередь после того, как появился заказ. Тогда для расчета метрики берется время с момента постановки в курьера в очередь, до момента, когда заказ отправлен в поездку.">сборки</a>: заказа: ${order.orderAssemblyAvgTime}<br><br>
//
//     Время <a href="#" data-bs-toggle="tooltip" title="Время начала поездки = время нажатия курьером кнопки Поехали.
// Если курьер отжимает кнопку поехали не в курьерской, то это считется фальсификацией данных">начала</a>: поездки ${order.handedOverToDeliveryAtLocal}<br>
//     Время окончания поездки: ${order.orderFulfilmentFlagAtLocal}<br>
//     Прогнозное время поездки: ${order.predictedDeliveryTime}  минут <br>
//     extraTime: ${order.extraTime}  минут <br>
//     Фактическое время поездки: ${order.deliveryTime} минут <br>
//
//     Время ответа курьером: ${dateResponceCourier} <br><br>`;
//     }
//
//     if (order.typeOfOffense === 'Три и более заказа за одну поездку') {
//       modalBody.innerHTML = `
//     ФИО курьера: ${order.fio}<br>
//     Номера заказов: ${order.orderNumber}<br>
//     Тип проблемы: ${order.typeOfOffense}<br>
//     Рекомендации: ${order.decisionManager}<br>
//     Количество курьеров в очереди в момент отправки заказа: ${order.numberOfCouriersInQueue}<br>
//     Количество заказов за поездку: ${order.tripOrdersCount}<br><br>`;
//     }
//
//     // добавляем фото
//     if (order.urlPhoto) {
//       const modalElement = document.createElement('div');
//       modalElement.className = 'modal fade';
//       modalElement.id = 'fullscreenModal';
//       modalElement.tabIndex = -1;
//       modalElement.setAttribute('aria-hidden', 'true');
//
//       modalElement.innerHTML = `
//   <div class="modal-dialog modal-fullscreen">
//     <div class="modal-content bg-dark position-relative">
//       <button type="button" class="z-3 btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
//       <div class="modal-body p-0 d-flex justify-content-center align-items-center">
//         <img id="modalImage" src="" class="" alt="Full Image">
//       </div>
//     </div>
//   </div>
// `;
//       document.body.appendChild(modalElement);
//       // Инициализируем Bootstrap-модалку
//       const bootstrapModal = new bootstrap.Modal(modalElement);
//       const photo = document.createElement('img');
//       photo.src = order.urlPhoto;
//       photo.width = 300;
//       modalBody.appendChild(photo);
//       photo.onclick = () => {
//         const modalImage = modalElement.querySelector('#modalImage');
//         modalImage.src = order.urlPhoto;
//         bootstrapModal.show();
//       };
//     }
//
//     fade.append(divDialog);
//     divDialog.append(divContent);
//     divHeader.append(titleH1, closeBtn);
//     divContent.append(divHeader, modalBody);
//     let btnOrder = components.getTagButton(order.orderNumber);
//     btnOrder.setAttribute('data-bs-toggle', 'modal');
//     btnOrder.setAttribute('data-bs-target', `#${order.orderId}`);
//     btnOrder.classList.add('position-relative');
//
//     if (order.urlPhoto) {
//       let span = document.createElement('span');
//       span.classList = 'badge text-bg-success';
//       span.textContent = 'фото';
//       btnOrder.append(span);
//     }
//
//     if (order.deliveryTransportName === 'OnFoot') {
//       let span = document.createElement('span');
//       span.classList = 'badge text-bg-secondary';
//       span.textContent = 'Пеший';
//       btnOrder.prepend(span);
//     }
//
//     if (order.deliveryTransportName === 'Bicycle') {
//       let span = document.createElement('span');
//       span.classList = 'badge text-bg-secondary';
//       span.textContent = 'Вело';
//       btnOrder.prepend(span);
//     }
//
//     if (order.wasLateDeliveryVoucherGiven) {
//       const spanEl = components.getTagSpan_badge('серт');
//       btnOrder.append(spanEl);
//     }
//
//     if (order.isFalseDelivery) {
//       const spanEl = components.getTagSpan_badge('некорр');
//       btnOrder.append(spanEl);
//     }
//
//     if (order.expiration >= 20) btnOrder.classList.add('btn-outline-danger');
//     if (order.expiration >= 10 && order.expiration < 20) btnOrder.classList.add('btn-outline-warning');
//     btnOrder.classList.add('btn-outline-secondary');
//     btnOrder.classList.remove('btn-primary');
//
//     orderNumber.append(btnOrder, fade);
//     trEl.append(orderNumber);
//
//     let courierComment = components.getTagTD(order.courierComment);
//     trEl.append(courierComment);
//
//     let graphistComment = components.getTagTD();
//     let graphistCommentTextarea = components.getTagTextarea(order.graphistComment);
//     graphistCommentTextarea.classList.add('badTrips-graphistComment');
//     graphistCommentTextarea.setAttribute('cols', '75');
//     if (order.graphistComment === 'Просрочка') {
//       graphistCommentTextarea.classList.add('bg-danger-subtle');
//     }
//     graphistComment.append(graphistCommentTextarea);
//     trEl.append(graphistComment);
//
//     let directorComment = components.getTagTD();
//     let directorCommentTextarea = components.getTagTextarea(order.directorComment);
//     directorCommentTextarea.classList.add('badTrips-directorComment');
//     directorCommentTextarea.setAttribute('cols', '75');
//     let role = localStorage.getItem('role');
//     if (role === 'менеджер смены') {
//       directorCommentTextarea.disabled = true;
//     }
//     if (order.directorComment === 'Просрочка') {
//       directorCommentTextarea.classList.add('bg-danger-subtle');
//     }
//     directorComment.append(directorCommentTextarea);
//     trEl.append(directorComment);
//
//     let tdEl = components.getTagTD();
//     let btnEl = components.getTagButton('Сохранить');
//     btnEl.classList.add('arrayData-btn-save');
//     btnEl.setAttribute('data-id', order.orderId);
//     btnEl.disabled = true;
//     tdEl.append(btnEl);
//     trEl.append(tdEl);
//   });
//   tableEl.append(captionEl, theadEl, tBody);
//
//   // Обработчик фильтрации по дате
//   const time_defects = document.querySelector('.time-defects');
//   const liTimes = time_defects.querySelectorAll('li');
//   liTimes.forEach((el) => {
//     el.addEventListener('click', () => filter.filterToDate(el.value, fullDataUnit));
//   });
//
//   // обработчик решений менеджера смены
//   const manager = document.querySelector('.manager-defects');
//   const liManagers = manager.querySelectorAll('li');
//   liManagers.forEach((el) => {
//     el.addEventListener('click', () => filter.filterToManager(el.textContent, fullDataUnit));
//   });
//
//   // обработчик решений управляющего
//   const unitDirector = document.querySelector('.unitDirector-defects');
//   const liDirectors = unitDirector.querySelectorAll('li');
//   liDirectors.forEach((el) => {
//     el.addEventListener('click', () => filter.filterToDirector(el.textContent, fullDataUnit));
//   });
//   editData(fullDataUnit);
// }
