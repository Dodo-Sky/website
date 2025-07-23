import { postDataServer } from "../../apiServer";
import * as components from "../../components";

export const renderProblemOrders = async (departmentName, from, to) => {
    const planning = await postDataServer('planning_orders', { departmentName, from, to });
    const table = components.getTagTable();
    table.classList.add('table-sm');
    table.id = 'planning_orders_table';

    const caption = components.getTagCaption(
        'Эффективность работы с проблемными поездками',
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
        components.getTagTH('Среднее время поездки курьера'),
    );

    thead.append(tr);
    return thead;
};

const pasteOrder = (order, tbody, data) => {
    const tr = components.getTagTR();

    const noProblemRank = +order.ranc;
    const noProblem = components.getTagTD(order.no_problem);
    const avgRank = +order.ranc_avg_raiting;
    const avg = components.getTagTD(order.avg_raiting);

    if (order.name !== 'ИТОГО') {
        if (noProblemRank === data.worstNoProblemRank) {
            noProblem.classList.add('bg-danger-subtle');
        } else if (data.preWorstNoProblemRank && noProblemRank === data.preWorstNoProblemRank) {
            noProblem.classList.add('bg-warning-subtle');
        } else if (data.bestNoProblemRanks.includes(noProblemRank)) {
            noProblem.classList.add('bg-success-subtle');
        }

        if (avgRank === data.worstAvgRank) {
            avg.classList.add('bg-danger-subtle');
        } else if (data.preWorstAvgRank && avgRank === data.preWorstAvgRank) {
            avg.classList.add('bg-warning-subtle');
        } else if (data.bestAvgRanks.includes(avgRank)) {
            avg.classList.add('bg-success-subtle');
        }
    }

    tr.append(
        components.getTagTD(order.name),
        noProblem,
        components.getTagTD(order.problem),
        components.getTagTD(order.all_orders),
        avg,
        components.getTagTD(order.avg_delivery_time),
    );

    if (order.name === "ИТОГО") {
        tr.classList.add('fw-bold')
    }

    tbody.append(tr);
}

const buildBody = (arrayData) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    const orders = []
    let total = null

    arrayData.forEach((o) => {
        if (o.name === 'ИТОГО') {
            total = o
        } else {
            orders.push(o)
        }
    })

    const topCount = orders.length >= 4 ? 2 : 1;

    const allNoProblemRanks = [...new Set(orders.map(o => +o.ranc))].sort((a, b) => a - b);
    const allAvgRanks = [...new Set(orders.map(o => +o.ranc_avg_raiting))].sort((a, b) => b - a);

    const data = {
        worstNoProblemRank: allNoProblemRanks[0],
        preWorstNoProblemRank: orders.length >= 4 ? allNoProblemRanks[1] : null,
        bestNoProblemRanks: allNoProblemRanks.slice(-topCount),
        worstAvgRank: allAvgRanks[0],
        preWorstAvgRank: orders.length >= 4 ? allAvgRanks[1] : null,
        bestAvgRanks: allAvgRanks.slice(-topCount)
    }

    orders.forEach((order) => pasteOrder(order, tbody, data));

    if (total) {
        pasteOrder(total, tbody, data);
    }

    return tbody;
};
