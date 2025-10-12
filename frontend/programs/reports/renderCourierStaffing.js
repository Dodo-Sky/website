import * as components from "../../components.js";

import { getCourierStaffingDesc } from "./api.js";
import { formatStopDuration, getRussianMonth } from "./utils.js";

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

    const table = components.getTagTable();
    table.classList.add('table-sm');
    table.id = 'courier_staffing_table';

    const caption = components.getTagCaption(
        'Укомплектованность курьеров',
    );
    const thead = buildHeader();
    const tbody = buildBody(staffing);

    table.append(caption, thead, tbody);

    return table;
}

const buildHeader = () => {
    const thead = components.getTagTHead();
    thead.classList.add('sticky-top');
    const tr = components.getTagTR();

    tr.append(
        components.getTagTH('Пиццерия'),
        components.getTagTH('Месяц'),
        components.getTagTH('Укомплектованность'),
        components.getTagTH('Усредненное кол-во заказов'),
        components.getTagTH('Всего на доставку  в месяц'),
        components.getTagTH('Требуется курьеров'),
        components.getTagTH('Курьеры факт'),
        components.getTagTH('Потребность / Излишки'),
        components.getTagTH('Стоп - нет курьеров'),
    );

    thead.append(tr);
    return thead;
};

const buildBody = (staffing) => {
    const tbody = components.getTagTBody();
    tbody.classList.add('tBody');

    staffing.forEach(item => {
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
            unitName.classList.add('bg-warning-subtle')
            month.classList.add('bg-warning-subtle')
            staffingLevelPercent.classList.add('bg-warning-subtle')
            medianOrdersCount.classList.add('bg-warning-subtle')
            totalDeliveryPerMonth.classList.add('bg-warning-subtle')
            couriersRequired.classList.add('bg-warning-subtle')
            couriersActual.classList.add('bg-warning-subtle')
            needSurplus.classList.add('bg-warning-subtle')
            stopNoCouriers.classList.add('bg-warning-subtle')
        }

        tbody.append(tr);
    });
    return tbody;
}