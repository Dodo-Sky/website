import { defaultChartOptions } from "./chartConfigs.js";

let chartInstance = null;

const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const getRussianMonth = (monthIndex) => {
    return months[monthIndex - 1];
};

export const convertStopToMinutes = (stopData) => {
    if (!stopData) return 0;
    
    let totalMinutes = 0;
    
    if (stopData.years) {
        totalMinutes += stopData.years * 365 * 24 * 60;
    }
    if (stopData.months) {
        totalMinutes += stopData.months * 30 * 24 * 60;
    }
    if (stopData.days) {
        totalMinutes += stopData.days * 24 * 60;
    }
    if (stopData.hours) {
        totalMinutes += stopData.hours * 60;
    }
    if (stopData.minutes) {
        totalMinutes += stopData.minutes;
    }
    if (stopData.seconds) {
        totalMinutes += stopData.seconds / 60;
    }
    
    return Math.round(totalMinutes);
};

export const formatStopDuration = (stopData) => {
    let stop = ""
   
    if (stopData) {
        if (stopData.years) {
            stop += `${stopData.years} лет `
        }

        if (stopData.mons) {
            stop += `${stopData.months} мес. `
        }

        if (stopData.days) {
            stop += `${stopData.days} д. `
        }

        if (stopData.hours) {
            stop += `${stopData.hours} ч. `
        }

        if (stopData.minutes) {
            stop += `${stopData.minutes} мин. `
        }

        if (stopData.seconds) {
            stop += `${stopData.seconds} сек. `
        }
    }

    return stop;
};

export const formatWeek = (startStr, endStr) => {
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
        data: allWeeks.map(week => valuesByWeek[week] !== null ? parseFloat(valuesByWeek[week]) : null)
    }));
};

export const renderHistoryChartByWeek = (chartContainer, metricKey, allWeeks, history) => {
    if (chartInstance) {
        chartInstance.destroy();
        chartContainer.innerHTML = "";
    }

    const series = buildSeries(metricKey, allWeeks, history);
    const options = {
        ...defaultChartOptions,
        series,
        xaxis: {
            categories: allWeeks,
        },
        colors: series.map((_, i) => `hsl(${(i * 360) / series.length}, 70%, 50%)`)
    }

    chartInstance = new ApexCharts(chartContainer, options);
    chartInstance.render();
};

const buildStaffingSeries = (metricKey, allMonths, staffing) => {
    const grouped = {};

    staffing.forEach(item => {
        const month = getRussianMonth(item.month);
        if (!grouped[item.unit_name]) grouped[item.unit_name] = {};
        
        if (metricKey === 'stop_no_couriers') {
            grouped[item.unit_name][month] = convertStopToMinutes(item[metricKey]);
        } else {
            grouped[item.unit_name][month] = item[metricKey];
        }
    });

    return Object.entries(grouped).map(([unitName, valuesByMonth]) => ({
        name: unitName,
        data: allMonths.map(month => valuesByMonth[month] !== null ? parseFloat(valuesByMonth[month]) : null),
        hidden: unitName !== "Итого / среднее",
    }));
}

export const renderStaffingChart = (chartContainer, metricKey, staffing) => {
    if (chartInstance) {
        chartInstance.destroy();
        chartContainer.innerHTML = "";
    }
    
    const allMonths = [...new Set(staffing.map(item => getRussianMonth(item.month)))];
    const series = buildStaffingSeries(metricKey, allMonths, staffing);

    const options = {
        ...defaultChartOptions,
        series,
        xaxis: {
            categories: allMonths,
        },
        colors: series.map((_, i) => `hsl(${(i * 360) / series.length}, 70%, 50%)`),
        tooltip: {
            ...defaultChartOptions.tooltip,
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const month = w.globals.labels[dataPointIndex];
                let tooltipContent = `
                    <div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">${getRussianMonth(month)}</div>
                `;

                for (let i = 0; i < series.length; i++) {
                    const value = series[i][dataPointIndex];
                    if (value !== null && value !== undefined) {
                        const unitName = w.globals.seriesNames[i];
                        const originalData = staffing.find(item => item.month === month && item.unit_name === unitName);
                        const formattedDuration = originalData ? formatStopDuration(originalData.stop_no_couriers) : value;
                        
                        tooltipContent += `
                            <div class="apexcharts-tooltip-series-group" style="order: ${i + 1}; display: flex;">
                                <div class="apexcharts-tooltip-y-group">
                                    <span class="apexcharts-tooltip-text-y-label">${unitName}:</span>
                                    <span class="apexcharts-tooltip-text-y-value">${metricKey === 'stop_no_couriers' ? formattedDuration : value}</span>
                                </div>
                            </div>
                        `;
                    }
                }
                
                return tooltipContent;
            }
        }
    }

    chartInstance = new ApexCharts(chartContainer, options);
    chartInstance.render();
}