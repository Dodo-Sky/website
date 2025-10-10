export const defaultChartOptions = {
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