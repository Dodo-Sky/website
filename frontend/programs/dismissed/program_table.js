import { getDataServer } from "../../apiServer";
import { renderPagination } from "../../common/pagination";
import { renderUnitSelector } from "../../common/updateUnitSelector";
import * as components from "../../components";
import {
    getStaffContacts,
    getStaffDismissed,
    getStaffDismissedDelayResult,
    getStaffDismissedInworkResult,
    getStaffDismissedPositions,
    getStaffDismissedSuccessReturns,
    updateStaffDismissed
} from "./api";

const role = localStorage.getItem('role');

const formatDate = (dateString, format) => {
    if (!dateString) return '—';
    return dayjs(dateString).format(format);
}

const searchParams = {
    unitId: '',
    dateOfCall: "all", // all | week | 3days | day
    position: "all", // all | Название должности
    result: "all", // all | inwork | delay
    page: 1,
    size: 30,
}

const changeUnit = async (e) => {
    const spinner = document.querySelector('#program-spinner');
    const tableContent = document.querySelector(".dismissed-program-content");
    const paginationContent = document.querySelector('#dismissed-program-pagination')

    spinner.style.display = 'flex';
    tableContent.style.display = 'none';
    paginationContent.style.display = 'none';

    searchParams.unitId = e.target.value;
    searchParams.dateOfCall = "all";
    searchParams.position = "all";
    searchParams.result = "all";
    searchParams.page = 1;
    searchParams.size = 30;

    const response = await getStaffDismissed(searchParams);

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-program-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = 'none';
    tableContent.style.display = 'block';
    paginationContent.style.display = 'block';
}

const onPageChange = async () => {
    const spinner = document.querySelector('#program-spinner');
    const tableContent = document.querySelector(".dismissed-program-content");
    const paginationContent = document.querySelector('#dismissed-program-pagination')

    spinner.style.display = 'flex';
    tableContent.style.display = 'none';
    paginationContent.style.display = 'none';

    const response = await getStaffDismissed(searchParams);

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-program-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = 'none';
    tableContent.style.display = 'block';
    paginationContent.style.display = 'block';
}

