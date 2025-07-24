import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';

const metricNames = {
    extensionShifts: 'Продление смен',
    outsideSchedule: 'Вне графика',
    late: 'Опоздания',
    badAbsenteeism: 'Прогулы без уважительной причины',
    goodAbsenteeism: 'Уважительные прогулы',
    balanceHours: 'Баланс часов'
};

let chartInstance = null;

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

const formatWeek = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const s = start.toLocaleDateString('ru-RU', { day: '2-digit' });
    const e = end.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });

    return `${s} – ${e}`;
}

const buildSeries = (metricKey, allWeeks, history) => {
    const grouped = {};

    history.forEach(row => {
        const weekLabel = formatWeek(row.weekStart, row.weekEnd);
        if (!grouped[row.unitName]) grouped[row.unitName] = {};
        grouped[row.unitName][weekLabel] = row[metricKey];
    });

    return Object.entries(grouped).map(([unitName, valuesByWeek]) => ({
        name: unitName,
        data: allWeeks.map(week => valuesByWeek[week] ?? null)
    }));
};

const renderChart = (chartContainer, metricKey, allWeeks, history) => {
    if (chartInstance) {
        chartInstance.destroy();
        chartContainer.innerHTML = "";
    }

    const options = {
        chart: {
            type: 'line',
            height: 400,
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        series: buildSeries(metricKey, allWeeks, history),
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: allWeeks,
            labels: {
                rotate: -45
            }
        },
        tooltip: {
            shared: true,
            x: {
                show: true
            }
        },
        legend: {
            position: 'top'
        }
    };

    chartInstance = new ApexCharts(chartContainer, options);
    chartInstance.render();
};
