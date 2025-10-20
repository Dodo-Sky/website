import * as components from "../components";

export const renderUnitSelector = ({ units, programName, selectListener, btnListener, withUpdate = true }) => {
    const unitSelector = document.getElementById(`${programName}-unit-selector`);
    const unitsCol = components.getTagDiv('col-auto');
    const unitSelect = components.getTagSelect(`${programName}-unit-select`);

    units.forEach((unit) => {
        const option = components.getTagOption(unit.name, unit.id);
        unitSelect.append(option);
    }); 

    unitsCol.append(unitSelect);
    unitSelector.append(unitsCol);

    const btnUpdate = components.getTagButton('Обновить');
   
    if (withUpdate) {
        const update = components.getTagDiv('col-auto');
        btnUpdate.setAttribute('id', `${programName}-update`);
        update.append(btnUpdate);
        unitSelector.append(update);
    }

    unitSelect.addEventListener('change', selectListener);
    btnUpdate.addEventListener('click', btnListener)

    return { unitSelect, btnUpdate }
}
