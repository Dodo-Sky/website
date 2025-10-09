let chartInstance = null;

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
    series: [],
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        categories: [],
        labels: {
            rotate: -45
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        x: {
            show: true
        }
    },
    legend: {
        position: 'top'
    }
};

const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const getRussianMonth = (monthIndex) => {
    return months[monthIndex - 1];
};

export const formatWeek = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const s = start.toLocaleDateString('ru-RU', { day: '2-digit' });
    const e = end.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });

    return `${s} – ${e}`;
}

export const buildSeries = (metricKey, allWeeks, history) => {
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
    options.series = series;
    options.xaxis.categories = allWeeks;
    options.colors = series.map((_, i) => `hsl(${(i * 360) / series.length}, 70%, 50%)`)

    chartInstance = new ApexCharts(chartContainer, options);
    chartInstance.render();
};

export const buildStaffingSeries = (metricKey, allMonths, staffing) => {
    const grouped = {};

    staffing.forEach(item => {
        const month = getRussianMonth(item.month);
        if (!grouped[item.unit_name]) grouped[item.unit_name] = {};
        grouped[item.unit_name][month] = item[metricKey];
    });

    return Object.entries(grouped).map(([unitName, valuesByMonth]) => ({
        name: unitName,
        data: allMonths.map(month => valuesByMonth[month] !== null ? parseFloat(valuesByMonth[month]) : null)
    }));
}

export const renderStaffingChart = (chartContainer, metricKey, staffing) => {
    if (chartInstance) {
        chartInstance.destroy();
        chartContainer.innerHTML = "";
    }
    
    const allMonths = [...new Set(staffing.map(item => getRussianMonth(item.month)))];
    const series = buildStaffingSeries(metricKey, allMonths, staffing);
    options.series = series;
    options.xaxis.categories = allMonths;
    options.colors = series.map((_, i) => `hsl(${(i * 360) / series.length}, 70%, 50%)`)

    chartInstance = new ApexCharts(chartContainer, options);
    chartInstance.render();
}