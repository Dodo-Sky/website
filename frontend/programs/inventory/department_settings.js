import * as components from '../../components.js';
import { getInventoryDepartmentSettings, updateInventoryDepartmentSettings } from "./api";

const generateTBody = (response) => {
    const tBody = components.getTagTBody();

    response.forEach(item => {
        const tr = components.getTagTR();
        
        const nameTd = components.getTagTD(item.department_name);
        const telegramGroupTd = components.getTagTD();
        const telegramGroupInput = components.getTagInput("text", item.id_telegram_supply_department ?? "");
        telegramGroupTd.append(telegramGroupInput);

        const controlTd = components.getTagTD();
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        controlTd.append(saveBtn);

        telegramGroupInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const currentValue = item.id_telegram_supply_department ?? "";

            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        saveBtn.addEventListener('click', async () => {
            const request = {
                id_telegram_supply_department: telegramGroupInput.value
            }

            await updateInventoryDepartmentSettings(item.department_id, request);

            saveBtn.disabled = true;
            saveBtn.classList.remove('unsaved_changes');
        });

        tr.append(nameTd, telegramGroupTd, controlTd);
        tBody.append(tr);
    });

    return tBody;
}

const generateTHead = () => {
    const thead = components.getTagTHead();
    const tr = components.getTagTR();
    
    const departmentNameTh = components.getTagTH('Департамент');
    const telegramGroupTh = components.getTagTH('Телеграм отдела поставок');
    const controlTh = components.getTagTH('Управление');
    
    tr.append(departmentNameTh, telegramGroupTh, controlTh);
    thead.append(tr);
    return thead;
}

const renderTable = (response) => {
    const tableContent = document.querySelector('#department-settings-content');
    tableContent.innerHTML = '';
    const table = components.getTagTable();
    table.classList.add('table-sm');
    table.append(generateTHead(), generateTBody(response));
    tableContent.append(table);
}

export const renderInventoryDepartmentSettings = async () => {
    const content = document.querySelector('#department-settings-content');
    const spinner = document.querySelector('#department-settings-spinner');
    const tableContent = components.getTagDiv("department-settings-content");

    spinner.style.display = "flex"

    content.innerHTML = ""
    tableContent.innerHTML = ""

    const response = await getInventoryDepartmentSettings({ departmentName: localStorage.getItem('departmentName') });
    renderTable(response);

    spinner.style.display = "none"
}