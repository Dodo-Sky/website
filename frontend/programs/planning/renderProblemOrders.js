import {postDataServer} from "../../apiServer";
import * as components from "../../components";

export const renderProblemOrders = async (departmentName) => {
    const planning = await postDataServer('planning_orders', { payload: departmentName });
    const table = components.getTagTable();
    table.classList.add('table-sm');

    const caption = components.getTagCaption(
        'Эффективность работы с проблемными поездками за последние 7 дней',
    );
    const thead = buildHeader();
    const tbody = buildBody(planning);

    table.append(caption, thead, tbody);
    return table;
}

const buildHeader = () => {
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    tr.append(
        components.getTagTH('Пиццерия'),
        components.getTagTH('Поездки без отметки курьера'),
        components.getTagTH('Поездки с отметкой курьера "Проблема"'),
        components.getTagTH('Всего проблемных поездок'),
        components.getTagTH('Средний рейтинг курьера'),
    );

    thead.append(tr);
    return thead;
};

const buildBody = (arrayData) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    const topCount = arrayData.length >= 4 ? 2 : 1;

    const allNoProblemRanks = [...new Set(arrayData.map(o => +o.ranc))].sort((a, b) => a - b);
    const allAvgRanks = [...new Set(arrayData.map(o => +o.ranc_avg_raiting))].sort((a, b) => b - a);

    const worstNoProblemRank = allNoProblemRanks[0];
    const preWorstNoProblemRank = arrayData.length >= 4 ? allNoProblemRanks[1] : null;
    const bestNoProblemRanks = allNoProblemRanks.slice(-topCount);

    const worstAvgRank = allAvgRanks[0];
    const preWorstAvgRank = arrayData.length >= 4 ? allAvgRanks[1] : null;
    const bestAvgRanks = allAvgRanks.slice(-topCount);

    console.log("allNoProblemRanks", allNoProblemRanks)
    console.log("allAvgRanks", allAvgRanks)

    arrayData.forEach((order) => {
        const tr = components.getTagTR();

        const noProblemRank = +order.ranc;
        const noProblem = components.getTagTD(order.no_problem);

        if (noProblemRank === worstNoProblemRank) {
            noProblem.classList.add('bg-danger-subtle');
        } else if (preWorstNoProblemRank && noProblemRank === preWorstNoProblemRank) {
            noProblem.classList.add('bg-warning-subtle');
        } else if (bestNoProblemRanks.includes(noProblemRank)) {
            noProblem.classList.add('bg-success-subtle');
        }

        const avgRank = +order.ranc_avg_raiting;
        const avg = components.getTagTD(order.avg_raiting);

        if (avgRank === worstAvgRank) {
            avg.classList.add('bg-danger-subtle');
        } else if (preWorstAvgRank && avgRank === preWorstAvgRank) {
            avg.classList.add('bg-warning-subtle');
        } else if (bestAvgRanks.includes(avgRank)) {
            avg.classList.add('bg-success-subtle');
        }

        tr.append(
            components.getTagTD(order.name),
            noProblem,
            components.getTagTD(order.problem),
            components.getTagTD(order.all_orders),
            avg,
        );

        tbody.append(tr);
    });

    return tbody;
};
