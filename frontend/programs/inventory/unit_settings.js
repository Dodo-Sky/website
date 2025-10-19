import * as components from '../../components.js';
import { getInventoryUnitSettings, updateInventoryUnitSettings } from "./api";

const generateTBody = (response) => {
    const tBody = components.getTagTBody();

    response.forEach(item => {
        const tr = components.getTagTR();

        const unitNameTd = components.getTagTD(item.unitName);
        
        const startTimeTd = components.getTagTD();
        const startTimeInput = components.getTagInput("time", item.select_start_time);
        startTimeTd.append(startTimeInput);

        const endTimeTd = components.getTagTD();
        const endTimeInput = components.getTagInput("time", item.select_end_time);
        endTimeTd.append(endTimeInput);
        
        const stockTd = components.getTagTD();
        const stockInput = components.getTagInput("number", item.min_required_stock);
        stockTd.append(stockInput);
        
        const telegramGroupTd = components.getTagTD();
        const telegramGroupInput = components.getTagInput("text", item.id_telegramm_group ?? "");
        telegramGroupTd.append(telegramGroupInput);
        
        const controlTd = components.getTagTD();
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        controlTd.append(saveBtn);

        startTimeInput.addEventListener('change', (e) => {
            const value = e.target.value + ":00";
            const currentValue = item.select_start_time;
            const idTelegramGroupValue = item.id_telegramm_group ?? "";
            
            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue 
                && endTimeInput.value === item.select_end_time 
                && stockInput.value === item.min_required_stock 
                && telegramGroupInput.value === idTelegramGroupValue;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        endTimeInput.addEventListener('change', (e) => {
            const value = e.target.value + ":00";
            const currentValue = item.select_end_time;
            const idTelegramGroupValue = item.id_telegramm_group ?? "";
            
            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue 
                && startTimeInput.value === item.select_start_time 
                && stockInput.value === item.min_required_stock 
                && telegramGroupInput.value === idTelegramGroupValue;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        stockInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const currentValue = item.min_required_stock;
            const idTelegramGroupValue = item.id_telegramm_group ?? "";
            
            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue 
                && startTimeInput.value === item.select_start_time 
                && endTimeInput.value === item.select_end_time 
                && telegramGroupInput.value === idTelegramGroupValue;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        telegramGroupInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const currentValue = item.id_telegramm_group ?? "";

            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue 
                && startTimeInput.value === item.select_start_time 
                && endTimeInput.value === item.select_end_time 
                && stockInput.value === item.min_required_stock;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });
        
        saveBtn.addEventListener('click', async () => {
            const request = {
                select_start_time: startTimeInput.value,
                select_end_time: endTimeInput.value,
                min_required_stock: stockInput.value,
                id_telegramm_group: telegramGroupInput.value.length ? telegramGroupInput.value : null
            }

            await updateInventoryUnitSettings(item.unitId, request);

            saveBtn.disabled = true;
            saveBtn.classList.remove('unsaved_changes');
        });
        
        tr.append(unitNameTd, startTimeTd, endTimeTd, stockTd, telegramGroupTd, controlTd);
        tBody.append(tr);
    });

    return tBody;
}

const generateTHead = () => {
    const thead = components.getTagTHead();
    const tr = components.getTagTR();
    
    const unitNameTh = components.getTagTH('Пиццерия');
    const startTimeTh = components.getTagTH('Время начала работы', 'С этого времени бот начнет писать в соответвующие группы сообщения о низких остатках. Настройте время так чтобы отдел поставки успел с утра внести все накладные и актуальные данные по ревизиям', 'bottom');
    const endTimeTh = components.getTagTH('Время окончания работы', 'По истечении этого времени бот перестанет уведомлять о низких остатках сырья', 'bottom');
    const stockTh = components.getTagTH('Минимальный остаток сырья (% от среднедневной нормы расхода сырья)', 'Если ставите 50 то это означает 50% от среднего расхода в день. Например если в среднем сыра моцареллы тратится 40 кг, то 50% составит 20кг. и при уменьшении этого остатка будет уведомление. Если фактический остаток сырья менее минимального остатка то будет сформировано соответствующее сообщение. Учитывается повышенный расход сырья в выходные дни', 'bottom');
    const telegramGroupTh = components.getTagTH('ID телеграмм группы по сырью', 'Оставьте окно пустым и тогда не будет отправляться уведомление по данной пиццерии', 'bottom');
    const controlTh = components.getTagTH('Управление');

    tr.append(unitNameTh, startTimeTh, endTimeTh, stockTh, telegramGroupTh, controlTh);

    thead.append(tr);
    return thead;
}

const renderTable = (response) => {
    const tableContent = document.querySelector('#unit-settings-content');
    tableContent.innerHTML = '';

    const table = components.getTagTable();
    table.classList.add('table-sm');
    table.append(generateTHead(), generateTBody(response));
    tableContent.append(table);
}

export const renderInventoryUnitSettings = async () => {
    const content = document.querySelector('#unit-settings-content');
    const spinner = document.querySelector('#unit-settings-spinner');
    const tableContent = components.getTagDiv("unit-settings-content");

    spinner.style.display = "flex"

    content.innerHTML = ""

    content.append(tableContent)

    const departmentName = localStorage.getItem('departmentName');

    const response = await getInventoryUnitSettings({ departmentName });
    renderTable(response);

    spinner.style.display = "none"
}