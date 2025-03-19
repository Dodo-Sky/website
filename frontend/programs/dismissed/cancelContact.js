import * as components from '../../components.js';
import { postDataServer } from '../../apiServer.js';

export async function render_cancelContact(dataFromServer) {
  dataFromServer = dataFromServer
    .filter((el) => el.cancelResolutionHR)
    .sort((a, b) => new Date(a.dateOfCall) - new Date(b.dateOfCall));

  const tableContent = document.querySelector('.dismissed-table');
  tableContent.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);

  const captionEl = components.getTagCaption(
    'Отмена решения HR службы о звонке уволенному сотруднику',
  );

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
  thEl = components.getTagTH('Обоснование управляющим отказа звонить');
  trEl.append(thEl);

  thEl = components.getTagTH();
  // thEl.classList.add('dropend');
  let btnDropdown = components.getTagButton_dropdown('Отмена решения');
  btnDropdown.classList.add('btn-time');
  btnDropdown.removeAttribute ('data-bs-toggle');
  btnDropdown.classList.remove('dropdown-toggle');
  // количество задач в период
  let count = dataFromServer.filter (el => el.cancelResolutionHR === true || el.cancelResolutionHR === 'false')
  console.log(count);
  
   console.log(dataFromServer);

  if (count.length > 0) {
    const spanWork = components.getTagSpan();
    spanWork.classList.add('badge');
    spanWork.classList.add('text-bg-secondary');
    spanWork.textContent = count.length;
    btnDropdown.append(spanWork);
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
    let result = components.getTagTD(dataFromServer.result);
    trEl.append(result);

    let resolutionHR = components.getTagTD();
    let selectEL = components.getTagSelect();
    selectEL.classList.add('dismissed-cancelResolutionHR');
    let choiseOpt = components.getTagOption('Выберите', false);
    let noOpt = components.getTagOption('Отменить решение управляющего', 'Отменить решение управляющего');
    let yesOpt = components.getTagOption('Согласиться с решением управляющего', 'Согласиться с решением управляющего');
    if (dataFromServer.cancelResolutionHR === true || dataFromServer.cancelResolutionHR === 'false') {
        choiseOpt.selected = true;
        selectEL.classList.add ('bg-warning-subtle');
    }
    if (dataFromServer.cancelResolutionHR === 'Отменить решение управляющего') {
        noOpt.selected = true;
        selectEL.classList.add ('bg-danger-subtle');
    }
    if (dataFromServer.cancelResolutionHR === 'Согласиться с решением управляющего') {
        yesOpt.selected = true
        selectEL.classList.add ('bg-success-subtle');
    }
    selectEL.append(yesOpt, noOpt, choiseOpt);
    resolutionHR.append(selectEL);
    trEl.append(resolutionHR);

    let role = localStorage.getItem ('role')
    if (role !== 'менеджер офиса') {
      selectEL.disabled = true;
    }

    let tdEl = components.getTagTD();
    let btnEl = components.getTagButton('Сохранить');
    btnEl.classList.add('arrayData-btn-save');
    btnEl.setAttribute('data-id', dataFromServer.idContact);
    btnEl.disabled = true;
    tdEl.append(btnEl);
    trEl.append(tdEl);
  });
  tableEl.append(captionEl, theadEl, tBody);
  edit_interviewTable(dataFromServer);
}

// редактирование
function edit_interviewTable(dataFromServer) {
  makeButtonActive('cancelResolutionHR', dataFromServer);

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
        (el) =>
          e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === el.idContact,
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
      const cancelResolutionHR = trEl.querySelector('.dismissed-cancelResolutionHR').value;

      let changeServer = {
        idContact: btn.dataset.id,
        cancelResolutionHR,
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(variableName, changeServer);
      if (responce.idContact === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