const generateTHead = async (response) => {
    const positions = await getStaffDismissedPositions(searchParams);
    const inworkResult = await getStaffDismissedInworkResult(searchParams);
    const successReturns = await getStaffDismissedSuccessReturns(searchParams);
    const delayResult = await getStaffDismissedDelayResult(searchParams);
    
    const thead = components.getTagTHead('sticky-top');
    const theadRow = components.getTagTR();

    const thTimeCell = components.getTagTH();
    thTimeCell.classList.add('dropend', 'time-defects');

    const timeBtnDropdown = components.getTagButton_dropdown();
    timeBtnDropdown.value = searchParams.dateOfCall;
    timeBtnDropdown.textContent = {
        all: 'Все время',
        day: 'За сутки',
        "3days": 'За 3 дня',
        week: 'За неделю'
    }[searchParams.dateOfCall];

    if (response.totalItems) {
        const span = components.getTagSpan();
        span.classList.add('badge', 'text-bg-secondary');
        span.textContent = response.totalItems;
        timeBtnDropdown.append(span);
    }
    timeBtnDropdown.classList.add('btn-time');

    const timeUlDropdown = components.getTagUL_dropdownMenu();
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
                const spinner = document.querySelector('#program-spinner');
                
                spinner.style.display = 'flex';

                searchParams.dateOfCall = val;
                searchParams.page = 1;
                searchParams.position = "all"
                searchParams.result = "all"

                const response = await getStaffDismissed(searchParams);

                await renderTable(response)
                renderPagination({ paginationContentId: "dismissed-program-pagination", searchParams, totalPages: response.totalPages, onPageChange })

                spinner.style.display = 'none';
            })

            timeUlDropdown.append(li);
        });

    thTimeCell.append(timeBtnDropdown, timeUlDropdown);

    const fioCell = components.getTagTH('ФИО сотрудника');
    const positionCell = components.getTagTH();
    positionCell.classList.add('dropend');
    const positionBtnDropdown = components.getTagButton_dropdown('Должность');
    const positionUlDropdown = components.getTagUL_dropdownMenu();
    ['Все'].concat(positions).forEach((p) => {
        const li = components.getTagLI_dropdownItem(p);
        li.value = p;

        li.addEventListener('click', async () => {
            const spinner = document.querySelector('#program-spinner');
            
            spinner.style.display = 'flex';

            searchParams.position = p === "Все" ? "all" : p;
            searchParams.page = 1;
            searchParams.dateOfCall = "all";
            searchParams.result = "all"

            const response = await getStaffDismissed(searchParams);

            await renderTable(response)
            renderPagination({ paginationContentId: "dismissed-program-pagination", searchParams, totalPages: response.totalPages, onPageChange })

            spinner.style.display = 'none';
        })

        positionUlDropdown.append(li);
    })
    positionCell.append(positionBtnDropdown, positionUlDropdown);

    const resultCell = components.getTagTH();
    resultCell.classList.add('dropend');
    const resultBtnDropdown = components.getTagButton_dropdown('Результат / причина отказа');
    const resultUlDropdown = components.getTagUL_dropdownMenu();
    [
        ['Показать все', 'all'],
        ['Только просроченные', 'delay'],
        ['В работе', 'inwork']
    ].forEach(([label, val]) => {
        const li = components.getTagLI_dropdownItem(label);
        li.value = val;

        li.addEventListener('click', async () => {
            const spinner = document.querySelector('#program-spinner');
            
            spinner.style.display = 'flex';

            searchParams.result = val
            searchParams.page = 1;
            searchParams.position = "all";
            searchParams.dateOfCall = "all";

            const response = await getStaffDismissed(searchParams);

            await renderTable(response)
            renderPagination({ paginationContentId: "dismissed-program-pagination", searchParams, totalPages: response.totalPages, onPageChange })

            spinner.style.display = 'none';
        })

        resultUlDropdown.append(li);
    })

    if (inworkResult.count) {
        const spanWork = components.getTagSpan();
        spanWork.classList.add('badge');
        spanWork.classList.add('text-bg-secondary');
        spanWork.textContent = inworkResult.count;
        resultBtnDropdown.append(spanWork);
    }
 
    if (delayResult.count > 0) {
        const resultBadge = components.getTagSpan_badge(delayResult.count);
        resultBtnDropdown.append(resultBadge);
    }

    resultCell.append(resultBtnDropdown, resultUlDropdown);

    const dateBackCell = components.getTagTH('')
    const dateBack = components.getTagSpan();
    dateBack.textContent = 'Дата возврата'
    const dateBackWrap = components.getTagDiv("d-flex")
    dateBackWrap.append(dateBack)

    if (parseInt(successReturns.success_returns) > 0) {
        const countWrap = components.getTagDiv("count");
        countWrap.style.position = 'relative';
        countWrap.style.width = '10px';
        const spanEl = components.getTagSpan_badge(successReturns.success_returns);
        spanEl.classList.remove('bg-danger');
        spanEl.classList.add('bg-success');
        spanEl.textContent = successReturns.success_returns;
        countWrap.append(spanEl);
        dateBackWrap.append(countWrap);
    }

    dateBackCell.append(dateBackWrap);

    theadRow.append(
        thTimeCell,
        fioCell,
        positionCell,
        components.getTagTH('№ звонка'),
        components.getTagTH('Решение о звонке'),
        resultCell,
        dateBackCell,
        components.getTagTH('Звоним дальше?'),
        components.getTagTH('Управление')
    );
    thead.append(theadRow);

    return thead;
}

