import * as components from '../../components.js';
import { getServerApi } from '../../apiServer.js';
import { postDataServer } from '../../apiServer.js';
// import tippy from 'tippy.js';


export async function settings_badTrips(title) {
  // создание формы
  const contentSetting = document.querySelector('.contentSetting');
  const titleEl = components.getTagH(4, title);
  contentSetting.append(titleEl);
  const form = components.getTagForm('form');
  contentSetting.append(form);

  const departmentName = localStorage.getItem('departmentName');
  const unitsSettings = await getServerApi('unitsSettings');
  let units = unitsSettings.filter((el) => el.departmentName === departmentName && el.type === 'Пиццерия').sort();

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  form.append(tableEl);
  const captionEl = components.getTagCaption('Настройки программы Проблемные поездки');
  tableEl.append(captionEl);

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();
  theadEl.append(trEl);

  let thEl = components.getTagTH('Пиццерия');
  trEl.append(thEl);
  thEl = components.getTagTH('extraTime');
  thEl.setAttribute ('data-bs-toggle', 'tooltip');
  thEl.setAttribute ('data-bs-placement', 'top');
  thEl.setAttribute ('data-bs-custom-class', 'ustom-tooltip');
  thEl.setAttribute ('data-bs-title', 'This top tooltip is themed via CSS variables.');

  trEl.append(thEl);
  thEl = components.getTagTH('Лимит заказов за поездку');
  trEl.append(thEl);
  // thEl = components.getTagTH('Учитывать 2 заказа да поездку?');
  // trEl.append(thEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  for (const el of units) {
    if (!el.programs) continue;
    const badTrips = el.programs.find((programm) => programm.name === 'Проблемные поездки');

    trEl = components.getTagTR();
    trEl.classList.add('trEl');
    trEl.setAttribute('id', el.unitId);
    tBody.append(trEl);

    const unitName = components.getTagTD(el.unitName);
    unitName.classList.add('unitName');
    trEl.append(unitName);

    const extraTime = components.getTagTD();
    const inputExtraTime = components.getTagInput('number', badTrips.extraTime);
    inputExtraTime.classList.add('inputExtraTime');
    inputExtraTime.setAttribute('id', el.unitId);
    extraTime.append(inputExtraTime);
    trEl.append(extraTime);

    const maxTripOrdersCount = components.getTagTD();
    const inputMaxTripOrdersCount = components.getTagInput('number', badTrips.maxTripOrdersCount);
    inputMaxTripOrdersCount.classList.add('inputMaxTripOrdersCount');
    inputMaxTripOrdersCount.setAttribute('id', el.unitId);
    maxTripOrdersCount.append(inputMaxTripOrdersCount);
    trEl.append(maxTripOrdersCount);

    // const twoTripOrdersIsActive = components.getTagTD();
    // const inputCheckBox = components.getTagInput_checkbox('inputCheckBox');
    // inputCheckBox.classList.add('inputCheckBox');
    // if (badTrips.twoTripOrdersIsActive) inputCheckBox.checked = true;
    // inputCheckBox.setAttribute('id', el.unitId);
    // twoTripOrdersIsActive.append(inputCheckBox);
    // trEl.append(twoTripOrdersIsActive);
  }
  tableEl.append(theadEl, tBody);

  const btn = components.getTagButton('Сохранить', 'submit');
  btn.disabled = true;
  form.append(btn);
  postServer(form, units, btn);
}

// отправка данных на сервер
function postServer(form, units, btn) {
  // Включение / выключение кнопки сохранить
  const inputExtraTime = document.querySelectorAll('.inputExtraTime');
  inputExtraTime.forEach((input) => {
    input.addEventListener('input', function (e) {
      let unit = units.find((el) => el.unitId === e.target.id);
      let extraTime = unit.programs?.find((program) => program.name === 'Проблемные поездки').extraTime;
      if (+e.target.value !== extraTime) btn.disabled = false;
      if (+e.target.value == extraTime) btn.disabled = true;
    });
  });

  const inputMaxTripOrdersCount = document.querySelectorAll('.inputMaxTripOrdersCount');
  inputMaxTripOrdersCount.forEach((input) => {
    input.addEventListener('input', function (e) {
      let unit = units.find((el) => el.unitId === e.target.id);
      let maxTripOrdersCount = unit.programs?.find(
        (program) => program.name === 'Проблемные поездки',
      ).maxTripOrdersCount;
      if (+e.target.value !== maxTripOrdersCount) btn.disabled = false;
      if (+e.target.value == maxTripOrdersCount) btn.disabled = true;
    });
  });

  // const inputCheckBox = document.querySelectorAll('.inputCheckBox');
  // inputCheckBox.forEach((input) => {
  //   input.addEventListener('input', function (e) {
  //     let unit = units.find((el) => el.unitId === e.target.id);
  //     let twoTripOrdersIsActive = unit.programs?.find(
  //       (program) => program.name === 'Проблемные поездки',
  //     ).twoTripOrdersIsActive;
  //     if (e.target.checked !== twoTripOrdersIsActive) btn.disabled = false;
  //     if (e.target.checked == twoTripOrdersIsActive) btn.disabled = true;
  //   });
  // });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const trEls = document.querySelectorAll('.trEl');
    let changeServer = [];
    for (const el of trEls) {
      const unit = units.find((elem) => elem.unitId === el.id);
      if (!unit.programs) continue;
      const badTrip = unit.programs.find((el) => el.name == 'Проблемные поездки');

      const extraTimeEl = el.querySelector('.inputExtraTime');
      const maxTripOrdersCountEl = el.querySelector('.inputMaxTripOrdersCount');
      // const twoTripOrdersIsActiveEl = el.querySelector('.inputCheckBox');
      if (
        +extraTimeEl.value !== badTrip.extraTime ||
        +maxTripOrdersCountEl.value !== badTrip.maxTripOrdersCount
        //  || twoTripOrdersIsActiveEl.checked !== badTrip.twoTripOrdersIsActive
      ) {
        changeServer.push({
          unitId: unit.unitId,
          unitName: unit.unitName,
          extraTime: +extraTimeEl.value,
          maxTripOrdersCount: +maxTripOrdersCountEl.value,
          // twoTripOrdersIsActive: twoTripOrdersIsActiveEl.checked,
        });
      }
    }
    console.log(changeServer);
    let responce = await postDataServer('extraTime', changeServer);
    console.log(responce);
    if (responce) btn.disabled = true;
  });
}
