import * as components from '../../components.js';
import { editData } from './edit_discipline.js';
import * as filter from './filter_discipline.js';
import { getUserRole } from "../../auth/login";
import { getShiftHistoryByShiftId } from "../../apiServer";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
);

const formatted = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

function formatDate(dateString) {
  if (!dateString) return '—';
  return dateFormatter.format(new Date(dateString));
}

function appendHistorySection(modalBody, title, dates) {
  if (dates.length === 0) return;

  modalBody.innerHTML += `<b>${title}</b><br>`;
  for (const { oldDate, newDate } of dates) {
    if (!oldDate) {
      modalBody.innerHTML += `Добавлено: ${formatDate(newDate)}<br>`;
    } else {
      modalBody.innerHTML += `${formatDate(oldDate)} → ${formatDate(newDate)}<br>`;
    }
  }
}

function createOrderModalFullInfoButtonHandler(shiftId, modalBody) {
  let loaded = false;
  return async function () {
    if (loaded) return; // Предотвращаем повторную загрузку
    try {
      const shiftHistory = await getShiftHistoryByShiftId(shiftId);
      if (shiftHistory.length === 0) return;

      modalBody.innerHTML += `<br><b>История изменений</b><br>`;

      const clockInAtDates = shiftHistory
        .filter((item) => item.old_clock_in_at_local || item.new_clock_in_at_local)
        .map((item) => ({
          oldDate: item.old_clock_in_at_local,
          newDate: item.new_clock_in_at_local,
        }));

      const clockOutAtDates = shiftHistory
        .filter((item) => item.old_clock_out_at_local || item.new_clock_out_at_local)
        .map((item) => ({
          oldDate: item.old_clock_out_at_local,
          newDate: item.new_clock_out_at_local,
        }));

      appendHistorySection(modalBody, 'Время начала смены', clockInAtDates);
      appendHistorySection(modalBody, 'Время окончания смены', clockOutAtDates);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      modalBody.innerHTML += `<br><b class="text-danger">Не удалось загрузить историю</b>`;
    } finally {
      loaded = true;
    }
  };
}

const isDisabledReasonAbsenteeism = (schedule) => {
  const role = getUserRole();
  console.log("role", role);
  console.log("schedule.typeViolation", schedule.typeViolation);

  if (['администратор', 'Администратор всей сети', 'управляющий'].includes(role) && ['Прогул', 'Опоздание'].includes(schedule.typeViolation)) {
    return false
  }

  return true
}

