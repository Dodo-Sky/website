import * as components from '../../components.js';
import { postDataServer } from '../../apiServer.js';

export async function render_interviewTable(dataFromServer) {
  dataFromServer.sort((a, b) => new Date(a.dismissedOn) - new Date(b.dismissedOn));
  dataFromServer = dataFromServer.filter((el) => el.positionName !== 'Автомобильный');

  const tableContent = document.querySelector('.dismissed-table');
  tableContent.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);

  const captionEl = components.getTagCaption('Выходное интервью уволенных сотрудников');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');

  let trEl = components.getTagTR();

  let thEl = components.getTagTH('Дата уволь');
  trEl.append(thEl);
  thEl = components.getTagTH('ФИО');
  trEl.append(thEl);
  thEl = components.getTagTH('Пиццерия');
  trEl.append(thEl);
  thEl = components.getTagTH('Должность');
  trEl.append(thEl);

  thEl = components.getTagTH('Коментарий управляющего');
  trEl.append(thEl);
  thEl = components.getTagTH('Причина увольнения');
  trEl.append(thEl);
  thEl = components.getTagTH('Решение HR');
  trEl.append(thEl);

  // Выходное интервью
  thEl = components.getTagTH();
  thEl.classList.add('dropend');
  let btnDropdown = components.getTagButton_dropdown('Выходное интервью');
  // количество задач в работе
  let count = dataFromServer.filter((el) => !el.commentHR).length;
  if (count) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count;
    btnDropdown.append(spanWork);
  }
  // Количество просроченных управляющим задач
  let countDelays = dataFromServer.filter((el) => el.commentHR === 'Просрочка').length;
  if (countDelays) {
    const spanEl = components.getTagSpan_badge(countDelays);
    spanEl.textContent = countDelays;
    btnDropdown.append(spanEl);
  }
  thEl.append(btnDropdown);
  trEl.append(thEl);

  thEl = components.getTagTH('Управление');
  trEl.append(thEl);
  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  dataFromServer.forEach((dataFromServer) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    let dismissedOn = components.getTagTD(
      new Date(dataFromServer.dismissedOn).toISOString().slice(0, 10),
    );
    trEl.append(dismissedOn);

    let fio = components.getTagTD(
      `${dataFromServer.lastName} ${dataFromServer.firstName} ${dataFromServer.patronymicName}`,
    );
    trEl.append(fio);

    let unitName = components.getTagTD(dataFromServer.unitName);
    trEl.append(unitName);
    let positionName = components.getTagTD(dataFromServer.positionName);
    trEl.append(positionName);
    let dismissalComment = components.getTagTD(dataFromServer.dismissalComment);
    trEl.append(dismissalComment);
    let dismissalReason = components.getTagTD(dataFromServer.dismissalReason);
    trEl.append(dismissalReason);

    let resolutionHR = components.getTagTD();
    let selectEL = components.getTagSelect();
    selectEL.classList.add('dismissed-resolutionHR');
    let yesOpt = components.getTagOption('Да', 'Да');
    let noOpt = components.getTagOption('Нет', 'Нет');

    if (yesOpt.value === dataFromServer.resolutionHR) {
      yesOpt.selected = true;
    } else noOpt.selected = true;
    if (!dataFromServer.resolutionHR) yesOpt.selected = true;

    selectEL.append(yesOpt, noOpt);
    resolutionHR.append(selectEL);
    trEl.append(resolutionHR);

    let commentHR = components.getTagTD();
    let commentHRTextarea = components.getTagTextarea(dataFromServer.commentHR);
    commentHRTextarea.classList.add('dismissed-commentHR');
    commentHR.append(commentHRTextarea);
    trEl.append(commentHR);

    let role = localStorage.getItem('role');
    if (role !== 'менеджер офиса') {
      commentHRTextarea.disabled = true;
      selectEL.disabled = true;
    }

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton('Сохранить');
    btnEl.classList.add('arrayData-btn-save');
    btnEl.setAttribute('data-id', dataFromServer.id);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  edit_interviewTable(dataFromServer);
}

// редактирование
function edit_interviewTable(dataFromServer) {
  makeButtonActive('commentHR', dataFromServer);
  makeButtonActive('resolutionHR', dataFromServer);

  // проверка сохранения данных юзером
  window.addEventListener('beforeunload', function (event) {
    const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
    btns.forEach((btn) => {
      if (!btn.disabled) {
        event.preventDefault();
        event.returnValue = true;
      }
    });
  });
  postServer();
}

function makeButtonActive(objectProperty, dataFromServer) {
  const property = document.querySelectorAll(`.dismissed-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener('input', async function (e) {
      let element = dataFromServer.find(
        (el) => e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === el.id,
      );
      let btn = e.target.parentNode.parentNode.lastChild.firstChild;
      if (e.target.value !== element[objectProperty]) {
        btn.disabled = false;
      }
      if (e.target.value === element[objectProperty]) {
        btn.disabled = true;
      }
    });
  });
}

// запись данных на сервер
const variableName = 'dismissed';
export function postServer() {
  const bnts = document.querySelectorAll('.arrayData-btn-save');
  bnts.forEach((btn) => {
    btn.addEventListener('click', async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const commentHR = trEl.querySelector('.dismissed-commentHR').value;
      const resolutionHR = trEl.querySelector('.dismissed-resolutionHR').value;

      let changeServer = {
        id: btn.dataset.id,
        commentHR,
        resolutionHR,
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(variableName, changeServer);
      if (responce.id === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
