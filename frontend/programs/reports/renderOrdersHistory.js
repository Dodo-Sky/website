import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { formatWeek, renderChart } from "./utils";

const metricNames = {
    noProblem: 'Поездки без отметки курьера',
    problem: 'Поездки с отметкой курьера "Проблема"',
    allOrders: 'Всего проблемных поездок',
    avgRaiting: 'Средний рейтинг курьера',
    avgDeliveryTime: 'Среднее время поездки курьера'
};

export const renderOrdersHistory = async (container, departmentName) => {
    const selectEl = components.getTagSelect();
    selectEl.style.width = "max-content";
    Object.keys(metricNames).forEach((key) => {
        const option = components.getTagOption(metricNames[key], key);
        selectEl.append(option);
    });
    const chart = components.getTagDiv('planning_orders_chart')

    container.append(selectEl, chart);

    const history = await postDataServer('planning_orders_history', { departmentName });

    const allWeeks = [...new Set(
        history.map(row => formatWeek(row.weekStart, row.weekEnd))
    )];

    selectEl.value = 'noProblem';
    renderChart(chart, 'noProblem', allWeeks, history);

    selectEl.addEventListener('change', (e) => {
        const selectedMetric = e.target.value;
        renderChart(chart, selectedMetric, allWeeks, history);
    });
};
