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
    const notifyTh = components.getTagTH('Уведомляем пиццерии?');
    const notifyPRZTh = components.getTagTH('Уведомляем ПРЦ?');
    const controlTh = components.getTagTH('Управление');

    tr.append(nameTh, notifyTh, notifyPRZTh, controlTh);
    thead.append(tr);
    return thead;
}

const generateTBody = (response) => {
    const tBody = components.getTagTBody();
    response.forEach(item => {
        const tr = components.getTagTR();
        const nameTd = components.getTagTD(item.name);

        const notifyTd = components.getTagTD();
        const notifyWrap = document.createElement('div')
        notifyWrap.classList.add("d-flex", "align-items-center")
        const notifySelect = components.getTagSelect();
        const notifyTrueOpt = components.getTagOption('Да', true);
        const notifyFalseOpt = components.getTagOption('Нет', false);
        notifySelect.append(notifyTrueOpt, notifyFalseOpt);
        notifySelect.value = item.is_notify === true;
        notifyWrap.append(notifySelect);

        if (item.is_notify !== true) {
            notifySelect.classList.add('bg-danger-subtle')
        }

        if (item.items && item.items.length) {
            const span = document.createElement('span')
            span.classList.add('d-inline-block', 'm-2')
            span.textContent = '⚠️'
            notifyTd.tabIndex = 0
            notifyTd.setAttribute('data-bs-toggle', 'popover')
            notifyTd.setAttribute('data-bs-trigger', 'hover focus')
            notifyTd.setAttribute('data-bs-content', item.items.map((el) => `${el.unitName} - ${el.is_notify ? "Да" : "Нет"};`).join("\n"))
            notifyWrap.append(span)
            new bootstrap.Popover(notifyTd)
        }

        notifyTd.append(notifyWrap);

        const notifyPRZTd = components.getTagTD();
        const notifyPRZWrap = document.createElement('div')
        notifyPRZWrap.classList.add("d-flex", "align-items-center")
        const notifyPRZSelect = components.getTagSelect();
        const notifyPRZTrueOpt = components.getTagOption('Да', true);
        const notifyPRZFalseOpt = components.getTagOption('Нет', false);
        notifyPRZSelect.append(notifyPRZTrueOpt, notifyPRZFalseOpt);
        notifyPRZSelect.value = item.is_notify_prz === true;
        notifyPRZWrap.append(notifyPRZSelect);

        if (item.is_notify_prz !== true) {
            notifyPRZSelect.classList.add('bg-danger-subtle')
        }

        if (item.itemsPrz && item.itemsPrz.length) {
            const span = document.createElement('span')
            span.classList.add('d-inline-block', 'm-2')
            span.textContent = '⚠️'
            notifyPRZTd.tabIndex = 0
            notifyPRZTd.setAttribute('data-bs-toggle', 'popover')
            notifyPRZTd.setAttribute('data-bs-trigger', 'hover focus')
            notifyPRZTd.setAttribute('data-bs-content', item.itemsPrz.map((el) => `${el.unitName} - ${el.is_notify_prz ? "Да" : "Нет"};`).join("\n"))
            notifyPRZWrap.append(span)
            new bootstrap.Popover(notifyPRZTd)
        }

        notifyPRZTd.append(notifyPRZWrap);

        notifySelect.addEventListener('change', (e) => {
            const value = e.target.value;
            const isNotify = value === 'true';
            const currentValue = item.is_notify;

            if (isNotify !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const przValue = item.is_notify_prz === true;
            const przSelectValue = notifyPRZSelect.value === "true"
            const isDisabled = isNotify === currentValue && przValue === przSelectValue;
            saveBtn.disabled = isDisabled;

            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        notifyPRZSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            const isNotifyPRZ = value === 'true';
            const currentValue = item.is_notify_prz;

            if (isNotifyPRZ !== currentValue) {
                saveBtn.disabled = false;
                saveBtn.classList.add('unsaved_changes');
                return;
            }

            const notifyValue = item.is_notify === true
            const notifySelectValue = notifySelect.value === "true"
            const isDisabled = isNotifyPRZ === currentValue && notifyValue === notifySelectValue
            saveBtn.disabled = isDisabled;
            
            if (isDisabled) {
                saveBtn.classList.remove('unsaved_changes');
            } else {
                saveBtn.classList.add('unsaved_changes');
            }
        });

        const controlTd = components.getTagTD();
        const saveBtn = components.getTagButton('Сохранить');
        saveBtn.classList.add('arrayData-btn-save');
        saveBtn.disabled = true;
        saveBtn.addEventListener('click', async () => {
            if (searchParams.unitId === 'all') {
                const request = {
                    is_notify: notifySelect.value === 'true',
                    is_notify_prz: notifyPRZSelect.value === 'true',
                    departmentName
                }

                await updateInventoryItemSettingsCommon(item.id_stock, request);
            } else {
                const request = {
                    is_notify: notifySelect.value === 'true',
                    is_notify_prz: notifyPRZSelect.value === 'true',
                    unitId: searchParams.unitId
                }
    
                await updateInventoryItemSettings(item.id_stock, request);
            }

            saveBtn.disabled = true;
            saveBtn.classList.remove('unsaved_changes');
        });
        controlTd.append(saveBtn);

        tr.append(nameTd, notifyTd, notifyPRZTd, controlTd);
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

        console.log("response", response);

        renderTable(convertAllSettings(response));
        spinner.style.display = 'none';
        tableContent.style.display = 'block';
        return;
    }

    const response = await getInventoryItemSettings(searchParams);
    renderTable(response);

    spinner.style.display = 'none';
    tableContent.style.display = 'block';
}

const convertAllSettings = (response) => {
    const result = []
    const groupedByStockName = {}

    response.forEach(item => {
        if (!groupedByStockName[item.name]) {
            groupedByStockName[item.name] = { id_stock: item.id_stock, items: [item] }
        } else {
            groupedByStockName[item.name].items.push(item)
        }
    })

    Object.entries(groupedByStockName).forEach(([name, { id_stock, items }]) => {
        const isAllNotify = items.every(item => item.is_notify);
        const isAllNotNotify = items.every(item => !item.is_notify);
        const isAllNotifyPRZ = items.every(item => item.is_notify_prz);
        const isAllNotNotifyPRZ = items.every(item => !item.is_notify_prz);

        result.push({
            name,
            id_stock,
            is_notify: isAllNotify,
            is_notify_prz: isAllNotifyPRZ,
            items: isAllNotify || isAllNotNotify ? [] : items,
            itemsPrz: isAllNotifyPRZ || isAllNotNotifyPRZ ? [] : items,
        })
    })

    console.log("result", result);

    return result;
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
    console.log("response", response);
    renderTable(convertAllSettings(response));

    spinner.style.display = "none"
}