import * as components from '../../components.js';
import { editData } from './edit_dismissed.js';

export async function renderDataToPizzeria(dataFromServer, time) {
  dataFromServer.sort((a, b) => new Date(a.dateOfCall) - new Date(b.dateOfCall));

  let now = new Date();
  dataFromServer = dataFromServer.filter(
    (el) =>
      now >= new Date(el.dateOfCall) &&
      new Date(el.dateOfCall) > new Date('2024-11-28') &&
      el.resolutionHR !== 'Нет',
  );

  const tableContent = document.querySelector('.dismissed-table');
  tableContent.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption('Программа обзвона уволенных');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');

  let trEl = components.getTagTR();

  // Время
  let thEl = components.getTagTH();
  thEl.classList.add('dropend');
  let btnDropdown = components.getTagButton_dropdown(time);
  btnDropdown.classList.add('btn-time');
  // количество задач в период
  let count = dataFromServer.length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  let ulDrop = components.getTagUL_dropdownMenu();
  let liDrpop = components.getTagLI_dropdownItem('За прошедшие сутки');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('За прошедшие 3 дня');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('За последнюю неделю');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('Показать за все время');
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH('ФИО сотрудника');
  trEl.append(thEl);

  thEl = components.getTagTH();
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Должность');
  btnDropdown.classList.add('btn-time');

  let pozitionArr = ['Все', ...new Set(dataFromServer.map((el) => el.positionName))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  console.log(pozitionArr);
  ulDrop = components.getTagUL_dropdownMenu();

  pozitionArr.forEach((pozition) => {
    liDrpop = components.getTagLI_dropdownItem(pozition);
    ulDrop.append(liDrpop);
  });

  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  thEl = components.getTagTH('№ звонка');
  trEl.append(thEl);
  thEl = components.getTagTH('Решение о звонке');
  trEl.append(thEl);

  // решение управляющего
  thEl = components.getTagTH();
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Результат / причина отказа');
  // количество задач в работе
  count = dataFromServer.filter((el) => !el.result).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  let countDelays = dataFromServer.filter((el) => el.result === 'Просрочка').length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  ulDrop = components.getTagUL_dropdownMenu();
  liDrpop = components.getTagLI_dropdownItem('Показать все');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('Только просроченные управляющим');
  ulDrop.append(liDrpop);
  liDrpop = components.getTagLI_dropdownItem('В работе управляющего (пустые)');
  ulDrop.append(liDrpop);
  thEl.append(btnDropdown, ulDrop);
  trEl.append(thEl);

  // дата возврата
  thEl = components.getTagTH();
  thEl.classList.add('dropend');
  btnDropdown = components.getTagButton_dropdown('Дата возврата');
  // Количество успешных возвратов
  countDelays = dataFromServer.filter((el) => el.dateBack).length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.classList.add('bg-success');
    spanEl.classList.remove('bg-danger');

    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  thEl.append(btnDropdown);
  trEl.append(thEl);

  thEl = components.getTagTH('Звоним дальше?');
  trEl.append(thEl);
  // thEl = components.getTagTH('Тип сотрудника');
  // trEl.append(thEl);
  thEl = components.getTagTH('Управление');
  trEl.append(thEl);

  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  dataFromServer.forEach((data, i) => {
    trEl = components.getTagTR();
    tBody.append(trEl);

    let time = components.getTagTD(
      new Date(data.dateOfCall).toLocaleString().slice(0, 10),
    );
    trEl.append(time);

    let fio = components.getTagTD(
      `${data.lastName} ${data.firstName} ${data.patronymicName}`,
    );
    trEl.append(fio);

    let positionName = components.getTagTD(data.positionName);
    trEl.append(positionName);

    // Модальное окно
    let countCall = components.getTagTD();
    let fade = components.getTagDiv('modal');
    fade.classList.add('fade');
    fade.setAttribute('id', data.idContact);
    fade.setAttribute('tabindex', '-1');
    fade.setAttribute('data-bs-backdrop', 'static');
    fade.setAttribute('data-bs-keyboard', 'false');
    let divDialog = components.getTagDiv('modal-dialog');
    let divContent = components.getTagDiv('modal-content');
    let divHeader = components.getTagDiv('modal-header');
    let titleH1 = components.getTagH(1, 'Подробная информация об уволенном сотруднике');
    titleH1.classList.add('modal-title');
    titleH1.classList.add('fs-5');
    let closeBtn = components.getTagButton_close();
    let modalBody = components.getTagDiv('modal-body');

    let resultAll = dataFromServer
      .filter((el) => el.staffId === data.staffId)
      .map((el) => {
        if (el.result) {
          return `дата: ${new Date(el.dateOfCall).toLocaleDateString()}<br> результат: ${
            el.result
          }<br>`;
        }
      })
      .join('');
    if (!resultAll) resultAll = 'Еще не звонили';

    let modalContent = `
    <b>Контактные данные</b><br>
    ФИО сотрудника: ${data.lastName} ${data.firstName} ${data.patronymicName}<br>
    Телефон: ${data.phoneNumber}<br><br>

    Дата приема на работу: ${new Date(data.hiredOn).toLocaleDateString()}<br>
    Дата увольнения: ${new Date(data.dismissedOn).toLocaleDateString()}<br><br>

    Коментарии управляющего при увольнении: <br>
    ${data.dismissalComment}<br><br>

    Причина увольнения: <br>
    ${data.dismissalReason}<br><br>

    Результаты прошлых звонков: <br>
    ${resultAll}<br><br><br>
    `;
    let commentHRContent = `Выходное интервью HR: <br> ${data.commentHR}<br><br>`;
    let exampleLetter =
      data.positionName === 'Автомобильный'
        ? `<b>Пример письма уволенному сотруднику</b><br>
    ${data.firstName}, добрый день! 👋</b><br>

    Это управляющий Додо пиццы. Ранее, Вы отлично показали себя в Додо и мы были бы рады видеть Вас снова! 🚀</b>

    Мы подготовили для Вас новые условия, которые точно Вас удивят! 🤩</b>

    💵 Подняли ставку за км, чтобы Вы могли не переживать за расходы на ГСМ!</b>
    💰 Внедрили динамическую оплату в определенный период времени, которая позволит Вам получать дополнительную выплату за свою услугу! Это значит, что Ваш доход может быть еще выше!</b>
    ✨ Расширили реферальную программу, теперь Вы можете получить не только локальный бонус, но федеральный! </b>

    Интересно? 🤔 Предлагаю обсудить детальнее, чтобы Вы могли понять все преимущества сотрудничества с нами. 💬</b>

    Что думаете? Готовы вернуться к нам и начать получать еще больше? 💸</b>

    Буду ждать от Вас ответа! 📲</b>    
    `
        : `<b>Пример письма уволенному сотруднику</b><br>
    ${data.firstName}, добрый день/вечер! 👋<br>

    Это управляющий Додо пиццы. Мы помним Вас как одного из наших лучших сотрудников, и мы были бы рады видеть Вас снова в нашей команде!<br>
    
    📢 Вы знаете, что за период вашего отсутствия в Додо произошли большие изменения!<br>
    💵 подняли ставку за час, чтобы Вы могли зарабатывать еще больше.
    📖 упростили систему стажировки, чтобы Вы могли быстрее влиться в работу.<br>
    💰 внедрили годовой бонус, который позволит Вам получить дополнительную выплату за свою работу.<br>
    ✨ расширили реферальную программу, теперь Вы можете получить бонус не только от нашей компании, но и от управляющей компании!<br>
    
    Если Вам интересно услышать подробнее о каком-либо нововведении, мы можем продолжить разговор. Я готов(а) ответить на все Ваши вопросы и рассказать о всех преимуществах работы в нашей команде.<br>
    
    Что думаете?<br>
    Готовы вернуться к нам и продолжить нашу совместную работу?<br>
    
    Мы ждем Вас!<br>
    `;
    modalBody.innerHTML = data.commentHR
      ? modalContent + commentHRContent + exampleLetter
      : modalContent + exampleLetter;

    fade.append(divDialog);
    divDialog.append(divContent);
    divHeader.append(titleH1, closeBtn);
    divContent.append(divHeader, modalBody);
    let btnOrder = components.getTagButton(data.countCall);
    btnOrder.setAttribute('data-bs-toggle', 'modal');
    btnOrder.setAttribute('data-bs-target', `#${data.idContact}`);
    btnOrder.classList.add('position-relative');
    btnOrder.classList.add('btn-outline-secondary');
    btnOrder.classList.remove('btn-primary');
    countCall.append(btnOrder, fade);
    trEl.append(countCall);

    let resolutionManager = components.getTagTD();
    let selectEL = components.getTagSelect();
    selectEL.classList.add('dismissed-resolutionManager');
    let yesOpt = components.getTagOption('Да', 'Да');
    let noOpt = components.getTagOption('Нет', 'Нет');

    if (data.resolutionManager === 'Да') {
      yesOpt.selected = true;
    }
    if (data.resolutionManager === 'Нет') {
      noOpt.selected = true;
    }
    if (data.resolutionManager === 'Отмена') {
      yesOpt.selected = true;
      selectEL.disabled = true;
    }
    if (!data.resolutionManager) {
      yesOpt.selected = true;
    }

    selectEL.append(yesOpt, noOpt);
    resolutionManager.append(selectEL);
    trEl.append(resolutionManager);

    let result = components.getTagTD();
    let commentHRTextarea = components.getTagTextarea();
    commentHRTextarea.textContent = data.result;
    commentHRTextarea.classList.add('dismissed-result');
    commentHRTextarea.setAttribute('cols', '300');
    commentHRTextarea.setAttribute('rows', 3);
    result.append(commentHRTextarea);
    trEl.append(result);

    let disposalTD = components.getTagTD();
    let dateBack = components.getTagInput('text', data.dateBack);
    dateBack.setAttribute('size', '20');
    dateBack.setAttribute('type', 'date');
    dateBack.classList.add('dismissed-dateBack');
    if (data.dateBack) {
      dateBack.classList.add('bg-success-subtle');
    }
    disposalTD.append(dateBack);
    trEl.append(disposalTD);
    dateBack.disposal;

    let furtherCall = components.getTagTD();
    let select = components.getTagSelect();
    select.classList.add('dismissed-furtherCall');
    let yesOpt1 = components.getTagOption('Да', 'Да');
    let noOpt1 = components.getTagOption('Не звоним', 'Не звоним');
    if (data.furtherCall === 'Да') {
      yesOpt1.selected = true;
    }
    if (data.furtherCall === 'Не звоним') {
      noOpt1.selected = true;
      select.classList.add('bg-danger-subtle');
    }
    select.append(yesOpt1, noOpt1);
    furtherCall.append(select);
    trEl.append(furtherCall);

    // let positionName = components.getTagTD(data.positionName);
    // trEl.append(positionName);

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton('Сохранить');
    btnEl.classList.add('arrayData-btn-save');
    btnEl.setAttribute('data-id', data.idContact);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  editData();
}
