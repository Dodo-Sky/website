import * as components from '../../components.js';
import { getCourierStaffing } from "./api.js";
import { renderStaffingChart } from "./utils.js";

const metricNames = {
    "staffing_level_percent": 'Укомплектованность (%)',
    "median_orders_count": 'Среднее кол-во заказов',
    "total_delivery_per_month": 'Всего на доставку  в месяц',
    "couriers_required": 'Требуется курьеров',
    "couriers_actual": 'Курьеры факт',
    "need_surplus": 'Потребность / Излишки',
};

export const renderCourierStaffingChart = async (container, year) => {
    const selectEl = components.getTagSelect();
    selectEl.id = 'courier-staffing-chart-select';
    selectEl.style.width = "max-content";
    Object.keys(metricNames).forEach((key) => {
        const option = components.getTagOption(metricNames[key], key);
        selectEl.append(option);
    });
    const chart = components.getTagDiv('courier_staffing_chart')

    container.append(selectEl, chart);

    const staffing = await getCourierStaffing({ year });

    selectEl.value = 'staffing_level_percent';
    renderStaffingChart(chart, 'staffing_level_percent', staffing);

    selectEl.addEventListener('change', (e) => {
        const selectedMetric = e.target.value;
        renderStaffingChart(chart, selectedMetric, staffing);
    });
};