const generateModal = (item) => {
    const fade = components.getTagDiv('modal');
    fade.classList.add('fade');
    fade.setAttribute('id', item.id_contact);
    fade.setAttribute('tabindex', '-1');
    fade.setAttribute('data-bs-backdrop', 'static');
    fade.setAttribute('data-bs-keyboard', 'false');

    const divDialog = components.getTagDiv('modal-dialog');
    const divContent = components.getTagDiv('modal-content');
    const divHeader = components.getTagDiv('modal-header');
    const titleH1 = components.getTagH(1, 'Подробная информация об уволенном сотруднике');
    titleH1.classList.add('modal-title');
    titleH1.classList.add('fs-5');
    const closeBtn = components.getTagButton_close();
    const modalBody = components.getTagDiv('modal-body');
    modalBody.innerHTML = '<div class="text-center py-3">Загрузка...</div>';

    fade.addEventListener('show.bs.modal', async () => {
        if (fade.dataset.loaded === 'true') return;
        try {
            const contact = await getStaffContacts(item.id);

            const modalContent = `
                <b>Контактные данные</b><br>
                ФИО сотрудника: ${item.lastName} ${item.firstName} ${item.patronymicName}<br>
                Телефон: ${contact.phoneNumber || '—'}<br><br>

                Дата приема на работу: ${contact.hiredOn ? formatDate(contact.hiredOn, 'DD.MM.YYYY') : '—'}<br>
                Дата увольнения: ${contact.dismissedOn ? formatDate(contact.dismissedOn, 'DD.MM.YYYY') : '—'}<br><br>

                Коментарии управляющего при увольнении: <br>
                ${contact.dismissalComment || '—'}<br><br>

                Причина увольнения: <br>
                ${contact.dismissalReason || '—'}<br><br>

                Результаты прошлых звонков: <br>
                ${Array.isArray(contact.results) && contact.results.length
                    ? contact.results.map((r) => `Дата: ${formatDate(r.date_of_call, 'DD.MM.YYYY')}<br>Результат: ${r.result || '—'}`).join('<br>')
                    : 'Еще не звонили'}<br><br>
            `;

            const commentHR = contact.commentHr ? `Выходное интервью HR: <br> ${contact.commentHr}<br><br>` : '';

            const letterForCourier = `
                <b>Пример письма уволенному сотруднику</b><br>
                ${item.firstName}, добрый день! 👋<br><br>
                Это управляющий Додо пиццы. Ранее, Вы отлично показали себя в Додо и мы были бы рады видеть Вас снова! 🚀<br><br>
                💵 Подняли ставку за км, чтобы Вы могли не переживать за расходы на ГСМ!<br>
                💰 Внедрили динамическую оплату — Ваш доход может быть выше!<br>
                ✨ Расширили реферальную программу — доступны локальные и федеральные бонусы!<br><br>
                Интересно? 🤔 Давайте обсудим детали. 💬<br>
            `;

            const letterForOther = `
                <b>Пример письма уволенному сотруднику</b><br>
                ${item.firstName}, добрый день! 👋<br><br>
                Мы помним Вас как одного из лучших сотрудников и будем рады видеть снова!<br><br>
                📢 За время Вашего отсутствия многое изменилось:<br>
                💵 Повысили ставку за час.<br>
                📖 Упростили стажировку.<br>
                💰 Добавили годовой бонус.<br>
                ✨ Расширили реферальную программу (локальные и федеральные бонусы).<br><br>
                Готовы вернуться? Обсудим все преимущества!<br>
            `;

            const letter = item.positionName.trim() === 'Авто, личное ТС' || item.positionName.trim() === 'Автомобильный' ? letterForCourier : letterForOther;
            modalBody.innerHTML = modalContent + commentHR + letter;
            fade.dataset.loaded = 'true';
        } catch (e) {
            modalBody.innerHTML = '<div class="text-danger">Не удалось загрузить данные</div>';
        }
    });

    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);

    return fade
}

