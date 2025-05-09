import { getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { render } from './render-unitsSettings.js';

export async function main_unitsSettings() {
  const content = document.querySelector('.contentSetting');
  content.innerHTML = '';

  // спинер
  content.innerHTML = `
  <div class="spinner-border" role="status">
  <span class="visually-hidden">Загрузка...</span>
  </div>`;

  let unitsSettings = await getServerApi('unitsSettings');

  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const departmentName = localStorage.getItem('departmentName');
  unitsSettings = unitsSettings.filter((el) => el.departmentName === departmentName);
  unitsSettings.sort((a, b) => a.unitName.localeCompare(b.unitName));

  const units = components.getTagDiv('col-md-3');
  units.setAttribute('id', 'units');
  content.append(units);
  getListUnits(unitsSettings, content);
}

function getListUnits(unitsSettings, content) {
  let unitsName = [];
  unitsSettings.forEach((units) => {
    if (!unitsName.includes(units.unitName)) {
      unitsName.push(units.unitName);
    }
  });
  unitsName = unitsName.sort();
  const select = components.getTagSelect();
  select.classList.add('selectUnit');
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    select.append(option);
  });
  const unitsEl = document.getElementById('units');
  unitsEl.append(select);

  const mainContent = components.getTagDiv('col-auto');
  mainContent.setAttribute('id', 'mainContent');
  content.append(mainContent);

  const edit = components.getTagDiv('col-auto');
  edit.setAttribute('id', 'editUnitsSettings');
  content.append(edit);

  startRender(unitsSettings, unitsName);
}

function startRender(unitsSettings, unitsName) {
  let selectedUnit = unitsSettings.find((el) => el.unitName === unitsName[0]);
  render(selectedUnit);

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    let selectedUnit = unitsSettings.find((el) => el.unitName === e.target.value);
    render(selectedUnit);
  });
}
