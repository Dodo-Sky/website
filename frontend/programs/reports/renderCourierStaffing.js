import * as components from "../../components.js";

import { getCourierStaffingDesc, getCourierStaffingLevelTop, getCourierStaffingStopTop } from "./api.js";
import { convertStopToMinutes, formatStopDuration, getRussianMonth } from "./utils.js";

const formatWithSpace = (num) => {
    if (typeof num !== "number") {
        num = Number(num);
    }
    
    if (isNaN(num)) return '';
    
    if (num >= 1000) {
        // Разделяем на группы по 3 знака, разделитель — пробел
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return num.toString();
}

export const renderCourierStaffing = async (year) => {
    const staffing = await getCourierStaffingDesc({ year });
    const staffingLevelTop = await getCourierStaffingLevelTop({ year });
    const staffingStopTop = await getCourierStaffingStopTop({ year });

    const table = components.getTagTable();
    table.classList.add('table-sm');
    table.id = 'courier_staffing_table';

    const caption = components.getTagCaption(
        'Укомплектованность курьеров',
    );
    const thead = buildHeader();
    const tbody = buildBody(staffing, staffingLevelTop, staffingStopTop);

    table.append(caption, thead, tbody);

    return table;
}

const buildHeader = () => {
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    const tooltipText = "По текущему месяцу указывается план количества заказов на доставку. По прошедшим месяцам указывается фактическое количество заказов на доставку. План заказов рассчитывается на основе прошлогодних данных месяца (с учетом поправочного коэффициента разницы продаж между месяцами)."
    
    tr.append(
        components.getTagTH('Пиццерия'),
        components.getTagTH('Месяц'),
        components.getTagTH('Укомплектованность'),
        components.getTagTH('Усредненное кол-во заказов'),
        components.getTagTH('План / факт (итого заказов в месяц)', tooltipText),
        components.getTagTH('Требуется курьеров'),
        components.getTagTH('Курьеры факт'),
        components.getTagTH('Потребность / Излишки'),
        components.getTagTH('Стоп - нет курьеров'),
    );

    thead.append(tr);
    return thead;
};

const buildBody = (staffing, staffingLevelTop, staffingStopTop) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    staffing.forEach(item => {
        const levelTop = staffingLevelTop[item.month]
        const stopTop = staffingStopTop[item.month]

        const tr = components.getTagTR();
        const unitName = components.getTagTD(item.unit_name)
        const month = components.getTagTD(getRussianMonth(item.month))
        const staffingLevelPercent = components.getTagTD(item.staffing_level_percent + "%")
        const medianOrdersCount = components.getTagTD(item.median_orders_count)
        const totalDeliveryPerMonth = components.getTagTD(formatWithSpace(item.total_delivery_per_month))
        const couriersRequired = components.getTagTD(item.couriers_required)
        const couriersActual = components.getTagTD(item.couriers_actual)
        const needSurplus = components.getTagTD(item.need_surplus)
        const stopNoCouriers = components.getTagTD(formatStopDuration(item.stop_no_couriers))

        if (item.unit_name === levelTop[0].unitName) {
            staffingLevelPercent.classList.add('bg-success-subtle')
        } else if (item.unit_name === levelTop[levelTop.length - 1].unitName) {
            staffingLevelPercent.classList.add('bg-danger-subtle')
        } else if (levelTop.some(t => t.unitName === item.unit_name)) {
            const current = levelTop.find(t => t.unitName === item.unit_name)

            if (current.value === levelTop[0].value) {
                staffingLevelPercent.classList.add('bg-success-subtle')
            } else if (current.value === levelTop[levelTop.length - 1].value) {
                staffingLevelPercent.classList.add('bg-danger-subtle')
            } else {
                staffingLevelPercent.classList.add('bg-warning-subtle')
            }
        }

        const first = stopTop[0]
        const last = stopTop[stopTop.length - 1]

        if (item.unit_name === first.unitName) {
            stopNoCouriers.classList.add('bg-success-subtle')
        } else if (item.unit_name === last.unitName) {
            stopNoCouriers.classList.add('bg-danger-subtle')
        } else if (stopTop.some(t => t.unitName === item.unit_name)) {
            const current = stopTop.find(t => t.unitName === item.unit_name)

            if (convertStopToMinutes(current.value) === convertStopToMinutes(first.value)) {
                stopNoCouriers.classList.add('bg-success-subtle')
            } else if (convertStopToMinutes(current.value) === convertStopToMinutes(last.value)) {
                stopNoCouriers.classList.add('bg-danger-subtle')
            } else {
                stopNoCouriers.classList.add('bg-warning-subtle')
            }
        }

        tr.append(
            unitName,
            month,
            staffingLevelPercent,
            medianOrdersCount,
            totalDeliveryPerMonth,
            couriersRequired,
            couriersActual,
            needSurplus,
            stopNoCouriers,
        );

        if (item.unit_name === "Итого / среднее") {
            tr.classList.add('fw-bold')
            unitName.classList.add('bg-info-subtle')
            month.classList.add('bg-info-subtle')
            staffingLevelPercent.classList.add('bg-info-subtle')
            medianOrdersCount.classList.add('bg-info-subtle')
            totalDeliveryPerMonth.classList.add('bg-info-subtle')
            couriersRequired.classList.add('bg-info-subtle')
            couriersActual.classList.add('bg-info-subtle')
            needSurplus.classList.add('bg-info-subtle')
            stopNoCouriers.classList.add('bg-info-subtle')
        }

        tbody.append(tr);
    });
    return tbody;
}