const generateTBody = (response) => {
    const tbody = components.getTagTBody();
    
    response.items?.forEach((item) => {
        const tr = components.getTagTR();

        const countCallTd = components.getTagTD();
        const modal = generateModal(item);
        const btnCount = components.getTagButton(item.count_call);
        btnCount.setAttribute('data-bs-toggle', 'modal');
        btnCount.setAttribute('data-bs-target', `#${item.id_contact}`);
        btnCount.classList.add('position-relative');
        btnCount.classList.add('btn-outline-secondary');
        btnCount.classList.remove('btn-primary');
        countCallTd.append(btnCount, modal);
        const resolutionManager = components.getTagTD();
        const resolutionManagerSelect = components.getTagSelect()
        resolutionManagerSelect.disabled = role === 'Гость' || (item.cancel_resolution_hr === true && role !== 'менеджер офиса')
        const resolutionTrueOpt = components.getTagOption('Да', true)
        resolutionTrueOpt.selected = item.resolution_manager === null || item.resolution_manager === true
        const resolutionFalseOpt = components.getTagOption('Нет', false)
        resolutionFalseOpt.selected = item.resolution_manager === false
        resolutionManagerSelect.append(resolutionTrueOpt, resolutionFalseOpt)
        resolutionManager.append(resolutionManagerSelect)

        const result = components.getTagTD()
        const resultTextarea = components.getTagTextarea(item.result)
        if (item.cancel_resolution_hr) {
            resultTextarea.classList.add('bg-warning-subtle');
        }
        if (item.result === 'Просрочка') {
            resultTextarea.classList.add('bg-danger-subtle');
        }
        result.append(resultTextarea)

        const dateBack = components.getTagTD()
        const dateBackInput = components.getTagInput('date', item.date_back);
        dateBackInput.setAttribute('size', '20');
        if (item.date_back) {
            dateBackInput.classList.add('bg-success-subtle');
        }
        dateBack.append(dateBackInput)

        const furtherCall = components.getTagTD();
        const furtherCallSelect = components.getTagSelect()
        furtherCallSelect.disabled = role === 'Гость'
        const furtherCallTrueOpt = components.getTagOption('Да', true)
        furtherCallTrueOpt.selected = item.further_call === true
        const furtherCallFalseOpt = components.getTagOption('Нет', false)
        if (item.further_call === null || item.further_call === false) {
            furtherCallSelect.classList.add('bg-danger-subtle');
            furtherCallFalseOpt.selected = true
        }
        furtherCallSelect.append(furtherCallTrueOpt, furtherCallFalseOpt)
        furtherCall.append(furtherCallSelect)

        const saveBtnTd = components.getTagTD()
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        saveBtnTd.append(saveBtn);

        resolutionManagerSelect.addEventListener("change", (e) => {
            const resolutionManagerValue = item.resolution_manager === null || item.resolution_manager === true
            const currentValue = e.target.value === 'true'

            if (currentValue !== resolutionManagerValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add("unsaved_changes");
                return
            }

            const resultValue = item.result ? item.result : ""
            const dateBackValue = item.date_back ? item.date_back : ""
            const furtherCallValue = item.further_call === true
            const furtherCallSelectValue = furtherCallSelect.value === 'true'

            const isDisabled = resultTextarea.value === resultValue && dateBackInput.value === dateBackValue && furtherCallSelectValue === furtherCallValue
            saveBtn.disabled = isDisabled

            if (isDisabled) {
                saveBtn.classList.remove("unsaved_changes");
            } else {
                saveBtn.classList.add("unsaved_changes");
            }
        })

        resultTextarea.addEventListener("input", (e) => {
            const currentValue = e.target.value
            const resultValue = item.result ? item.result : ""

            if (currentValue !== resultValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add("unsaved_changes");
                return
            }
        
            const dateBackValue = item.date_back ? item.date_back : ""
            const resolutionManagerValue = item.resolution_manager === null || item.resolution_manager === true
            const resolutionManagerSelectValue = resolutionManagerSelect.value === 'true'
            const furtherCallValue = item.further_call === true
            const furtherCallSelectValue = furtherCallSelect.value === 'true'
       
            const isDisabled = dateBackInput.value === dateBackValue && furtherCallSelectValue === furtherCallValue && resolutionManagerSelectValue === resolutionManagerValue
            saveBtn.disabled = isDisabled

            if (isDisabled) {
                saveBtn.classList.remove("unsaved_changes");
            } else {
                saveBtn.classList.add("unsaved_changes");
            }
        })

        dateBackInput.addEventListener("input", (e) => {
            const currentValue = e.target.value
            const dateBackValue = item.date_back ? item.date_back : ""

            if (currentValue !== dateBackValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add("unsaved_changes");
                return
            }

            const resultValue = item.result ? item.result : ""
            const resolutionManagerValue = item.resolution_manager === null || item.resolution_manager === true
            const resolutionManagerSelectValue = resolutionManagerSelect.value === 'true'
            const furtherCallValue = item.further_call === true
            const furtherCallSelectValue = furtherCallSelect.value === 'true'
       
            const isDisabled = resultTextarea.value === resultValue && furtherCallSelectValue === furtherCallValue && resolutionManagerSelectValue === resolutionManagerValue
            saveBtn.disabled = isDisabled

            if (isDisabled) {
                saveBtn.classList.remove("unsaved_changes");
            } else {
                saveBtn.classList.add("unsaved_changes");
            }
        })

        furtherCallSelect.addEventListener("change", (e) => {
            const furtherCallValue = item.further_call === true
            const currentValue = e.target.value === 'true'

            if (currentValue !== furtherCallValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add("unsaved_changes");
                return
            }

            const resultValue = item.result ? item.result : ""
            const dateBackValue = item.date_back ? item.date_back : ""
            const resolutionManagerValue = item.resolution_manager === null || item.resolution_manager === true
            const resolutionManagerSelectValue = resolutionManagerSelect.value === 'true'

            const isDisabled = dateBackInput.value === dateBackValue && resultTextarea.value === resultValue && resolutionManagerSelectValue === resolutionManagerValue
            saveBtn.disabled = isDisabled

            if (isDisabled) {
                saveBtn.classList.remove("unsaved_changes");
            } else {
                saveBtn.classList.add("unsaved_changes");
            }
        })

        saveBtn.addEventListener("click", async () => {
            await updateStaffDismissed(item.id_contact, {
                resolution_manager: resolutionManagerSelect.value === "true",
                result: resultTextarea.value,
                date_back: dateBackInput.value.length ? dateBackInput.value : null,
                further_call: furtherCallSelect.value === "true",
                dismissed_id: item.dismissed_id
            })

            saveBtn.disabled = true
            saveBtn.classList.remove("unsaved_changes");
        })

        tr.append(
            components.getTagTD(formatDate(item.date_of_call, "DD.MM.YYYY")),
            components.getTagTD(`${item.lastName} ${item.firstName} ${item.patronymicName}`),
            components.getTagTD(item.positionName),
            countCallTd,
            resolutionManager,
            result,
            dateBack,
            furtherCall,
            saveBtnTd
        );

        tbody.append(tr);
    })

    return tbody;
}

