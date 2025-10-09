import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { formatWeek, renderHistoryChartByWeek } from "./utils";

const metricNames = {
    extensionShifts: 'Продление смен',
    outsideSchedule: 'Вне графика',
    late: 'Опоздания',
    badAbsenteeism: 'Прогулы без уважительной причины',
    goodAbsenteeism: 'Уважительные прогулы',
    openingBeforeStartShift: 'Открытие до начала смены',
    earlyClosingShift: 'Раннее закрытие смены',
    balanceHours: 'Баланс часов'
};

export const renderDisciplineHistory = async (container, departmentName) => {
    const selectEl = components.getTagSelect();
    selectEl.id = 'discipline-history-select';
    selectEl.style.width = "max-content";
    Object.keys(metricNames).forEach((key) => {
        const option = components.getTagOption(metricNames[key], key);
        selectEl.append(option);
    });
    const chart = components.getTagDiv('planning_discipline_chart')

    container.append(selectEl, chart);

    const history = await postDataServer('planning_discipline_history', { departmentName });

    const allWeeks = [...new Set(
        history.map(row => formatWeek(row.weekStart, row.weekEnd))
    )];

    selectEl.value = 'extensionShifts';
    renderHistoryChartByWeek(chart, 'extensionShifts', allWeeks, history);

    selectEl.addEventListener('change', (e) => {
        const selectedMetric = e.target.value;
        renderHistoryChartByWeek(chart, selectedMetric, allWeeks, history);
    });
};
