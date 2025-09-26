import { renderPagination } from "../../common/pagination";
import {renderUnitSelector} from "../../common/updateUnitSelector";
import * as components from "../../components";
import { postDataServer } from "../../apiServer";
import { getDiscipline } from "./api";
import { renderTable } from "./table";

const onPageChange = async (searchParams) => {
    const spinner = document.getElementById("discipline-spinner");
    const tableContent = document.getElementById("discipline-table-content");

    tableContent.innerHTML = "";
    spinner.style.display = 'flex';

    const response = await getDiscipline(searchParams);

    await renderTable(searchParams, response)
    renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages, onPageChange })

    spinner.style.display = 'none';
}

const changeUnitSelector = async (e, searchParams, tableContent, spinner) => {
    searchParams.unitId = e.target.value;
    searchParams.period = "all";
    searchParams.managerDecision = "all";
    searchParams.directorDecision = "all";
    searchParams.page = 1;

    tableContent.innerHTML = '';
    spinner.style.display = 'flex';

    const response = await getDiscipline(searchParams);

    await renderTable(searchParams, response);
    renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages, onPageChange });

    spinner.style.display = 'none';
};

const btnUpdateLister = async (searchParams, tableContent, spinner) => {
    tableContent.innerHTML = '';
    spinner.style.display = 'flex';

    const response = await getDiscipline(searchParams);

    await renderTable(searchParams, response);
    renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages, onPageChange });

    spinner.style.display = 'none';
};

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

    renderUnitSelector({
        units: filteredUnits,
        programName: "discipline",
        selectListener: async (e) => await changeUnitSelector(e, searchParams, tableContent, spinner),
        btnListener: async () => await btnUpdateLister(searchParams, tableContent, spinner),
    });

    const response = await getDiscipline(searchParams);

    await renderTable(searchParams, response);
    renderPagination({ paginationContentId: 'discipline-pagination', searchParams, totalPages: response.totalPages, onPageChange });

    spinner.style.display = 'none';
}
