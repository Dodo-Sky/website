import * as components from '../../components.js';
import { getServerApi } from '../../apiServer.js';
import { postDataServer } from '../../apiServer.js';

export async function settings_badTrips(title) {
  // создание формы
  const contentSetting = document.querySelector('.contentSetting');
  const titleEl = components.getTagH(4, title);
  contentSetting.append(titleEl);
  const description = components.getTagSpan();
  description.textContent =
    'С согласования с директором установите размер дополнительное время (ExtraTime) по каждой пиццерии';
  contentSetting.append(description);

  const departmentName = localStorage.getItem('departmentName');
  const unitsSettings = await getServerApi('unitsSettings');
  let units = unitsSettings.filter((el) => el.departmentName === departmentName && el.type === 'Пиццерия').sort();

  const form = components.getTagForm('form');
  units.forEach((el) => {
    const divRow = components.getTagDiv('row');
    divRow.classList.add('g-3');
    divRow.classList.add('align-items-center');
    let divCol = components.getTagDiv('col-2');
    let labelEl = components.getTagLabel(el.unitName, el.unitName);
    divCol.append(labelEl);
    divRow.append(divCol);

    divCol = components.getTagDiv('col-1');
    let extraTime = el.programs?.find((program) => program.name === 'Проблемные поездки').extraTime;
    let inputEl = components.getTagInput('number', extraTime);
    inputEl.setAttribute('id', el.unitId);
    divCol.append(inputEl);
    divRow.append(divCol);

    divCol = components.getTagDiv('col-2');
    let spanEl = components.getTagSpan();
    spanEl.classList.add('form-text');
    spanEl.textContent = 'минут';
    divCol.append(spanEl);
    divRow.append(divCol);
    form.append(divRow);
  });

  const btn = components.getTagButton('Сохранить', 'submit');
  btn.disabled = true;
  form.append(btn);
  contentSetting.append(form);
  postServer(form, units, btn);
}

// отправка данных на сервер
function postServer(form, units, btn) {
  let inputs = document.querySelectorAll('.form-control');
  inputs.forEach((input) => {
    input.addEventListener('input', function (e) {
      let unit = units.find((el) => el.unitId === e.target.id);
      let extraTime = unit.programs?.find((program) => program.name === 'Проблемные поездки').extraTime;
      if (e.target.value !== extraTime) btn.disabled = false;
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let changeServer = [];
    inputs.forEach((input) => {
      changeServer.push({ unitId: input.getAttribute('id'), extraTime: input.value });
    });
    let responce = await postDataServer('extraTime', changeServer);
    if (responce) btn.disabled = true;
  });
}