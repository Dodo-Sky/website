import * as components from '../../components.js';
import {postDataServer, putDataServer} from '../../apiServer.js';
import {getTagInput_checkbox} from "../../components.js";

const getBadTripsSettings = async (departmentName) => {
  return await postDataServer("setting_bad_trips", { departmentName });
}

const editBadTripsSetting = async (setting) => {
  return await putDataServer("setting_bad_trips", { ...setting });
}

const createForm = (title) => {
  const contentSetting = document.querySelector('.contentSetting');
  const titleEl = components.getTagH(4, title);
  const form = components.getTagForm('settings-bad-trips-form');

  contentSetting.append(titleEl);
  contentSetting.append(form);

  return form;
}

const createHeader = (tableDom) => {
  const theadDom = components.getTagTHead();
  theadDom.classList.add('sticky-top');
  tableDom.append(theadDom);

  const theadTrDom = components.getTagTR();
  theadDom.append(theadTrDom);

  const thUnitName = components.getTagTH("Пиццерия")
  theadTrDom.append(thUnitName);

  const thExtraTime = components.getTagTH("extraTime")
  theadTrDom.append(thExtraTime);

  const thBicycle = components.getTagTH("Разрешено использование велосипеда?")
  theadTrDom.append(thBicycle);

  const thLongOnFoot = components.getTagTH("Контролируем дальние походы?")
  theadTrDom.append(thLongOnFoot);

  const thLongOnFootTime = components.getTagTH("Время дальнего похода")
  theadTrDom.append(thLongOnFootTime);

  const thControl = components.getTagTH("Управление")
  theadTrDom.append(thControl);
}

const checkDisableSubmitBtn = (setting) => {
  const submitBtn = document.querySelector(`#button_${setting.unit_id}`);
  const inputExtraTimeValue = document.querySelector(`#extra_time_${setting.unit_id}`).value;
  const inputBicycleValue = document.querySelector(`#bicycle_${setting.unit_id}`).checked;
  const inputLongOnFootValue = document.querySelector(`#long_on_foot_${setting.unit_id}`).checked;
  const inputLongOnFootTimeValue = document.querySelector(`#long_on_foot_time_${setting.unit_id}`).value;
  const disabled = setting.extra_time.toString() === inputExtraTimeValue
      && setting.bicycle === inputBicycleValue
      && setting.long_on_foot === inputLongOnFootValue
      && setting.long_on_foot_time.toString() === inputLongOnFootTimeValue

  console.group()
  console.log("setting", setting)
  console.log("inputExtraTimeValue", inputExtraTimeValue)
  console.log("inputBicycleValue", inputBicycleValue)
  console.log("inputLongOnFootValue", inputLongOnFootValue)
  console.log("inputLongOnFootTimeValue", inputLongOnFootTimeValue)
  console.log("disabled", disabled);
  console.groupEnd();

  submitBtn.disabled = disabled
}

const createBody = (tableDom, settingList) => {
  const tbodyDom = components.getTagTBody();
  tableDom.append(tbodyDom);

  console.log("settingList", settingList);

  for (const setting of settingList) {
    const trDom = components.getTagTR()
    trDom.id = setting.unit_id;
    tbodyDom.appendChild(trDom);

    const tdUnitNameDom = components.getTagTD(setting.unit_name)
    trDom.append(tdUnitNameDom)

    const tdExtraTimeDom = components.getTagTD()
    const inputExtraTime = components.getTagInput('number', setting.extra_time);
    inputExtraTime.id = `extra_time_${setting.unit_id}`
    inputExtraTime.value = setting.extra_time
    inputExtraTime.addEventListener('input', () => {
      checkDisableSubmitBtn(setting);
    })
    tdExtraTimeDom.append(inputExtraTime)
    trDom.append(tdExtraTimeDom)

    const tdBicycleDom = components.getTagTD()
    const inputBicycleCheckbox = components.getTagInput_checkbox(`bicycle_${setting.unit_id}`);
    inputBicycleCheckbox.checked = setting.bicycle
    inputBicycleCheckbox.addEventListener('change', () => {
      checkDisableSubmitBtn(setting);
    })
    tdBicycleDom.append(inputBicycleCheckbox)
    trDom.append(tdBicycleDom)

    const tdLongOnFootDom = components.getTagTD()
    const inputLongOnFootCheckbox = components.getTagInput_checkbox(`long_on_foot_${setting.unit_id}`);
    inputLongOnFootCheckbox.checked = setting.long_on_foot
    inputLongOnFootCheckbox.addEventListener('change', (e) => {
      checkDisableSubmitBtn(setting);
      inputLongOnFootTime.disabled = !e.target.checked;
    })
    tdLongOnFootDom.append(inputLongOnFootCheckbox)
    trDom.append(tdLongOnFootDom)

    const tdLongOnFootTimeDom = components.getTagTD()
    const inputLongOnFootTime = components.getTagInput('number', setting.long_on_foot_time);
    inputLongOnFootTime.id = `long_on_foot_time_${setting.unit_id}`
    inputLongOnFootTime.value = setting.long_on_foot_time
    inputLongOnFootTime.disabled = !setting.long_on_foot
    inputLongOnFootTime.addEventListener('input', () => {
      checkDisableSubmitBtn(setting);
    })
    tdLongOnFootTimeDom.append(inputLongOnFootTime)
    trDom.append(tdLongOnFootTimeDom)

    const tdControl = components.getTagTD()
    const btn = components.getTagButton('Сохранить', 'submit');
    btn.id = `button_${setting.unit_id}`;
    btn.dataset.unit_id = setting.unit_id;
    btn.disabled = true;
    tdControl.append(btn);
    btn.addEventListener('click', async () => {
      await editBadTripsSetting({
        unit_id: setting.unit_id,
        bicycle: inputBicycleCheckbox.checked,
        extra_time: inputExtraTime.value,
        long_on_foot: inputLongOnFootCheckbox.checked,
        long_on_foot_time: inputLongOnFootTime.value,
      });

      btn.disabled = true;
    })
    trDom.append(tdControl);
  }
}

const createTable = (form, settingList) => {
  const tableDom = components.getTagTable()
  tableDom.classList.add("table-sm");
  const captionDom = components.getTagCaption('Настройки программы Проблемные поездки');
  tableDom.append(captionDom);

  createHeader(tableDom)
  createBody(tableDom, settingList)

  form.appendChild(tableDom);
}

export async function settingsBadTrips(title) {
  const departmentName = localStorage.getItem('departmentName');

  const badTripsSettings = await getBadTripsSettings(departmentName);
  console.log("badTrips", badTripsSettings);

  const form = createForm(title)
  await createTable(form, badTripsSettings)
}
