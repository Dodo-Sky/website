import {postDataServer} from "../../apiServer.js";
import * as components from "../../components.js";

export const renderDiscipline = async (departmentName, from, to) => {
    const planning = await postDataServer('planning_discipline', { departmentName, from, to });
    const table = components.getTagTable();
    table.classList.add('table-sm');
    table.id = 'planning_discipline_table';

    const caption = components.getTagCaption(
        'Эффективность работы с графиками',
    );
    const thead = buildHeader();
    const tbody = buildBody(planning);

    table.append(caption, thead, tbody);
    return table;
};

const buildHeader = () => {
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    tr.append(
        components.getTagTH('Пиццерия'),
        components.getTagTH('Продление смен (час)'),
        components.getTagTH('Вне графика (час)'),
        components.getTagTH('Опоздания (час)'),
        components.getTagTH('Прогулы без уважительной причины'),
        components.getTagTH('Уважительные прогулы'),
        components.getTagTH('Баланс часов'),
    );

    thead.append(tr);
    return thead;
};

const pasteDiscipline = (discipline, tbody, data) => {
    const tr = components.getTagTR();

    const extensionRank = +discipline.extensionRank;
    const extension = components.getTagTD(discipline.extensionShifts);
    const delayRank = +discipline.delayRank;
    const delays = components.getTagTD(discipline.late);

    if (discipline.unitName !== 'ИТОГО') {
        if (extensionRank === data.worstExtensionRank) {
            extension.classList.add('bg-danger-subtle');
        } else if (data.preWorstExtensionRank && extensionRank === data.preWorstExtensionRank) {
            extension.classList.add('bg-warning-subtle');
        } else if (data.bestExtensionRanks.includes(extensionRank)) {
            extension.classList.add('bg-success-subtle');
        }

        if (delayRank === data.worstDelayRank) {
            delays.classList.add('bg-danger-subtle');
        } else if (data.preWorstDelayRank && delayRank === data.preWorstDelayRank) {
            delays.classList.add('bg-warning-subtle');
        } else if (data.bestDelayRanks.includes(delayRank)) {
            delays.classList.add('bg-success-subtle');
        }
    }

    tr.append(
        components.getTagTD(discipline.unitName),
        extension,
        components.getTagTD(discipline.outsideSchedule),
        delays,
        components.getTagTD(discipline.badAbsenteeism),
        components.getTagTD(discipline.goodAbsenteeism),
        components.getTagTD(discipline.balanceHours),
    );

    if (discipline.unitName === "ИТОГО") {
        tr.classList.add('fw-bold')
    }

    tbody.append(tr);
}

const buildBody = (arrayData) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    const disciplines = []
    let total = null

    arrayData.forEach(d => {
        if (d.unitName === 'ИТОГО') {
            total = d
        } else {
            disciplines.push(d)
        }
    })

    const topCount = disciplines.length >= 4 ? 2 : 1;

    const allExtensionRanks = [...new Set(disciplines.map(o => +o.extensionRank))].sort((a, b) => a - b);
    const allDelayRanks = [...new Set(disciplines.map(o => +o.delayRank))].sort((a, b) => a - b);

    const data = {
        worstExtensionRank: allExtensionRanks[0],
        preWorstExtensionRank: disciplines.length >= 4 ? allExtensionRanks[1] : null,
        bestExtensionRanks: allExtensionRanks.slice(-topCount),
        worstDelayRank: allDelayRanks[0],
        preWorstDelayRank: disciplines.length >= 4 ? allDelayRanks[1] : null,
        bestDelayRanks: allDelayRanks.slice(-topCount)
    }

    disciplines.forEach((order) => pasteDiscipline(order, tbody, data));

    if (total) {
        pasteDiscipline(total, tbody, data);
    }

    return tbody;
};
