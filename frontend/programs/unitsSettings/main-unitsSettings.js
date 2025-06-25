import { getServerApi, postDataServer } from '../../apiServer.js';
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

  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  const departmentName = localStorage.getItem('departmentName');
  let unitsSettings = await postDataServer('get_units', { payload: departmentName });

  const units = components.getTagDiv('col-md-3');
  units.setAttribute('id', 'units');
  content.append(units);
  getListUnits(unitsSettings, content);
}

async function getListUnits(unitsSettings, content) {
  let unitsName = unitsSettings.map((el) => el.name);
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

  await render(unitsSettings[0]);

  select.addEventListener('change', async function (e) {
    let selectedUnit = unitsSettings.find((el) => el.name === e.target.value);
    await render(selectedUnit);
  });
}
