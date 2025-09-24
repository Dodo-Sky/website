import {renderPagination} from "../../common/pagination";
import * as components from "../../components";
import {getDiscipline, getDisciplineInfo} from "./api";
import {getUserRole} from "../../auth/login";
import {getShiftHistoryByShiftId, postDataServer} from "../../apiServer";

const isDisabledReasonAbsenteeism = (row) => {
    const role = getUserRole();

    if (['администратор', 'Администратор всей сети', 'управляющий'].includes(role) && ['Прогул', 'Опоздание'].includes(row.typeViolation)) {
        return false
    }

    return true
}

const formatDate = (dateString, format) => {
    if (!dateString) return '—';
    return dayjs(dateString).format(format);
}

const appendHistorySection = (modalBody, title, dates) => {
    if (dates.length === 0) return;

    modalBody.innerHTML += `<b>${title}</b><br>`;
    for (const { oldDate, newDate } of dates) {
        if (!oldDate) {
            modalBody.innerHTML += `Добавлено: ${formatDate(newDate, "DD.MM.YYYY, HH:mm")}<br>`;
        } else {
            modalBody.innerHTML += `${formatDate(oldDate, "DD.MM.YYYY, HH:mm")} → ${formatDate(newDate, "DD.MM.YYYY, HH:mm")}<br>`;
        }
    }
}

const createOrderModalFullInfoButtonHandler = (shiftId, modalBody) => {
    let loaded = false;

    return async function () {
        if (loaded) return; // Предотвращаем повторную загрузку

        try {
            const shiftHistory = await getShiftHistoryByShiftId(shiftId);
            if (shiftHistory.length === 0) return;

            modalBody.innerHTML += `<br><b>История изменений</b><br>`;

            const clockInAtDates = shiftHistory
                .filter((item) => item.old_clock_in_at_local || item.new_clock_in_at_local)
                .map((item) => ({
                    oldDate: item.old_clock_in_at_local,
                    newDate: item.new_clock_in_at_local,
                }));

            const clockOutAtDates = shiftHistory
                .filter((item) => item.old_clock_out_at_local || item.new_clock_out_at_local)
                .map((item) => ({
                    oldDate: item.old_clock_out_at_local,
                    newDate: item.new_clock_out_at_local,
                }));

            appendHistorySection(modalBody, 'Время начала смены', clockInAtDates);
            appendHistorySection(modalBody, 'Время окончания смены', clockOutAtDates);
        } catch (error) {
            console.error('Ошибка загрузки истории:', error);
            modalBody.innerHTML += `<br><b class="text-danger">Не удалось загрузить историю</b>`;
        } finally {
            loaded = true;
        }
    };
}

