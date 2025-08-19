import * as components from '../../components.js';
import { editData } from './edit_defects.js';
import * as filter from './filter_defects.js';

let role = localStorage.getItem('role');

const parseDate = (date) => {
    const d = new Date(date);

    const day = d.getUTCDate().toString().padStart(2, "0");
    const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = d.getUTCFullYear();
    const hour = d.getUTCHours().toString().padStart(2, "0");
    const minute = d.getUTCMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year}, ${hour}:${minute}`;
}

export async function renderTable(defects, time, fullDataUnit, timeZoneShift) {
  time = +time;
  defects.sort((a, b) => new Date(a.soldAtLocal) - new Date(b.soldAtLocal));

  const tableContent = document.querySelector('.defects-table');
  tableContent.innerHTML = '';
  const staffData = JSON.parse(localStorage.getItem('staffData'));

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);

  const captionEl = components.getTagCaption('Программа контроля списания забракованных продуктов');

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
  let count1 = fullDataUnit.length;
  if (count1) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count1;
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

  thEl = components.getTagTH('Продукт');
  trEl.append(thEl);
  thEl = components.getTagTH('В мусорке?');
  trEl.append(thEl);
  thEl = components.getTagTH('Причина брака');
  trEl.append(thEl);
  thEl = components.getTagTH('Лицо допустившее брак');
  trEl.append(thEl);

  // решение менеджера
  thEl = components.getTagTH();
  thEl.classList.add('manager-defects');
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Менеджер');
  // количество задач в работе
  let count = fullDataUnit.filter((el) => !el.graphist_comment).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  //  Количество просроченных менеджером задач
  let countDelays = fullDataUnit.filter((el) => el.graphist_comment === 'Просрочка').length;
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
  thEl.classList.add('unitDirector-defects');
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Управляющий');
  // количество задач в работе
  count = fullDataUnit.filter((el) => !el.manager_comment).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  countDelays = fullDataUnit.filter((el) => el.manager_comment === 'Просрочка').length;
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

  thEl = components.getTagTH('Управление');
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  fullDataUnit.forEach((defect) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let soldAtLocal = components.getTagTD(parseDate(defect.sold_at_local));
    trEl.append(soldAtLocal);
    let productName = components.getTagTD(defect.product_name);
    trEl.append(productName);

    let disposalTD = components.getTagTD();
    let selectEL = components.getTagSelect();
    selectEL.classList.add('defects-disposal');
    let choiseOpt = components.getTagOption('', '');
    let yesOpt = components.getTagOption('Да', true);
    let noOpt = components.getTagOption('Нет', false);
    if (defect.is_trashed) {
      yesOpt.selected = true;
    } else {
      noOpt.selected = true;
    }

    if (role === 'Гость') {
      selectEL.disabled = true;
    }

    selectEL.append(choiseOpt, yesOpt, noOpt);
    disposalTD.append(selectEL);
    trEl.append(disposalTD);

    let reasonDefectTD = components.getTagTD();
    let reasonDefectTextarea = components.getTagTextarea(defect.reason);
    reasonDefectTextarea.classList.add('defects-reasonDefect');
    reasonDefectTextarea.setAttribute('cols', '75');
    reasonDefectTD.append(reasonDefectTextarea);
    trEl.append(reasonDefectTD);

    let nameViolatorTD = components.getTagTD();
    let nameViolatorTextarea = components.getTagInput();
    nameViolatorTextarea.value = defect.staff_name;
    nameViolatorTextarea.classList.add('defects-nameViolator');
    nameViolatorTextarea.setAttribute('list', 'datalistOptions');
    let datalist = components.getTagDatalist();
    datalist.setAttribute('id', 'datalistOptions');
    const currentUnitId = document.querySelector(".selectUnit").value;
    staffData
        .filter((s) => s.unitId === currentUnitId)
        .forEach((s) => {
          let option = components.getTagOption('', `${s.lastName} ${s.firstName}`);
          datalist.append(option);
        });
    nameViolatorTD.append(nameViolatorTextarea, datalist);
    trEl.append(nameViolatorTD);

    let decisionManagerTD = components.getTagTD();
    let decisionManagerTextarea = components.getTagTextarea(defect.graphist_comment);
    decisionManagerTextarea.classList.add('defects-decisionManager');
    decisionManagerTextarea.setAttribute('cols', '45');
    decisionManagerTD.append(decisionManagerTextarea);

    if (defect.graphist_comment === 'Просрочка') {
      decisionManagerTextarea.classList.add('bg-danger-subtle');
    }
    trEl.append(decisionManagerTD);

    let controlTD = components.getTagTD();
    let controlTextarea = components.getTagTextarea(defect.manager_comment);
    controlTextarea.classList.add('defects-control');
    controlTextarea.setAttribute('cols', '45');
    if (role === 'менеджер смены') {
      controlTextarea.disabled = true;
    }
    controlTD.append(controlTextarea);

    if (defect.manager_comment === 'Просрочка') {
      controlTextarea.classList.add('bg-danger-subtle');
    }
    trEl.append(controlTD);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton('Сохранить');
    btnEl.classList.add('defects-btn-save');
    btnEl.setAttribute('data-id', `${defect.id}`);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);

  editData(fullDataUnit);

  // Обработчик фильтрации по дате
  const time_defects = document.querySelector('.time-defects');
  const liTimes = time_defects.querySelectorAll('li');
  liTimes.forEach((el) => {
    el.addEventListener('click', () => {
      filter.filterToDate(el.value, defects, timeZoneShift);
    });
  });

  // обработчик решений менеджера смены
  const manager = document.querySelector('.manager-defects');
  const liManagers = manager.querySelectorAll('li');
  liManagers.forEach((el) => {
    el.addEventListener('click', () => {
      filter.filterToManager(el.textContent, defects);
    });
  });

  // обработчик решений управляющего
  const unitDirector = document.querySelector('.unitDirector-defects');
  const liDirectors = unitDirector.querySelectorAll('li');
  liDirectors.forEach((el) => {
    el.addEventListener('click', () => filter.filterToDirector(el.textContent, defects));
  });
}