const renderTable = async (response) => {
    const tableContent = document.querySelector('.dismissed-program-content');
    tableContent.innerHTML = '';

    const table = components.getTagTable();
    const caption = components.getTagCaption('Программа обзвона уволенных');
    table.classList.add('table-sm');
    table.append(caption);

    table.append(await generateTHead(response), generateTBody(response));
    tableContent.append(table);
}

export const renderProgramTable = async () => {
    const content = document.querySelector('#program-content');
    const spinner = document.querySelector('#program-spinner');
    const unitSelector = document.querySelector('#dismissed-unit-selector');
    const tableContent = components.getTagDiv("dismissed-program-content");
    const paginationContent = components.getTagDiv("flex-column", 'dismissed-program-pagination')

    spinner.style.display = "flex"

    content.innerHTML = ""
    unitSelector.innerHTML = ""

    content.append(tableContent, paginationContent)

    const departmentName = localStorage.getItem('departmentName');
    const units = await getDataServer(`staff-dismissed-units?departmentName=${departmentName}`);

    searchParams.unitId = units[0].id;

    renderUnitSelector({
        units,
        programName: "dismissed",
        selectListener: async (e) => await changeUnit(e),
        withUpdate: false
    });

    const response = await getStaffDismissed(searchParams);

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-program-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = "none"
}
