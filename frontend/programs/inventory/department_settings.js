import * as components from '../../components.js';
import { getInventoryDepartmentSettings, testSupplyBot, updateInventoryDepartmentSettings } from "./api";

const generateTBody = (response) => {
    const tBody = components.getTagTBody();

    response.forEach(item => {
        const tr = components.getTagTR();
        
        const nameTd = components.getTagTD(item.department_name);

        const telegramGroupTd = components.getTagTD();
        const telegramGroupInput = components.getTagInput("text", item.id_telegram_supply_department ?? "");
        telegramGroupTd.append(telegramGroupInput);

        const testMessageGroupTd = components.getTagTD();
        const btnTestGroup = components.getTagButton('supply_bot');
        btnTestGroup.classList = 'btn btn-outline-primary btnHR me-2';
        if (!item.id_telegram_supply_department) btnTestGroup.disabled = true;

        btnTestGroup.addEventListener('click', async () => {
            const result = await testSupplyBot({ chatId: item.id_telegram_supply_department.replace(/\D/g, ''), content: 'Все отлично проверка связи прошла успешно' })
            if (result) {
                alert('Сообщение отправлено боту. Проверьте его наличие в телеграмм');
            }
        })
        testMessageGroupTd.append(btnTestGroup);

        const telegramPRZGroupTd = components.getTagTD();
        const telegramPRZGroupInput = components.getTagInput("text", item.id_telegramm_prz ?? "");
        telegramPRZGroupTd.append(telegramPRZGroupInput);

        const testMessagePRZTd = components.getTagTD();
        const btnTestPRZ = components.getTagButton('supply_bot');
        btnTestPRZ.classList = 'btn btn-outline-primary btnHR me-2';
        if (!item.id_telegramm_prz) btnTestPRZ.disabled = true;

        btnTestPRZ.addEventListener('click', async () => {
            const result = await testSupplyBot({ chatId: item.id_telegramm_prz.replace(/\D/g, ''), content: 'Все отлично проверка связи прошла успешно' })
            if (result) {
                alert('Сообщение отправлено боту. Проверьте его наличие в телеграмм');
            }
        })
        testMessagePRZTd.append(btnTestPRZ);

        const controlTd = components.getTagTD();
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        controlTd.append(saveBtn);

        telegramPRZGroupInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const currentValue = item.id_telegramm_prz ?? "";

            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue 
                && telegramGroupInput.value === item.id_telegram_supply_department;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        telegramGroupInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const currentValue = item.id_telegram_supply_department ?? "";

            if (value !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const isDisabled = value === currentValue 
                && telegramPRZGroupInput.value === item.id_telegramm_prz;

            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        saveBtn.addEventListener('click', async () => {
            const request = {
                id_telegram_supply_department: telegramGroupInput.value.length ? `-${telegramGroupInput.value.replace(/\D/g, '')}` : null,
                id_telegramm_prz: telegramPRZGroupInput.value.length ? `-${telegramPRZGroupInput.value.replace(/\D/g, '')}` : null
            }

            await updateInventoryDepartmentSettings(item.department_id, request);

            saveBtn.disabled = true;
            saveBtn.classList.remove('unsaved_changes');

            await renderInventoryDepartmentSettings()
        });

        tr.append(nameTd, telegramGroupTd, testMessageGroupTd, telegramPRZGroupTd, testMessagePRZTd, controlTd);
        tBody.append(tr);
    });

    return tBody;
}

const generateTHead = () => {
    const thead = components.getTagTHead();
    const tr = components.getTagTR();
    
    const departmentNameTh = components.getTagTH('Департамент');
    const telegramGroupTh = components.getTagTH('Телеграм отдела поставок');
    const testMessageGroupTh = components.getTagTH('Проверка связи');
    const telegramPRZGroupTh = components.getTagTH('id телеграмм ПРЦ');
    const testMessagePRZTh = components.getTagTH('Проверка связи');
    const controlTh = components.getTagTH('Управление');
    
    tr.append(departmentNameTh, telegramGroupTh, testMessageGroupTh, telegramPRZGroupTh, testMessagePRZTh, controlTh);
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
    tableContent.style.display = "none"

    content.innerHTML = ""
    tableContent.innerHTML = ""

    const response = await getInventoryDepartmentSettings({ departmentName: localStorage.getItem('departmentName') });
    renderTable(response);

    spinner.style.display = "none"
    tableContent.style.display = "flex"
}