import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { formatWeek, renderChart } from "./utils";

const metricNames = {
    extensionShifts: 'Продление смен',
    outsideSchedule: 'Вне графика',
    late: 'Опоздания',
    badAbsenteeism: 'Прогулы без уважительной причины',
    goodAbsenteeism: 'Уважительные прогулы',
    balanceHours: 'Баланс часов'
};

export const renderDisciplineHistory = async (container, departmentName) => {
    const selectEl = components.getTagSelect();
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
    renderChart(chart, 'extensionShifts', allWeeks, history);

    selectEl.addEventListener('change', (e) => {
        const selectedMetric = e.target.value;
        renderChart(chart, selectedMetric, allWeeks, history);
    });
};
