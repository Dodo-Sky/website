import { postDataServer } from "../../../apiServer";
import { renderPagination } from "../../../common/pagination";
import * as components from '../../../components.js';
import { getProblemOrders, getProblemOrdersCount } from "./api";

const onPageChange = async (searchParams) => {
    const spinner = document.querySelector('#bad-trips-tabs-content #program-tab #bad-trips-program-spinner');
    const container = document.querySelector('#bad-trips-tabs-content #program-tab #program-content');
    const paginationContent = components.getTagDiv("flex-column", 'bad-trips-program-pagination')

    container.innerHTML = "";
    spinner.style.display = 'flex';

    const response = await getProblemOrders(searchParams);
    const tableEl = buildTable(searchParams, response.items);

    container.append(tableEl, paginationContent);

    await renderProgram(searchParams, response)
    renderPagination({ paginationContentId: 'bad-trips-program-pagination', searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = 'none';
}

export const renderProgram = async (searchParams, res) => {
    let response = res ? res : await getProblemOrders(searchParams);

    const tableEl = await buildTable(searchParams, response.items, response.totalItems);
    const spinner = document.querySelector('#bad-trips-tabs-content #program-tab #bad-trips-program-spinner');
    const container = document.querySelector('#bad-trips-tabs-content #program-tab #program-content');
    const paginationContent = components.getTagDiv("flex-column", 'bad-trips-program-pagination')

    container.innerHTML = '';
    container.append(tableEl, paginationContent);

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

    renderPagination({ paginationContentId: 'bad-trips-program-pagination', searchParams, totalPages: response.totalPages, onPageChange });

    spinner.style.display = 'none';
}

const buildTable = async(searchParams, items, totalItems) => {
    const table = components.getTagTable();
    table.classList.add('table-sm');

    const caption = components.getTagCaption('Программа контроля за проблемными поездками курьеров');
    const thead = await buildHeader(searchParams, items, totalItems);
    const tbody = buildBody(items);

    table.append(caption, thead, tbody);
    return table;
}

const buildHeader = async (searchParams, items, totalItems) => {
    const count = await getProblemOrdersCount(searchParams);
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    tr.append(
        createTimeFilterHeader(searchParams, totalItems),
        components.getTagTH('ФИО курьера'),
        components.getTagTH('№ заказа'),
        components.getTagTH('Комментарий курьера'),
        createManagerFilterHeader(items, searchParams, count),
        createDirectorFilterHeader(items, searchParams, count),
        components.getTagTH('Управление')
    );

    thead.append(tr);
    return thead;
}

const createTimeFilterHeader = (searchParams, totalItems) => {
    const th = components.getTagTH();
    th.classList.add('dropend', 'time-defects');

    const btn = components.getTagButton_dropdown();
    btn.value = searchParams.period;
    btn.textContent = {
        all: 'Все время',
        day: 'За сутки',
        "3days": 'За 3 дня',
        week: 'За неделю'
    }[searchParams.period];

    if (totalItems) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = totalItems;
        btn.append(span);
    }
    btn.classList.add('btn-time');

    const ul = components.getTagUL_dropdownMenu();
    [
        ['За прошедшие сутки', "day"],
        ['За прошедшие 3 дня', "3days"],
        ['За последнюю неделю', "week"],
        ['Показать за все время', "all"]
    ]
        .forEach(([label, val]) => {
            const li = components.getTagLI_dropdownItem(label);
            li.value = val;

            li.addEventListener('click', async () => {
                searchParams.period = val;
                searchParams.page = 1;
                searchParams.graphistComment = "all"
                searchParams.directorComment = "all"

                await renderProgram(searchParams);
            })

            ul.append(li);
        });

    th.append(btn, ul);
    return th;
}

const createManagerFilterHeader = (items, searchParams, count) => {
    const th = components.getTagTH();
    th.classList.add('dropend', 'manager-defects');

    const btn = components.getTagButton_dropdown('Решение менеджера');

    if (parseInt(count.graphistInWork)) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = count.graphistInWork;
        btn.append(span);
    }
    if (parseInt(count.graphistDelay)) {
        const span = components.getTagSpan_badge(count.graphistDelay);
        span.textContent = count.graphistDelay;
        btn.append(span);
    }

    const ul = components.getTagUL_dropdownMenu();
    [
        ['Показать все', 'all'],
        ['Только просроченные', 'delay'],
        ['В работе', 'inwork']
    ]
        .forEach(([label, val]) => {
            const li = components.getTagLI_dropdownItem(label)
            li.value = val;

            li.addEventListener('click', async () => {
                searchParams.graphistComment = val;
                searchParams.page = 1;
                searchParams.period = "all"
                searchParams.directorComment = "all"

                await renderProgram(searchParams);
            })

            ul.append(li)
        });

    th.append(btn, ul);
    return th;
}

