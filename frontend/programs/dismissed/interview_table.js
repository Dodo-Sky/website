import { renderPagination } from "../../common/pagination";
import * as components from "../../components";

import { getDelayCommentHrCount, getInterview, updateInterview } from "./api";

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
        
        const resolutionHR = components.getTagTD();
        const resolutionHRSelect = components.getTagSelect()
        resolutionHRSelect.disabled = role !== 'менеджер офиса'
        const resolutionHRTrueOpt = components.getTagOption('Да', true)
        resolutionHRTrueOpt.selected = item.resolutionHR === null || item.resolutionHR === true
        const resolutionHRFalseOpt = components.getTagOption('Нет', false)
        resolutionHRFalseOpt.selected =  item.resolutionHR === false
        resolutionHRSelect.append(resolutionHRTrueOpt, resolutionHRFalseOpt)
        resolutionHR.append(resolutionHRSelect)

        const commentHr = components.getTagTD()
        const commentHrTextarea = components.getTagTextarea(item.commentHr)
        commentHrTextarea.disabled = role !== 'менеджер офиса'
        commentHrTextarea.style.width = '300px'
        commentHr.append(commentHrTextarea)

        const saveBtnTd = components.getTagTD()
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        saveBtnTd.append(saveBtn);

        resolutionHRSelect.addEventListener("change", (e) => {
            const resolutionHRValue = item.resolutionHR === null || item.resolutionHR === true
            const currentValue = e.target.value === 'true'

            if (currentValue !== resolutionHRValue) {
                saveBtn.disabled = false;
                return
            }

            const commentHrValue = item.commentHr ? item.commentHr : ""

            saveBtn.disabled = commentHrTextarea.value === commentHrValue
        })

        commentHrTextarea.addEventListener("input", (e) => {
            const currentValue = e.target.value
            const commentHrValue = item.commentHr ? item.commentHr : ""

            if (currentValue !== commentHrValue) {
                saveBtn.disabled = false;
                return
            }
        
            const resolutionHRValue = item.resolutionHR === null || item.resolutionHR === true
            const resolutionHRSelectValue = resolutionHRSelect.value === 'true'
       
            saveBtn.disabled = resolutionHRSelectValue === resolutionHRValue
        })

        saveBtn.addEventListener("click", async () => {
            await updateInterview(item.dismissed_id, {
                resolutionHR: resolutionHRSelect.value === "true",
                commentHr: commentHrTextarea.value,
            })

            saveBtn.disabled = true
        })

        tr.append(
            components.getTagTD(formatDate(item.dismissedOn, "DD.MM.YYYY")),
            components.getTagTD(`${item.lastName} ${item.firstName} ${item.patronymicName}`),
            components.getTagTD(item.unitName),
            components.getTagTD(item.positionName),
            components.getTagTD(item.dismissalComment),
            components.getTagTD(item.dismissalReason),
            resolutionHR,
            commentHr,
            saveBtnTd
        )
        tbody.append(tr);
    });

    return tbody
}

const generateTHead = async () => {
    const delayCommentHrCount = await getDelayCommentHrCount(searchParams);

    const thead = components.getTagTHead('sticky-top');
    const theadRow = components.getTagTR();

    const thTimeCell = components.getTagTH("Дата увольнения");
    const fioCell = components.getTagTH("ФИО сотрудника");
    const unitCell = components.getTagTH("Пиццерия");
    const positionCell = components.getTagTH("Должность");
    const dismissalCommentCell = components.getTagTH("Коментарий управляющего");
    const dismissalReasonCell = components.getTagTH("Причина увольнения");
    const resolutionHRCell = components.getTagTH("Решение HR");
    
    const commentHrCell = components.getTagTH("");
    const commentHr = components.getTagSpan();
    commentHr.textContent = "Выходное интервью";
    const commentHrWrap = components.getTagDiv("d-flex")
    commentHrWrap.append(commentHr)

    if (parseInt(delayCommentHrCount.count) > 0) {
        const countWrap = components.getTagDiv("count");
        countWrap.style.position = 'relative';
        countWrap.style.width = '10px';
        const spanEl = components.getTagSpan_badge(delayCommentHrCount.count);
        spanEl.classList.add('bg-success');
        spanEl.textContent = delayCommentHrCount.count;
        countWrap.append(spanEl);
        commentHrWrap.append(countWrap);
    }

    commentHrCell.append(commentHrWrap)

    const controlCell = components.getTagTH("Управление");

    theadRow.append(
        thTimeCell,
        fioCell,
        unitCell,
        positionCell,
        dismissalCommentCell,
        dismissalReasonCell,
        resolutionHRCell,
        commentHrCell,
        controlCell
    );
    thead.append(theadRow);

    return thead;
}

const renderTable = async (response) => {
    const tableContent = document.querySelector('.dismissed-interview-content');
    tableContent.innerHTML = '';

    const table = components.getTagTable();
    const caption = components.getTagCaption('Выходное интервью уволенных сотрудников');
    table.classList.add('table-sm');
    table.append(caption);

    table.append(await generateTHead(), generateTBody(response));
    tableContent.append(table);
}

const onPageChange = async () => {
    const spinner = document.querySelector('#interview-spinner');
    const tableContent = document.querySelector(".dismissed-interview-content");
    const paginationContent = document.querySelector('#dismissed-interview-pagination')

    spinner.style.display = 'flex';
    tableContent.style.display = 'none';
    paginationContent.style.display = 'none';

    const response = await getInterview(searchParams);

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-interview-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = 'none';
    tableContent.style.display = 'block';
    paginationContent.style.display = 'block';
}

export const renderInterviewTable = async () => {
    const content = document.querySelector('#interview-content');
    const spinner = document.querySelector('#interview-spinner');
    const tableContent = components.getTagDiv("dismissed-interview-content");
    const paginationContent = components.getTagDiv("flex-column", 'dismissed-interview-pagination')

    spinner.style.display = "flex"

    content.innerHTML = ""

    content.append(tableContent, paginationContent)

    const response = await getInterview(searchParams)

    await renderTable(response)
    renderPagination({ paginationContentId: "dismissed-interview-pagination", searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = "none"
}
