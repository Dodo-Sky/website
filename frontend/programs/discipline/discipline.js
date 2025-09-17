import * as components from "../../components";
import { postDataServer } from "../../apiServer";
import { getDiscipline } from "./api";
import { renderPagination } from "./pagination";
import { renderTable } from "./table";

const renderUnitSelector = (units) => {
    const unitSelector = document.getElementById("discipline-unit-selector");
    const unitsCol = components.getTagDiv('col-auto');
    const unitSelect = components.getTagSelect('discipline-unit-select');

    units.forEach((unit) => {
        const option = components.getTagOption(unit.name, unit.id);
        unitSelect.append(option);
    });

    unitsCol.append(unitSelect);
    unitSelector.append(unitsCol);

    const update = components.getTagDiv('col-auto');
    const btnUpdate = components.getTagButton('Обновить');
    btnUpdate.setAttribute('id', 'update');
    update.append(btnUpdate);
    unitSelector.append(update);

    return { unitSelect, btnUpdate }
}

export const render = async () => {
    const searchParams = {
        unitId: '',
        period: "all", // all | week | 3days | day
        managerDecision: "all", // all | inwork | delay
        directorDecision: "all", // all | inwork | delay
        page: 1,
        size: 30,
    }
    const departmentName = localStorage.getItem('departmentName');

    content.innerHTML = '';

    const title = components.getTagH(3, "Соблюдение дисциплины", ["text-center", "sticky-top"]);
    const spinner = components.getSpinner("discipline-spinner");
    const unitSelector = components.getTagDiv("row", "discipline-unit-selector");
    const tableContent = components.getTagDiv("flex-column", 'discipline-table-content')
    const paginationContent = components.getTagDiv("flex-column", 'discipline-pagination')
    content.append(title, unitSelector, spinner, tableContent, paginationContent)

    const units = await postDataServer('get_units', { payload: departmentName });
    const filteredUnits = units.filter(unit => unit.type === "Пиццерия" || unit.type === "ПРЦ");
    searchParams.unitId = filteredUnits[0].id;
    const { unitSelect, btnUpdate } = renderUnitSelector(filteredUnits);

    const response = await getDiscipline(searchParams);

    await renderTable(searchParams, response);
    renderPagination({ searchParams, totalPages: response.totalPages });

    spinner.style.display = 'none';

    unitSelect.addEventListener('change', async (e) => {
        searchParams.unitId = e.target.value;
        searchParams.period = "all";
        searchParams.managerDecision = "all";
        searchParams.directorDecision = "all";
        searchParams.page = 1;

        tableContent.innerHTML = '';
        spinner.style.display = 'flex';

        const response = await getDiscipline(searchParams);

        await renderTable(searchParams, response);
        renderPagination({ searchParams, totalPages: response.totalPages });

        spinner.style.display = 'none';
    });

    btnUpdate.addEventListener('click', async () => {
        tableContent.innerHTML = '';
        spinner.style.display = 'flex';

        const response = await getDiscipline(searchParams);

        await renderTable(searchParams, response);
        renderPagination({ searchParams, totalPages: response.totalPages });

        spinner.style.display = 'none';
    })
}
