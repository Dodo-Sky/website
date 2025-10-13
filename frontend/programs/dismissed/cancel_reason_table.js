import { renderPagination } from "../../common/pagination";
import * as components from "../../components";

import { getCancelReason, getCancelReasonInWorkCount, updateCancelReason } from "./api";

const role = localStorage.getItem('role');

const searchParams = {
    departmentName: localStorage.getItem('departmentName'),
    page: 1,
    size: 30,
}

const formatDate = (dateString, format) => {
    if (!dateString) return '—';
    return dayjs(dateString).format(format);
}

const generateTBody = (response) => {
    const tbody = components.getTagTBody();

    response.items.forEach((item) => {
        const tr = components.getTagTR();

        const cancelResolutionHR = components.getTagTD();
        const cancelResolutionHRSelect = components.getTagSelect()
        cancelResolutionHRSelect.disabled = role !== 'менеджер офиса'
        const cancelResolutionHRTrueOpt = components.getTagOption('Согласиться с решением управляющего', false)
        cancelResolutionHRTrueOpt.selected = item.cancel_resolution_hr === false
        const cancelResolutionHRFalseOpt = components.getTagOption('Отменить решение управляющего', true)
        cancelResolutionHRFalseOpt.selected = item.cancel_resolution_hr === true
        const cancelResolutionHRChoiceOpt = components.getTagOption('Выберите', null)
        cancelResolutionHRChoiceOpt.selected = item.cancel_resolution_hr === null
        cancelResolutionHRSelect.append(cancelResolutionHRChoiceOpt, cancelResolutionHRTrueOpt, cancelResolutionHRFalseOpt)
        cancelResolutionHR.append(cancelResolutionHRSelect)

        if (item.cancel_resolution_hr === true) {
            cancelResolutionHRSelect.classList.add('bg-danger-subtle')
        } else if (item.cancel_resolution_hr === false) {
            cancelResolutionHRSelect.classList.add('bg-success-subtle')
        } else if (item.cancel_resolution_hr === null) {
            cancelResolutionHRSelect.classList.add('bg-warning-subtle')
        }

        const saveBtnTd = components.getTagTD()
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        saveBtnTd.append(saveBtn);

        cancelResolutionHRSelect.addEventListener("change", (e) => {
            const value = e.target.value
            const cancelResolutionHRValue = item.cancel_resolution_hr === true
            const cancelResolutionHRValueIsNull = item.cancel_resolution_hr === null
            const currentValue = value === 'true'

            console.group("change")
            console.log("value", value);
            console.log("item.cancel_resolution_hr", item.cancel_resolution_hr);
            console.log("cancelResolutionHRValue", cancelResolutionHRValue);
            console.log("cancelResolutionHRValueIsNull", cancelResolutionHRValueIsNull);
            console.log("currentValue", currentValue);
            console.log("currentValue === cancelResolutionHRValue", currentValue === cancelResolutionHRValue);
            console.log("currentValue !== cancelResolutionHRValue", currentValue !== cancelResolutionHRValue);
            console.groupEnd()

            if (value === "null" && cancelResolutionHRValueIsNull) {
                saveBtn.disabled = true;
                return
            }

            saveBtn.disabled = currentValue === item.cancel_resolution_hr
        })

        saveBtn.addEventListener("click", async () => {
            const value = cancelResolutionHRSelect.value

            await updateCancelReason(item.id_contact, {
                cancel_resolution_hr: value === "null" ? null : value === "true",
            })

            saveBtn.disabled = true
        })

        tr.append(
            components.getTagTD(formatDate(item.dismissedOn, "DD.MM.YYYY")),
            components.getTagTD(`${item.lastName} ${item.firstName} ${item.patronymicName}`),
            components.getTagTD(item.unitName),
            components.getTagTD(item.positionName),
            components.getTagTD(item.result),
            cancelResolutionHR,
            saveBtnTd
        )
        tbody.append(tr);
    });

    return tbody
}

const generateTHead = async () => {
    const cancelReasonInWorkCount = await getCancelReasonInWorkCount(searchParams);

    const thead = components.getTagTHead('sticky-top');
    const theadRow = components.getTagTR();

    const thTimeCell = components.getTagTH("Дата увольнения");
    const fioCell = components.getTagTH("ФИО сотрудника");
    const unitCell = components.getTagTH("Пиццерия");
    const positionCell = components.getTagTH("Должность");
    const resultCell = components.getTagTH("Обоснование управляющим отказа звонить");

    const resolutionHRCell = components.getTagTH("");
    const resolutionHR = components.getTagSpan();
    resolutionHR.textContent = "Отмена решения";
    const resolutionHRWrap = components.getTagDiv("d-flex")
    resolutionHRWrap.append(resolutionHR)

    if (parseInt(cancelReasonInWorkCount.count) > 0) {
        const countWrap = components.getTagDiv("count");
        countWrap.style.position = 'relative';
        countWrap.style.width = '20px';
        const spanEl = components.getTagSpan_badge(cancelReasonInWorkCount.count);
        spanEl.classList.add('bg-success');
        spanEl.textContent = cancelReasonInWorkCount.count;
        countWrap.append(spanEl);
        resolutionHRWrap.append(countWrap);
    }
    resolutionHRCell.append(resolutionHRWrap)

    const controlCell = components.getTagTH("Управление");

    theadRow.append(
        thTimeCell,
        fioCell,
        unitCell,
        positionCell,
        resultCell,
        resolutionHRCell,
        controlCell
    );
    thead.append(theadRow);

    return thead;
}


const renderTable = async (response) => {
    const tableContent = document.querySelector('.dismissed-cancel-content');
    tableContent.innerHTML = '';

    const table = components.getTagTable();
    const caption = components.getTagCaption('Отмена решения HR службы о звонке уволенному сотруднику');
    table.classList.add('table-sm');
    table.append(caption);

    table.append(await generateTHead(), generateTBody(response));
    tableContent.append(table);
}

const onPageChange = async () => {
    const spinner = document.querySelector('#cancel-spinner');
    const tableContent = document.querySelector(".dismissed-cancel-content");
    const paginationContent = document.querySelector('#dismissed-cancel-pagination')

    spinner.style.display = 'flex';
    tableContent.style.display = 'none';
    paginationContent.style.display = 'none';

    const response = await getCancelReason(searchParams);

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-cancel-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = 'none';
    tableContent.style.display = 'block';
    paginationContent.style.display = 'block';
}

export const renderCancelReasonTable = async () => {
    const content = document.querySelector('#cancel-content');
    const spinner = document.querySelector('#cancel-spinner');
    const tableContent = components.getTagDiv("dismissed-cancel-content");
    const paginationContent = components.getTagDiv("flex-column", 'dismissed-cancel-pagination')

    spinner.style.display = "flex"

    content.innerHTML = ""

    content.append(tableContent, paginationContent)

    const response = await getCancelReason(searchParams)

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-cancel-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = "none"
}
