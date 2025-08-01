let chartInstance = null;

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

export const renderChart = (chartContainer, metricKey, allWeeks, history) => {
    if (chartInstance) {
        chartInstance.destroy();
        chartContainer.innerHTML = "";
    }

    const series = buildSeries(metricKey, allWeeks, history);

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
        colors: series.map((_, i) => `hsl(${(i * 360) / series.length}, 70%, 50%)`),
        series,
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
            intersect: false,
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
