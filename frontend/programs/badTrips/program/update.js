import { postDataServer } from "../../../apiServer.js";
import { renderProgram } from "./index.js";
import { checkUnsavedChanges } from "./checkUnsavedChanges.js";

export const updateProgram = async () => {
    const time_defects = document.querySelector('.time-defects');
    const selectedBTN = time_defects.querySelector('button');
    const selectUnit = document.querySelector('.selectUnit');
    const tBody = document.querySelector('.tBody');
    const departmentName = localStorage.getItem('departmentName');

    tBody.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;

    const defectsUpdate = await postDataServer ('query_couriersOrder', {departmentName: departmentName});
    let spinner = document.querySelector('.spinner-border');
    spinner.style.display = 'none';

    const manager = document.querySelector('.manager-defects');
    const unitDirector = document.querySelector('.unitDirector-defects');
    const fullDataUnit = defectsUpdate.filter((el) => el.unitName === selectUnit.value);
    let filterData;

    if (manager.dataset.condition === 'Только просроченные') {
        filterData = fullDataUnit.filter((el) => el.graphistComment === 'Просрочка');
        await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
        return;
    }

    if (manager.dataset.condition === 'В работе') {
        filterData = fullDataUnit.filter((el) => !el.graphistComment);
        await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
        return;
    }

    if (unitDirector.dataset.condition === 'Только просроченные') {
        filterData = fullDataUnit.filter((el) => el.directorComment === 'Просрочка');
        await checkUnsavedChanges(() => renderProgram(filterData, 0, fullDataUnit));
        return;
    }

    if (unitDirector.dataset.condition === 'В работе') {
        filterData = fullDataUnit.filter((el) => !el.directorComment);
        await checkUnsavedChanges(filterData, 0, fullDataUnit);
        return;
    }

    if (selectedBTN.value === '0') {
        await checkUnsavedChanges(() => renderProgram(fullDataUnit, selectedBTN.value, fullDataUnit));
        return;
    }

    filterData = fullDataUnit.filter((el) => {
        let now = new Date();
        now.setHours(now.getHours());
        return new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - selectedBTN.value));
    });

    await checkUnsavedChanges(() => renderProgram(filterData, selectedBTN.value, fullDataUnit));
}