export const renderTable = async (searchParams, data) => {
    const disciplineInfo = await getDisciplineInfo(searchParams.unitId)
    const tableContent = document.getElementById('discipline-table-content');

    tableContent.innerHTML = ""

    const table = components.getTagTable("table-sm");
    const caption = components.getTagCaption(
        'Программа контроля за соблюдение дисциплины персоналом',
    );
    table.append(caption);

    const thead = components.getTagTHead()
    thead.classList.add('sticky-top');
    const theadTr = components.getTagTR();

    // Время
    const timeTh = components.getTagTH();
    timeTh.classList.add('dropend');
    timeTh.classList.add('time-defects');

    let timeDropdown = components.getTagButton_dropdown();
    timeDropdown.value = "all";

    switch (searchParams.period) {
        case "all":
            timeDropdown.textContent = 'Все время';
            break;

        case "week":
            timeDropdown.textContent = 'За неделю';
            break;

        case "3days":
            timeDropdown.textContent = 'За 3 дня';
            break;

        case "day":
            timeDropdown.textContent = 'За сутки';
            break;

    }

    timeDropdown.classList.add('btn-time');
    const timeCount = components.getTagSpan();
    timeCount.classList.add('badge');
    timeCount.classList.add('text-bg-secondary');
    timeCount.textContent = data.totalItems;
    timeDropdown.append(timeCount);
    timeTh.append(timeDropdown);

    let timeUlDrop = components.getTagUL_dropdownMenu();
    let timeLiDrop = components.getTagLI_dropdownItem('За прошедшие сутки');
    timeLiDrop.dataset.value = "day";
    timeUlDrop.append(timeLiDrop);
    timeLiDrop = components.getTagLI_dropdownItem('За прошедшие 3 дня');
    timeUlDrop.append(timeLiDrop);
    timeLiDrop.dataset.value = "3days";
    timeLiDrop = components.getTagLI_dropdownItem('За последнюю неделю');
    timeUlDrop.append(timeLiDrop);
    timeLiDrop.dataset.value = "week";
    timeLiDrop = components.getTagLI_dropdownItem('Показать за все время');
    timeUlDrop.append(timeLiDrop);
    timeLiDrop.dataset.value = "all";

    timeTh.append(timeUlDrop);
    theadTr.append(timeTh);

    const staffTh = components.getTagTH("ФИО сотрудника")
    theadTr.append(staffTh);

    const typeViolationTh = components.getTagTH('Тип нарушения');
    theadTr.append(typeViolationTh);

    const staffCommentTh = components.getTagTH('Комментарий сотрудника');
    theadTr.append(staffCommentTh);

    // Решение менеджера
    const managerDecisionTh = components.getTagTH();
    managerDecisionTh.classList.add('dropend');
    managerDecisionTh.classList.add('manager-defects');

    const managerDropdown = components.getTagButton_dropdown('Решение менеджера');
    const managerCount = components.getTagSpan();
    managerCount.classList.add('badge');
    managerCount.classList.add('text-bg-secondary');
    managerCount.textContent = disciplineInfo.managerInWork;
    managerDropdown.append(managerCount);

    if (!!parseInt(disciplineInfo.managerDelay)) {
        const managerBadge = components.getTagSpan_badge(disciplineInfo.managerDelay);
        managerDropdown.append(managerBadge);
    }

    let managerUlDrop = components.getTagUL_dropdownMenu();
    let managerUlDropLiDrop = components.getTagLI_dropdownItem('Показать все');
    managerUlDropLiDrop.dataset.value = "all"
    managerUlDrop.append(managerUlDropLiDrop);
    managerUlDropLiDrop = components.getTagLI_dropdownItem('Только просроченные');
    managerUlDropLiDrop.dataset.value = "delay"
    managerUlDrop.append(managerUlDropLiDrop);
    managerUlDropLiDrop = components.getTagLI_dropdownItem('В работе');
    managerUlDropLiDrop.dataset.value = "inwork"
    managerUlDrop.append(managerUlDropLiDrop);

    managerDecisionTh.append(managerDropdown, managerUlDrop);
    theadTr.append(managerDecisionTh);

    // Решение управляющего
    const directorDecisionTh = components.getTagTH();
    directorDecisionTh.classList.add('dropend');
    directorDecisionTh.classList.add('manager-defects');

    const directorDropdown = components.getTagButton_dropdown('Решение управляющего');
    const directorCount = components.getTagSpan();
    directorCount.classList.add('badge');
    directorCount.classList.add('text-bg-secondary');
    directorCount.textContent = disciplineInfo.directorInWork;
    directorDropdown.append(directorCount);

    if (!!parseInt(disciplineInfo.directorDelay)) {
        const managerBadge = components.getTagSpan_badge(disciplineInfo.directorDelay);
        directorDropdown.append(managerBadge);
    }

    let directorUlDrop = components.getTagUL_dropdownMenu();
    let directorUlDropLiDrop = components.getTagLI_dropdownItem('Показать все');
    directorUlDropLiDrop.dataset.value = "all"
    directorUlDrop.append(directorUlDropLiDrop);
    directorUlDropLiDrop = components.getTagLI_dropdownItem('Только просроченные');
    directorUlDropLiDrop.dataset.value = "delay"
    directorUlDrop.append(directorUlDropLiDrop);
    directorUlDropLiDrop = components.getTagLI_dropdownItem('В работе');
    directorUlDropLiDrop.dataset.value = "inwork"
    directorUlDrop.append(directorUlDropLiDrop);


    directorDecisionTh.append(directorDropdown, directorUlDrop);
    theadTr.append(directorDecisionTh);

    const hoursTh = components.getTagTH('Часы');
    theadTr.append(hoursTh);

    const reasonTh = components.getTagTH('Прогул уважительный?');
    theadTr.append(reasonTh);

    const control = components.getTagTH('Управление');
    theadTr.append(control);

    thead.append(theadTr);
    table.append(thead);

    const tbody = components.getTagTBody();

    data.items?.forEach((row) => {
        const tr = components.getTagTR();

        const timeTd = components.getTagTD();
        timeTd.textContent = row.scheduledShiftStartAtLocal
            ? formatDate(row.scheduledShiftStartAtLocal, 'DD.MM.YYYY HH:mm')
            : formatDate(row.clockInAtLocal, 'DD.MM.YYYY HH:mm')

        const staffTd = components.getTagTD();
        staffTd.textContent = row.fio;

        const typeViolationTd = components.getTagTD();
        let fade = components.getTagDiv('modal');
        fade.classList.add('fade');
        fade.setAttribute('id', row.id);
        fade.setAttribute('tabindex', '-1');
        fade.setAttribute('data-bs-backdrop', 'static');
        fade.setAttribute('data-bs-keyboard', 'false');
        let divDialog = components.getTagDiv('modal-dialog');
        let divContent = components.getTagDiv('modal-content');
        let divHeader = components.getTagDiv('modal-header');
        let titleH1 = components.getTagH(1, 'Подробная информация о нарушении дисциплины');
        titleH1.classList.add('modal-title');
        titleH1.classList.add('fs-5');
        let closeBtn = components.getTagButton_close();
        let modalBody = components.getTagDiv('modal-body');
        let clockInAtLocal = row.clockInAtLocal
            ? formatDate(row.clockInAtLocal, "DD.MM.YYYY, HH:mm")
            : 'Нет данных';

        let clockOutAtLocal = row.clockOutAtLocal
            ? formatDate(row.clockOutAtLocal, "DD.MM.YYYY, HH:mm")
            : 'Нет данных';

        modalBody.innerHTML = `
            <b>Общие данные</b><br>
            ФИО сотрудника: ${row.fio}<br>
            Описание: ${row.description}<br> <br>

            <b>Временные данные</b><br>
            Начало смены по графику: ${row.scheduledShiftStartAtLocal ? formatDate(row.scheduledShiftStartAtLocal, "DD.MM.YYYY, HH:mm") : 'нет данных'}<br>
            Начало смены - факт: ${clockInAtLocal}<br>
            Окончание смены по графику: ${row.scheduledShiftEndAtLocal ? formatDate(row.scheduledShiftEndAtLocal, "DD.MM.YYYY, HH:mm") : 'нет данных'} <br>
            Окончание смены - факт: ${clockOutAtLocal} <br>
        `;
        fade.append(divDialog);
        divDialog.append(divContent);
        divHeader.append(titleH1, closeBtn);
        divContent.append(divHeader, modalBody);
        let btnOrder = components.getTagButton(row.typeViolation);
        if (row.typeViolation === 'Прогул') {
            btnOrder.classList.add('btn-outline-danger');
        } else if (row.typeViolation === 'Продление') {
            btnOrder.textContent = row.description;
        } else if (row.typeViolation === 'Опоздание') {
            btnOrder.textContent = row.description;
            btnOrder.classList.add('btn-outline-warning');
        } else if (row.typeViolation === 'Раннее закрытие смены') {
            btnOrder.classList.add('btn-outline-success');
        }

        btnOrder.classList.add('btn-outline-secondary');
        btnOrder.classList.remove('btn-primary');
        btnOrder.setAttribute('data-bs-toggle', 'modal');
        btnOrder.setAttribute('data-bs-target', `#${row.id}`);
        if (row.shiftId !== null) {
            btnOrder.addEventListener('click', createOrderModalFullInfoButtonHandler(row.shiftId, modalBody));
        }
        typeViolationTd.append(btnOrder, fade)

        const commentTd = components.getTagTD();
        commentTd.textContent = row.commentStaff;

        const managerTd = components.getTagTD();
        const managerTextarea = components.getTagTextarea(row.managerDecision);
        managerTextarea.setAttribute('cols', '75');
        if (row.managerDecision === 'Просрочка') {
            managerTextarea.classList.add('bg-danger-subtle');
        }
        managerTd.append(managerTextarea);

        const directorTd = components.getTagTD();
        const directorTextarea = components.getTagTextarea(row.unitDirectorControl);
        directorTextarea.setAttribute('cols', '75');
        if (row.unitDirectorControl === 'Просрочка') {
            directorTextarea.classList.add('bg-danger-subtle');
        }
        directorTd.append(directorTextarea);

        let role = localStorage.getItem('role');

        if (role === 'менеджер смены') {
            directorTextarea.disabled = true;
        }

        const hoursTd = components.getTagTD();
        hoursTd.textContent = row.working_hours;

        const reasonTd = components.getTagTD();
        let reasonAbsenteeismCheckbox = components.getTagInput_checkbox(`discipline-reason_absenteeism-${row.id}`);
        reasonAbsenteeismCheckbox.classList.add('discipline-reason_absenteeism');
        reasonAbsenteeismCheckbox.checked = row.reason_absenteeism;
        reasonAbsenteeismCheckbox.disabled = isDisabledReasonAbsenteeism(row);
        reasonTd.append(reasonAbsenteeismCheckbox);

        const controlTd = components.getTagTD();
        const controlBtn = components.getTagButton('Сохранить');
        controlBtn.classList.add('discipline-control-btn-save');
        controlBtn.disabled = true
        controlTd.append(controlBtn);

        managerTextarea.addEventListener("input", (event) => {
            const value = event.target.value;
            controlBtn.disabled = value === row.managerDecision && directorTextarea.value === row.unitDirectorControl && reasonAbsenteeismCheckbox.checked === row.reason_absenteeism;
        })

        directorTextarea.addEventListener("input", (event) => {
            const value = event.target.value;
            controlBtn.disabled = value === row.unitDirectorControl && managerTextarea.value === row.managerDecision && reasonAbsenteeismCheckbox.checked === row.reason_absenteeism;
        })

        reasonAbsenteeismCheckbox.addEventListener("change", (event) => {
            const checked = event.target.checked;
            controlBtn.disabled = managerTextarea.value === row.managerDecision && directorTextarea.value === row.unitDirectorControl && checked === row.reason_absenteeism;
        })



        controlBtn.addEventListener("click", async () => {
            const request = {
                id: row.id,
                managerDecision: managerTextarea.value,
                unitDirectorControl: directorTextarea.value,
                reasonAbsenteeism: reasonAbsenteeismCheckbox.checked,
            }
            await postDataServer("discipline", request);
            controlBtn.disabled = true;
        })

        tr.append(timeTd, staffTd, typeViolationTd, commentTd, managerTd, directorTd, hoursTd, reasonTd, controlTd);
        tbody.append(tr);
    });

    timeUlDrop.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", async (event) => {
            searchParams.period = event.target.dataset.value;
            searchParams.managerDecision = "all";
            searchParams.directorDecision = "all";
            searchParams.page = 1;

            const spinner = document.getElementById("discipline-spinner");
            const tableContent = document.getElementById("discipline-table-content");

            tableContent.innerHTML = "";
            spinner.style.display = 'flex';

            const response = await getDiscipline(searchParams);

            await renderTable(searchParams, response)
            renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages })

            spinner.style.display = 'none';
        })
    })

    managerUlDrop.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", async (event) => {
            searchParams.managerDecision = event.target.dataset.value;
            searchParams.period = "all";
            searchParams.directorDecision = "all";
            searchParams.page = 1;

            const spinner = document.getElementById("discipline-spinner");
            const tableContent = document.getElementById("discipline-table-content");

            tableContent.innerHTML = "";
            spinner.style.display = 'flex';

            const response = await getDiscipline(searchParams);

            await renderTable(searchParams, response)
            renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages })

            spinner.style.display = 'none';
        })
    })

    directorUlDrop.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", async (event) => {
            searchParams.directorDecision = event.target.dataset.value;
            searchParams.period = "all";
            searchParams.managerDecision = "all";
            searchParams.page = 1;

            const spinner = document.getElementById("discipline-spinner");
            const tableContent = document.getElementById("discipline-table-content");

            tableContent.innerHTML = "";
            spinner.style.display = 'flex';

            const response = await getDiscipline(searchParams);

            await renderTable(searchParams, response)
            renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages })

            spinner.style.display = 'none';
        })
    })

    table.append(tbody);
    tableContent.append(table);
}
