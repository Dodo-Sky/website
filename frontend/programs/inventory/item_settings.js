import { renderUnitSelector } from "../../common/updateUnitSelector";
import * as components from '../../components.js';
import { getInventoryItemSettings, getInventoryItemSettingsCommon, getUnits, updateInventoryItemSettings, updateInventoryItemSettingsCommon } from "./api";

const departmentName = localStorage.getItem('departmentName');
const searchParams = {
    unitId: '',
}

const generateTHead = () => {
    const thead = components.getTagTHead();
    const tr = components.getTagTR();
    
    const nameTh = components.getTagTH('Наименование');
    const notifyTh = components.getTagTH('Уведомляем о низких остатках?');
    const controlTh = components.getTagTH('Управление');

    tr.append(nameTh, notifyTh, controlTh);
    thead.append(tr);
    return thead;
}

const generateTBody = (response) => {
    const tBody = components.getTagTBody();
    response.forEach(item => {
        const tr = components.getTagTR();
        const nameTd = components.getTagTD(item.name);
        const notifyTd = components.getTagTD();
        const notifySelect = components.getTagSelect();
        const notifyTrueOpt = components.getTagOption('Да', true);
        const notifyFalseOpt = components.getTagOption('Нет', false);
        notifySelect.append(notifyTrueOpt, notifyFalseOpt);
        notifySelect.value = item.is_notify;
        notifyTd.append(notifySelect);

        notifySelect.addEventListener('change', (e) => {
            const value = e.target.value;
            const isNotify = value === 'true';

            const currentValue = item.is_notify;

            if (isNotify === currentValue) {
                saveBtn.disabled = true;
                saveBtn.classList.remove('unsaved_changes');
                return;
            }

            saveBtn.disabled = false;
            saveBtn.classList.add('unsaved_changes');
        });

        const controlTd = components.getTagTD();
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        saveBtn.addEventListener('click', async () => {
            if (searchParams.unitId === 'all') {
                const request = {
                    is_notify: notifySelect.value === 'true',
                    departmentName
                }

                await updateInventoryItemSettingsCommon(item.id_stock, request);
            } else {
                const request = {
                    is_notify: notifySelect.value === 'true',
                    unitId: searchParams.unitId
                }
    
                await updateInventoryItemSettings(item.id_stock, request);
            }

            saveBtn.disabled = true;
            saveBtn.classList.remove('unsaved_changes');
        });
        controlTd.append(saveBtn);

        tr.append(nameTd, notifyTd, controlTd);
        tBody.append(tr);
    });
    return tBody;
}

const renderTable = (response) => {
    const tableContent = document.querySelector('.inventory-item-settings-content');
    tableContent.innerHTML = '';

    const table = components.getTagTable();
    table.classList.add('table-sm');

    table.append(generateTHead(), generateTBody(response));
    tableContent.append(table);
}

const changeUnit = async (e) => {
    const value = e.target.value;
    const spinner = document.querySelector('#inventory-item-settings-spinner');
    const tableContent = components.getTagDiv("inventory-item-settings-content");

    spinner.style.display = 'flex';
    tableContent.style.display = 'none';

    searchParams.unitId = e.target.value;

    if (value === 'all') {
        const response = await getInventoryItemSettingsCommon({ departmentName });
        renderTable(response);
        spinner.style.display = 'none';
        tableContent.style.display = 'block';
        return;
    }

    const response = await getInventoryItemSettings(searchParams);
    renderTable(response);

    spinner.style.display = 'none';
    tableContent.style.display = 'block';
}

export const renderInventoryItemSettings = async () => {
    const content = document.querySelector('#inventory-item-settings-content');
    const spinner = document.querySelector('#inventory-item-settings-spinner');
    const unitSelector = document.querySelector('#inventory-item-unit-selector');
    const tableContent = components.getTagDiv("inventory-item-settings-content");

    spinner.style.display = "flex"

    content.innerHTML = ""
    unitSelector.innerHTML = ""

    content.append(tableContent)

    const units = await getUnits({ departmentName });
    searchParams.unitId = "all"; 

    renderUnitSelector({
        units: [{ id: 'all', name: 'Все' }, ...units],
        programName: "inventory-item",
        selectListener: async (e) => await changeUnit(e),
        withUpdate: false,
    });

    const response = await getInventoryItemSettingsCommon({ departmentName });
    renderTable(response);

    spinner.style.display = "none"
}