const createDirectorFilterHeader = (items, searchParams, count) => {
    const th = components.getTagTH();
    th.classList.add('dropend', 'unitDirector-defects');

    const btn = components.getTagButton_dropdown('Решение управляющего');

    if (parseInt(count.directorInWork)) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = parseInt(count.directorInWork);
        btn.append(span);
    }
    if (parseInt(count.directorDelay)) {
        const span = components.getTagSpan_badge(parseInt(count.directorDelay));
        span.textContent = parseInt(count.directorDelay);
        btn.append(span);
    }

    const ul = components.getTagUL_dropdownMenu();
    [
        ['Показать все', 'all'],
        ['Только просроченные', 'delay'],
        ['В работе', 'inwork']
    ]
        .forEach(([label, val]) => {
            const li = components.getTagLI_dropdownItem(label)
            li.value = val;

            li.addEventListener('click', async () => {
                searchParams.directorComment = val;
                searchParams.page = 1;
                searchParams.period = "all"
                searchParams.graphistComment = "all"

                await renderProgram(searchParams);
            })

            ul.append(li)
        });

    th.append(btn, ul);
    return th;
}

const buildBody = (arrayData) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    arrayData?.forEach(order => {
        const tr = components.getTagTR();

        const saveBtnCell = components.getTagTD();
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        saveBtnCell.append(saveBtn);

        const graphistCommentCell = components.getTagTD();
        const graphistTextarea = components.getTagTextarea(order.graphistComment || '');

        graphistTextarea.classList.add("badTrips-graphistComment");

        if (order.graphistComment === "Просрочка") graphistTextarea.classList.add('bg-danger-subtle')

        graphistTextarea.setAttribute('cols', '75');
        graphistCommentCell.append(graphistTextarea);

        const directorCommentCell = components.getTagTD();
        const directorTextarea = components.getTagTextarea(order.directorComment || '');

        directorTextarea.classList.add("badTrips-graphistComment");

        if (order.directorComment === "Просрочка") directorTextarea.classList.add('bg-danger-subtle')

        directorTextarea.setAttribute('cols', '75');
        directorCommentCell.append(directorTextarea);

        graphistTextarea.addEventListener("input", (event) => {
            const currentValue = event.target.value;

            saveBtn.disabled = currentValue === order.graphistComment && directorTextarea.value === order.directorComment;
        })

        directorTextarea.addEventListener("input", (event) => {
            const currentValue = event.target.value;

            saveBtn.disabled = currentValue === order.directorComment && graphistTextarea.value === order.graphistComment;
        })

        saveBtn.addEventListener("click", async () => {
            const request = {
                orderId: order.orderId,
                graphistComment: graphistTextarea.value,
                directorComment: directorTextarea.value,
                departmentName: localStorage.getItem('departmentName'),
            }

            await postDataServer("couriersOrderSQL", request);

            saveBtn.disabled = true;
            order.graphistComment = graphistTextarea.value
            order.directorComment = directorTextarea.value
        })

        tr.append(
            components.getTagTD(order.handedOverToDeliveryAtLocal),
            components.getTagTD(order.fio),
            createOrderCell(order),
            components.getTagTD(order.courierComment),
            graphistCommentCell,
            directorCommentCell,
            saveBtnCell,
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
          <img id="modalImage" style="height: 100%;max-width: 50%;" src="${order.urlPhoto}" alt="Full Image">
        </div>
      </div>
    </div>`;
    document.body.append(wrapper);
    wrapper.onclick = () => bsModal.hide()
    const bsModal = new bootstrap.Modal(wrapper);
    thumb.onclick = () => bsModal.show();
}

const generateModalInnerHTML = (order) => {
    let isFalseDelivery = order.isFalseDelivery
        ? '<b>Да</b> - уточните у курьера где он сделал отметку о выдаче заказе'
        : 'Нет';

    const uncorrectedDeliveryTooltip = `<a href="#" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Была ли доставка заказа некорректной.
    Причины некорректных заказов:Неверная отметка геолокации: если курьер отметился у клиента в радиусе более, чем 300 метров. 
    Не реальное время поездки курьера: 
    Заказ выдан через мобильное приложение: если время, когда курьер доставил заказ меньше трети прогноза, то заказ будет некорректным.
    Заказ выдан через кассу доставки: берется время из поездки, а не заказа: не было определено прогнозного времени — поездка короче 6 минут считается читом.
    Есть прогнозное время поездки и реальная поездка меньше чем прогнозное время деленное пополам.">Некорректная</a>`;

    const startTimeTooltip = `<a href="#" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Время начала поездки = время нажатия курьером кнопки Поехали.
        Если курьер отжимает кнопку поехали не в курьерской, то это считется фальсификацией данных">начала</a>`;

    const assemblyTimeTooltip = `<a href="#" data-bs-toggle="tooltip" data-bs-placement="bottom" title="В секундах с округлением.
        Возможны два случая: Курьер встал в очередь, и заказ появился после этого. 
        Тогда для расчета метрики берется время которое заказ пролежал на полке. 
        Так как курьер все это время мог собирать заказ. 
        Курьер встал в очередь после того, как появился заказ. 
        Тогда для расчета метрики берется время с момента постановки в курьера в очередь, до момента, когда заказ отправлен в поездку.">сборки</a>`;

    const common = `
    <b>Общие данные</b><br>
    ФИО курьера: ${order.fio}<br>
    Номер заказа: ${order.orderNumber}<br>
    Тип проблемы: ${order.typeOfOffense}<br>
    Рекомендации: ${order.decisionManager}<br>
    Количество курьеров в очереди в момент отправки заказа: ${order.numberOfCouriersInQueue}<br>
    Количество заказов за поездку: ${order.tripOrdersCount}<br><br>`;

    const times = `
    <b>Временные данные</b><br>
    Время ожидания заказа на тепловой полке (секунды): ${order.heatedShelfTime} сек<br>
    Время ${startTimeTooltip}: ${order.handedOverToDeliveryAtLocal}<br>
    Время окончания: ${order.orderFulfilmentFlagAtLocal}<br>
    Прогноз: ${order.predictedDeliveryTime} мин<br>
    extraTime: ${order.extraTime} мин<br>
    Фактическое: ${order.deliveryTime} мин<br>
    Просрочка: <b>${order.expiration} мин</b><br>
    Ответ курьера: ${order.dateResponceCourier || 'Нет ответа'}<br><br>`;


    switch (order.typeOfOffense) {
        case 'Долгая сборка заказа':
            return `
               ${common}
               <b>Параметры сборки</b><br>
               Очередь: ${order.numberOfCouriersInQueue}<br>
               Время ${assemblyTimeTooltip}: ${order.orderAssemblyAvgTime} сек<br><br>
               ${times}`;

        case 'Три и более заказа за одну поездку':
            return common + times;

        default:
            return `
               ${common}
               ${times}
               <b>Параметры поездки</b><br>
               Сектор: ${order.sectorName}<br>
               Сертификат: ${order.wasLateDeliveryVoucherGiven ? '<b>Выдан</b>' : 'Нет'}<br>
               ${uncorrectedDeliveryTooltip} доставка: ${isFalseDelivery}<br>`;
    }
}
