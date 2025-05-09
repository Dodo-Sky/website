import { postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';

export async function edit(selectedUnit) {
  const mainContent = document.querySelector('#mainContent');
  mainContent.style.display = 'none';
  const editContent = document.querySelector('#editUnitsSettings');
  editContent.style.display = 'block';
  editContent.innerHTML = '';

  const formEl = components.getTagForm('form');
  const divRowEl = components.getTagDiv('mb-3');
  divRowEl.classList.add('row');
  let hEl = components.getTagH(5, 'Контактные данные');

  formEl.append(divRowEl);
  const divElId = components.getTagDiv('col-md-3');
  divElId.textContent = 'ID в телеграмм';
  const divElPosizion = components.getTagDiv('col-md-4');
  divElPosizion.textContent = 'Функция';
  const divElfio = components.getTagDiv('col-md-5');
  divElfio.textContent = 'ФИО';

  selectedUnit.idTelegramm.forEach((el) => {
    let nameFunctionInput = components.getTagInput('text', el.nameFunction);
    nameFunctionInput.classList.add('mb-1');
    nameFunctionInput.disabled = true;
    divElPosizion.append(nameFunctionInput);

    let idInput = components.getTagInput('number', el.id);
    idInput.classList.add('mb-1');
    idInput.classList.add('idInput');
    idInput.setAttribute('data-function', el.nameFunction);
    divElId.append(idInput);

    let fioInput = components.getTagInput('text', el.fio);
    fioInput.classList.add('mb-1');
    fioInput.classList.add('fioInput');
    fioInput.setAttribute('data-function', el.nameFunction);
    divElfio.append(fioInput);
  });

  editContent.append(formEl);
  divRowEl.append(hEl, divElPosizion, divElId, divElfio);

  let btn = components.getTagButton('Внести изменения', 'submit');
  btn.setAttribute('id', 'submit');
  formEl.append(btn);

  // отправка формы на сервер
  formEl.addEventListener('submit', async function (e) {
    e.preventDefault();
    // формирование idTelegramm
    let idTelegramm = [];
    const idInputs = document.querySelectorAll('.idInput');
    const fioInputs = document.querySelectorAll('.fioInput');
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
    let responce = await postDataServer('unitsSettings', dataToServer);
    if (responce) {
      alert('Изменения сохранены');
    }
  });
}
