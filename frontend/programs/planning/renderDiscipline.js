import {postDataServer} from "../../apiServer.js";
import * as components from "../../components.js";

export const renderDiscipline = async (departmentName) => {
    const planning = await postDataServer('planning', { payload: departmentName });
    const table = components.getTagTable();
    table.classList.add('table-sm');

    const caption = components.getTagCaption(
        'Эффективность работы с графиками за последние 7 дней',
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
        components.getTagTH('Всего (отрицательные)'),
        components.getTagTH('Всего (положительные)'),
        components.getTagTH('Сумма часов'),
    );

    thead.append(tr);
    return thead;
};

const buildBody = (arrayData) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    const topCount = arrayData.length >= 4 ? 2 : 1;

    const allExtensionRanks = [...new Set(arrayData.map(o => +o['Ранг продления']))].sort((a, b) => a - b);
    const allDelayRanks = [...new Set(arrayData.map(o => +o['Ранг по опозданиям']))].sort((a, b) => a - b);

    const worstExtensionRank = allExtensionRanks[0];
    const preWorstExtensionRank = arrayData.length >= 4 ? allExtensionRanks[1] : null;
    const bestExtensionRanks = allExtensionRanks.slice(-topCount);

    const worstDelayRank = allDelayRanks[0];
    const preWorstDelayRank = arrayData.length >= 4 ? allDelayRanks[1] : null;
    const bestDelayRanks = allDelayRanks.slice(-topCount);

    arrayData.forEach((order) => {
        const tr = components.getTagTR();

        const extensionRank = +order['Ранг продления'];
        const extension = components.getTagTD(order['Продление смен (час)']);

        if (extensionRank === worstExtensionRank) {
            extension.classList.add('bg-danger-subtle');
        } else if (preWorstExtensionRank && extensionRank === preWorstExtensionRank) {
            extension.classList.add('bg-warning-subtle');
        } else if (bestExtensionRanks.includes(extensionRank)) {
            extension.classList.add('bg-success-subtle');
        }

        const delayRank = +order['Ранг по опозданиям'];
        const delays = components.getTagTD(order['Опоздания (час)']);

        if (delayRank === worstDelayRank) {
            delays.classList.add('bg-danger-subtle');
        } else if (preWorstDelayRank && delayRank === preWorstDelayRank) {
            delays.classList.add('bg-warning-subtle');
        } else if (bestDelayRanks.includes(delayRank)) {
            delays.classList.add('bg-success-subtle');
        }

        tr.append(
            components.getTagTD(order.name),
            extension,
            components.getTagTD(order['Вне графика (час)']),
            delays,
            components.getTagTD(order['Всего (отрицательные)']),
            components.getTagTD(order['Всего (положительные)']),
            components.getTagTD(order['Сумма часов']),
        );

        tbody.append(tr);
    });

    return tbody;
};