export async function renderTable(arrayData, time, discipline) {
  const tableContent = document.querySelector('.discipline-table');
  tableContent.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption(
    'Программа контроля за соблюдение дисциплины персоналом',
  );

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');

  let trEl = components.getTagTR();

  // Время
  let thEl = components.getTagTH();
  thEl.classList.add('dropend');
  thEl.classList.add('time-defects');
  let btnDropdown = components.getTagButton_dropdown();
  btnDropdown.value = time;
  if (time == 0) btnDropdown.textContent = 'Все время';
  if (time == 1) btnDropdown.textContent = 'За сутки';
  if (time == 3) btnDropdown.textContent = 'За 3 дня';
  if (time == 7) btnDropdown.textContent = 'За неделю';

  btnDropdown.classList.add('btn-time');
  // количество задач в период
  let count = arrayData.length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  let ulDrop = components.getTagUL_dropdownMenu();
  let liDrpop = components.getTagLI_dropdownItem('За прошедшие сутки');
  liDrpop.value = 1;
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('За прошедшие 3 дня');
  ulDrop.append(liDrpop);
  liDrpop.value = 3;
  liDrpop = components.getTagLI_dropdownItem('За последнюю неделю');
  ulDrop.append(liDrpop);
  liDrpop.value = 7;
  liDrpop = components.getTagLI_dropdownItem('Показать за все время');
  ulDrop.append(liDrpop);
  liDrpop.value = 0;
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH('ФИО сотрудника');
  trEl.append(thEl);

  thEl = components.getTagTH('Тип нарушения');
  trEl.append(thEl);
  thEl = components.getTagTH('Коментарий сотрудника');
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.classList.add('dropend');
  thEl.classList.add('manager-defects');
  btnDropdown = components.getTagButton_dropdown('Решение менеджера');
  // количество задач в работе
  count = arrayData.filter((el) => !el.managerDecision).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  //  Количество просроченных менеджером задач
  let countDelays = arrayData.filter((el) => el.managerDecision === 'Просрочка').length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem('Показать все');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('Только просроченные');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('В работе');
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  // решение управляющего
  thEl = components.getTagTH();
  thEl.classList.add('dropend');
  thEl.classList.add('unitDirector-defects');
  btnDropdown = components.getTagButton_dropdown('Решение управляющего');
  // количество задач в работе
  count = arrayData.filter((el) => !el.unitDirectorControl).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  countDelays = arrayData.filter((el) => el.unitDirectorControl === 'Просрочка').length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem('Показать все');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('Только просроченные');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('В работе');
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH('Часы');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Прогул уважительный?');
  trEl.append(thEl);
  theadEl.append(trEl);

  thEl = components.getTagTH('Управление');
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  arrayData.forEach((schedule) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let time = components.getTagTD(
      schedule.scheduledShiftStartAtLocal
        ? formatted.format(new Date(schedule.scheduledShiftStartAtLocal))
        : formatted.format(new Date(schedule.clockInAtLocal)),
    );
    trEl.append(time);
    let fio = components.getTagTD(schedule.fio);
    trEl.append(fio);

    // Тип правонарушения с модальным окном
    let typeViolation = components.getTagTD();
    let fade = components.getTagDiv('modal');
    fade.classList.add('fade');
    fade.setAttribute('id', schedule.id);
    fade.setAttribute('tabindex', '-1');
    fade.setAttribute('data-bs-backdrop', 'static');
    fade.setAttribute('data-bs-keyboard', 'false');
    let divDialog = components.getTagDiv('modal-dialog');
    let divContent = components.getTagDiv('modal-content');
    let divHeader = components.getTagDiv('modal-header');
    let titleH1 = components.getTagH(1, 'Подробная информация о нарушении дисциплины');
    titleH1.classList.add('modal-title');
    titleH1.classList.add('fs-5');
    let closeBtn = components.getTagButton_close();
    let modalBody = components.getTagDiv('modal-body');
    let clockInAtLocal = schedule.clockInAtLocal
      ? formatted.format(new Date(schedule.clockInAtLocal))
      : 'Нет данных';

    let clockOutAtLocal = schedule.clockInAtLocal
      ? formatted.format(new Date(schedule.clockOutAtLocal))
      : 'Нет данных';

    modalBody.innerHTML = `
    <b>Общие данные</b><br>
    ФИО сотрудника: ${schedule.fio}<br>
    Описание: ${schedule.description}<br> <br>

    <b>Временные данные</b><br>
    Начало смены по графику: ${schedule.scheduledShiftStartAtLocal ? formatted.format(new Date(schedule.scheduledShiftStartAtLocal)) : 'нет данных'}<br>
    Начало смены - факт: ${clockInAtLocal}<br>
    Окончание смены по графику: ${schedule.scheduledShiftEndAtLocal ? formatted.format(new Date(schedule.scheduledShiftEndAtLocal)) : 'нет данных'} <br>
    Окончание смены - факт: ${clockOutAtLocal} <br>
`;
    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);
    let btnOrder = components.getTagButton(schedule.typeViolation);
    if (schedule.typeViolation === 'Прогул') {
      btnOrder.classList.add('btn-outline-danger');
    } else if (schedule.typeViolation === 'Продление') {
      btnOrder.textContent = schedule.description;
    } else if (schedule.typeViolation === 'Опоздание') {
      btnOrder.textContent = schedule.description;
      btnOrder.classList.add('btn-outline-warning');
    } else if (schedule.typeViolation === 'Раннее закрытие смены') {
      btnOrder.classList.add('btn-outline-success');
    }

    btnOrder.classList.add('btn-outline-secondary');
    btnOrder.classList.remove('btn-primary');
    btnOrder.setAttribute('data-bs-toggle', 'modal');
    btnOrder.setAttribute('data-bs-target', `#${schedule.id}`);
    if (schedule.shiftId !== null) {
      btnOrder.addEventListener('click', createOrderModalFullInfoButtonHandler(schedule.shiftId, modalBody));
    }

    typeViolation.append(btnOrder, fade);
    trEl.append(typeViolation);

    let courierComment = components.getTagTD(schedule.commentStaff);
    trEl.append(courierComment);

    let graphistComment = components.getTagTD();
    let graphistCommentTextarea = components.getTagTextarea(schedule.managerDecision);
    graphistCommentTextarea.classList.add('discipline-managerDecision');
    graphistCommentTextarea.setAttribute('cols', '75');
    if (schedule.managerDecision === 'Просрочка') {
      graphistCommentTextarea.classList.add('bg-danger-subtle');
    }
    graphistComment.append(graphistCommentTextarea);
    trEl.append(graphistComment);

    let directorComment = components.getTagTD();
    let directorCommentTextarea = components.getTagTextarea(schedule.unitDirectorControl);
    directorCommentTextarea.classList.add('discipline-unitDirectorControl');
    directorCommentTextarea.setAttribute('cols', '75');

    if (schedule.typeViolation === 'Открытие до начала смены') {
      graphistCommentTextarea.placeholder = 'Почему открыли раньше графика?'
      directorCommentTextarea.placeholder = 'Принятое решение';
    }

    let role = localStorage.getItem('role');
    if (role === 'менеджер смены') {
      directorCommentTextarea.disabled = true;
    }
    if (schedule.unitDirectorControl === 'Просрочка') {
      directorCommentTextarea.classList.add('bg-danger-subtle');
    }
    directorComment.append(directorCommentTextarea);
    trEl.append(directorComment);

    let working_hours = components.getTagTD(schedule.working_hours);
    trEl.append(working_hours);

    let reasonAbsenteeismTd = components.getTagTD();
    let reasonAbsenteeismCheckbox = components.getTagInput_checkbox(`discipline-reason_absenteeism-${schedule.id}`);
    reasonAbsenteeismCheckbox.classList.add('discipline-reason_absenteeism');
    reasonAbsenteeismCheckbox.checked = schedule.reason_absenteeism;
    reasonAbsenteeismCheckbox.disabled = isDisabledReasonAbsenteeism(schedule);
    reasonAbsenteeismTd.append(reasonAbsenteeismCheckbox);
    trEl.append(reasonAbsenteeismTd);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton('Сохранить');
    btnEl.classList.add('arrayData-btn-save');
    btnEl.setAttribute(
      'data-id',
      schedule.id ?? schedule.staffId + schedule.clockInAtLocal,
    );
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);

  // Обработчик фильтрации по дате
  const time_defects = document.querySelector('.time-defects');
  const liTimes = time_defects.querySelectorAll('li');
  liTimes.forEach((el) => {
    el.addEventListener('click', () => {
      filter.filterToDate(el.value, discipline);
    });
  });

  // обработчик решений менеджера смены
  const manager = document.querySelector('.manager-defects');
  const liManagers = manager.querySelectorAll('li');
  liManagers.forEach((el) => {
    el.addEventListener('click', () =>
      filter.filterToManager(el.textContent, discipline),
    );
  });

  // обработчик решений управляющего
  const unitDirector = document.querySelector('.unitDirector-defects');
  const liDirectors = unitDirector.querySelectorAll('li');
  liDirectors.forEach((el) => {
    el.addEventListener('click', () =>
      filter.filterToDirector(el.textContent, discipline),
    );
  });
  editData(arrayData)
}
