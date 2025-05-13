import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';

export async function edit(selectedUnit) {
  const mainContent = document.querySelector('#mainContent');
  mainContent.style.display = 'none';
  const editContent = document.querySelector('#editUnitsSettings');
  editContent.style.display = 'block';
  editContent.innerHTML = '';

  let hEl = components.getTagH(5, 'Контактные данные');
  editContent.append(hEl);

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  editContent.append(tableEl);

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();
  theadEl.append(trEl);

  let thEl = components.getTagTH('Функция');
  trEl.append(thEl);
  thEl = components.getTagTH('ID в телеграмм');
  trEl.append(thEl);
  thEl = components.getTagTH('ФИО');
  trEl.append(thEl);
  thEl = components.getTagTH('Проверка связи');
  trEl.append(thEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  selectedUnit.idTelegramm.forEach((el) => {
    trEl = components.getTagTR();
    tBody.append(trEl);
    const nameFunction = components.getTagTD(el.nameFunction);
    trEl.append(nameFunction);

    const id = components.getTagTD();
    const inputId = components.getTagInput('number', el.id);
    inputId.classList.add('inputId');
    inputId.setAttribute('data-function', `${el.nameFunction}`);
    id.append(inputId);
    trEl.append(id);

    const fio = components.getTagTD();
    const inputFio = components.getTagInput('text', el.fio);
    inputFio.classList.add('inputFio');
    inputFio.setAttribute('data-function', `${el.nameFunction}`);
    fio.append(inputFio);
    trEl.append(fio);

    // Добавление функционала по проверке связи с ботом в ТГ
    let btnEl = components.getTagTD();
    const btnHR = components.getTagButton('HR_bot');
    trEl.append(btnEl);
    btnHR.classList = 'btn btn-outline-primary btnHR me-2';
    btnHR.setAttribute('data-id', `${el.id}`);
    if (el.nameFunction === 'Управляющий' || el.nameFunction === 'Графист по кухне') btnEl.append(btnHR);

    const btnDelivery = components.getTagButton('Delivery_bot');
    trEl.append(btnEl);
    btnDelivery.classList = 'btn btn-outline-primary btnDelivery me-2';
    btnDelivery.setAttribute('data-id', `${el.id}`);
    if (el.nameFunction === 'Управляющий' || el.nameFunction === 'Графист по курьерам') btnEl.append(btnDelivery);

    const btnSupply = components.getTagButton('Supply_bot');
    trEl.append(btnEl);
    btnSupply.classList = 'btn btn-outline-primary btnSupply me-2';
    btnSupply.setAttribute('data-id', `${el.id}`);
    if (el.nameFunction === 'Групповой чат по сырью') btnEl.append(btnSupply);
  });
  tableEl.append(theadEl, tBody);

  const btnSubmit = components.getTagButton('Сохранить');
  btnSubmit.classList.add('btnSubmit');
  btnSubmit.setAttribute('data-id', `${selectedUnit.unitId}`);
  editContent.append(btnSubmit);

  // тестовые сообщение о проверке связи
  const btnAllHR = document.querySelectorAll('.btnHR');
  btnAllHR.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const chatId = e.target.dataset.id;
      const content = 'Все отлично проверка связи прошла успешно';
      const responce = await postDataServer('testHR_bot', { chatId, content });
      if (responce) {
        alert('Сообщение отправлено боту. Проверьте его наличие в телеграмм');
      }
    });
  });

  const btnAllDel = document.querySelectorAll('.btnDelivery');
  btnAllDel.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const chatId = e.target.dataset.id;
      const content = 'Все отлично проверка связи прошла успешно';
      const responce = await postDataServer('testDelidery_bot', { chatId, content });
      console.log(responce);
      if (responce) {
        alert('Сообщение отправлено боту. Проверьте его наличие в телеграмм');
      }
    });
  });

  const btnAllSupply = document.querySelectorAll('.btnSupply');
  btnAllSupply.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const chatId = e.target.dataset.id;
      const content = 'Все отлично проверка связи прошла успешно';
      const responce = await postDataServer('testSupply_bot', { chatId, content });
      if (responce) {
        alert('Сообщение отправлено боту. Проверьте его наличие в телеграмм');
      }
    });
  });

  btnSubmit.addEventListener('click', async function (e) {
    // формирование idTelegramm
    const idTelegramm = [];
    const idInputs = document.querySelectorAll('.inputId');
    const fioInputs = document.querySelectorAll('.inputFio');
    for (const idInput of idInputs) {
      let fio;
      for (const fioInput of fioInputs) {
        if (fioInput.dataset.function !== idInput.dataset.function) continue;
        fio = fioInput.value;
      }
      idTelegramm.push({
        nameFunction: idInput.dataset.function,
        id: +idInput.value,
        fio,
      });
    }

    const dataToServer = { idTelegramm, unitId: selectedUnit.unitId };
    console.log(dataToServer);
    const responce = await postDataServer('unitsSettings', dataToServer);
    if (responce) {
      alert('Изменения сохранены');
    } else {
      alert (`Сообщение ${idTelegramm} не было отправлено`)
    }
  });
}
