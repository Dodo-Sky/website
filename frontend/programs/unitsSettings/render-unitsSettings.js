import * as components from '../../components.js';
import { edit } from './edit-unitsSettings.js';

export function render(selectedUnit) {
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
  tdEl = components.getTagTD(selectedUnit.unitName);
  trEl.append(tdEl);

  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Подразделение');
  trEl.append(tdEl);
  tdEl = components.getTagTD(selectedUnit.departmentName);
  trEl.append(tdEl);

  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Таймзона');
  trEl.append(tdEl);
  let timeZoneShift;
  if (selectedUnit.timeZoneShift < 0) {
    timeZoneShift = `Минус ${selectedUnit.timeZoneShift} часов от UTC`;
  }
  if (selectedUnit.timeZoneShift > 0) {
    timeZoneShift = `Плюс ${selectedUnit.timeZoneShift} часов от UTC`;
  }
  tdEl = components.getTagTD(timeZoneShift);
  trEl.append(tdEl);

  // Время работы ресторана
  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Время работы ресторана');
  trEl.append(tdEl);

  let restaurantWeekWorkingTime = [];
  for (const { DayAlias, WorkingTimeStart, WorkingTimeEnd } of selectedUnit.RestaurantWeekWorkingTime) {
    restaurantWeekWorkingTime.push(
      `${getDayName(DayAlias)}: C ${getHoursAndMinute(WorkingTimeStart)} До ${getHoursAndMinute(WorkingTimeEnd)}`,
    );
  }
  tdEl = components.getTagTD();
  tdEl.innerHTML = `${restaurantWeekWorkingTime.join('<br>')}`;
  trEl.append(tdEl);

  // Время работы доставки
  trEl = components.getTagTR();
  tBody.append(trEl);
  tdEl = components.getTagTD('Время работы доставки');
  trEl.append(tdEl);

  function getHoursAndMinute(timeLap) {
    return new Date(timeLap * 1000).toISOString().slice(11, 16);
  }

  let DeliveryWeekWorkingTime = [];
  for (const { DayAlias, WorkingTimeStart, WorkingTimeEnd } of selectedUnit.DeliveryWeekWorkingTime) {
    DeliveryWeekWorkingTime.push(
      `${getDayName(DayAlias)}: C ${getHoursAndMinute(WorkingTimeStart)} До ${getHoursAndMinute(WorkingTimeEnd)}`,
    );
  }
  tdEl = components.getTagTD();
  tdEl.innerHTML = `${DeliveryWeekWorkingTime.join('<br>')}`;
  trEl.append(tdEl);

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

  if (selectedUnit.programs) {
    selectedUnit.programs.forEach((program) => {
      let status = program.isActive ? 'Активна' : 'Выключена';
      trEl = components.getTagTR();
      tBody2.append(trEl);
      tdEl = components.getTagTD(program.name);
      trEl.append(tdEl);
      tdEl = components.getTagTD(status);
      trEl.append(tdEl);
    });
  }

  // ID телеграмм
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

  selectedUnit.idTelegramm.forEach((user) => {
    trEl = components.getTagTR();
    tBody1.append(trEl);
    tdEl = components.getTagTD(user.id);
    trEl.append(tdEl);
    tdEl = components.getTagTD(user.nameFunction);
    trEl.append(tdEl);
    tdEl = components.getTagTD(user.fio);
    trEl.append(tdEl);
  });
  tableEl.append(theadEl, tBody);

  let btnEl = components.getTagButton('Изменить');
  btnEl.classList.add('arrayData-btn-save');
  mainContent.append(btnEl);
  btnEl.addEventListener('click', function () {
    edit(selectedUnit);
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
