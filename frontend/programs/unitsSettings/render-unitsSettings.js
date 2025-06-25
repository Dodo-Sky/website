import * as components from '../../components.js';
import { postDataServer } from '../../apiServer.js';
import { edit } from './edit-unitsSettings.js';

export async function render(select_unit) {
  const editUnitsSettings = document.querySelector('#editUnitsSettings');
  editUnitsSettings.style.display = 'none';

  const tableContent = document.querySelector('#mainContent');
  tableContent.innerHTML = '';
  tableContent.style.display = 'block';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();
  theadEl.append(trEl);

  let thEl = components.getTagTH('Параметр');
  trEl.append(thEl);
  thEl = components.getTagTH('Значение');
  trEl.append(thEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  trEl = components.getTagTR();
  tBody.append(trEl);

  let tdEl = components.getTagTD('Наименование');
  trEl.append(tdEl);
  tdEl = components.getTagTD(select_unit.name);
  trEl.append(tdEl);

  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Подразделение');
  trEl.append(tdEl);
  tdEl = components.getTagTD(select_unit.department_name);
  trEl.append(tdEl);

  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Таймзона');
  trEl.append(tdEl);
  let timeZoneShift;
  if (select_unit.time_zone_shift < 0) {
    timeZoneShift = `Минус ${select_unit.time_zone_shift} часов от UTC`;
  }
  if (select_unit.time_zone_shift > 0) {
    timeZoneShift = `Плюс ${select_unit.time_zone_shift} часов от UTC`;
  }
  tdEl = components.getTagTD(timeZoneShift);
  trEl.append(tdEl);

  let week_working_time = await postDataServer('get_week_working_time', {
    payload: select_unit.id,
  });

  if (week_working_time.length !== 0) {
    // Время работы ресторана
    trEl = components.getTagTR();
    tBody.append(trEl);
    tdEl = components.getTagTD('Время работы ресторана');
    trEl.append(tdEl);
    const restaurant_time = week_working_time.filter((el) => el.type === 'restaurant');
    let restaurantWeekWorkingTime = [];
    for (const { day_alias, working_time_start, working_time_end } of restaurant_time) {
      restaurantWeekWorkingTime.push(
        `${getDayName(day_alias)}: C ${getHoursAndMinute(working_time_start)} До ${getHoursAndMinute(working_time_end)}`,
      );
    }
    tdEl = components.getTagTD();
    tdEl.innerHTML = `${restaurantWeekWorkingTime.join('<br>')}`;
    trEl.append(tdEl);

    trEl = components.getTagTR();
    tBody.append(trEl);
    tdEl = components.getTagTD('Время работы доставки');
    trEl.append(tdEl);
    const delivery_time = week_working_time.filter((el) => el.type === 'delivery');
    let deliveryWeekWorkingTime = [];
    for (const { day_alias, working_time_start, working_time_end } of delivery_time) {
      deliveryWeekWorkingTime.push(
        `${getDayName(day_alias)}: C ${getHoursAndMinute(working_time_start)} До ${getHoursAndMinute(working_time_end)}`,
      );
    }
    tdEl = components.getTagTD();
    tdEl.innerHTML = `${deliveryWeekWorkingTime.join('<br>')}`;
    trEl.append(tdEl);
  }

  let active_program = await postDataServer('get_active_program', {
    payload: select_unit.id,
  });
  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Программы');
  trEl.append(tdEl);
  tdEl = components.getTagTD();
  trEl.append(tdEl);
  const tableEl2 = components.getTagTable();
  tableEl2.classList.add('table-sm');
  tdEl.append(tableEl2);

  const tBody2 = components.getTagTBody();
  tableEl2.append(tBody2);

  if (active_program.length !== 0) {
    active_program.forEach((program) => {
      let status = program.is_active ? 'Активна' : 'Выключена';
      trEl = components.getTagTR();
      tBody2.append(trEl);
      tdEl = components.getTagTD(program.name_program);
      trEl.append(tdEl);
      tdEl = components.getTagTD(status);
      trEl.append(tdEl);
    });
  }

  let telegram_id = await postDataServer('get_telegram_id', {
    payload: select_unit.id,
  });
  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('ID телеграмм');
  trEl.append(tdEl);
  tdEl = components.getTagTD();
  trEl.append(tdEl);
  const tableEl1 = components.getTagTable();
  tableEl1.classList.add('table-sm');
  tdEl.append(tableEl1);

  const tBody1 = components.getTagTBody();
  tableEl1.append(tBody1);

  telegram_id.forEach((user) => {
    trEl = components.getTagTR();
    tBody1.append(trEl);
    tdEl = components.getTagTD(user.telegram_id);
    trEl.append(tdEl);
    tdEl = components.getTagTD(user.name_task_staff);
    trEl.append(tdEl);
    tdEl = components.getTagTD(user.fio);
    trEl.append(tdEl);
  });
  tableEl.append(theadEl, tBody);

  let btnEl = components.getTagButton('Изменить');
  btnEl.classList.add('arrayData-btn-save');
  mainContent.append(btnEl);
  btnEl.addEventListener('click', function () {
    edit(telegram_id);
  });
}

function getHoursAndMinute(timeLap) {
  return new Date(timeLap * 1000).toISOString().slice(11, 16);
}

function getDayName(DayAlias) {
  if (DayAlias === 'Monday') return 'ПН';
  if (DayAlias === 'Tuesday') return 'ВТ';
  if (DayAlias === 'Wednesday') return 'СР';
  if (DayAlias === 'Thursday') return 'ЧТ';
  if (DayAlias === 'Friday') return 'ПТ';
  if (DayAlias === 'Saturday') return 'СБ';
  if (DayAlias === 'Sunday') return 'ВС';
}
