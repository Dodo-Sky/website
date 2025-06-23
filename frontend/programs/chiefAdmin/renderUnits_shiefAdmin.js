import { getServerApi, postDataServer, getDataServer } from '../../apiServer.js';
import * as components from '../../components.js';

export async function renderUnits() {
  const table_admin = document.querySelector('.table-admin');

  table_admin.innerHTML = `
  <div class="spinner-border" role="status">
  <span class="visually-hidden">Загрузка...</span>
  </div>`;

  let active_programm = await getDataServer('get_active_programm');
  let departments = await getDataServer('get_departments');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  table_admin.innerHTML = '';

  let rowUnits = components.getTagDiv('row');
  const units = components.getTagDiv('col-auto');
  units.setAttribute('id', 'units');
  rowUnits.append(units);
  table_admin.append(rowUnits);
  getListUnits(departments);

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  table_admin.append(tableEl);

  let start_programm = active_programm.filter(
    (el) => el.department_id === active_programm[0].department_id,
  );

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    let change_unit = active_programm.filter(
      (el) => el.department_name === e.target.value,
    );
    console.log(change_unit);
    render(departments, tableEl, change_unit);
  });
  render(departments, tableEl, start_programm);
}

function render(departments, tableEl, programm_arr) {
  tableEl.innerHTML = '';
  const captionEl = components.getTagCaption(
    'Список подраздений по каждому департаменту',
  );

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  [
    'Наименование',
    'Тип',
    'Статус подразделения',
    'Наименование программы',
    'Статус программы',
  ].forEach((el) => {
    let thEl = components.getTagTH(el);
    trEl.append(thEl);
  });
  theadEl.append(trEl);
  
  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  programm_arr.forEach((program) => {
    let trEl = components.getTagTR();
    tBody.append(trEl);

    let unittNameEl = components.getTagTD(program.unit_name);
    unittNameEl.classList.add('unittName');
    trEl.append(unittNameEl);

    let typeEl = components.getTagTD(program.type);
    typeEl.classList.add('type');
    trEl.append(typeEl);

    let statusEl = components.getTagTD(program.is_active_unit);
    statusEl.classList.add('status');
    trEl.append(statusEl);

    let name_programm = components.getTagTD(program.name_program);
    statusEl.classList.add('name_programm');
    trEl.append(name_programm);

    let checkBox = components.getTagInput_checkbox(
      `${program.program_id}:${program.unit_id}`,
    );
    checkBox.classList = 'form-check form-switch form-check-input';
    program.is_active ? (checkBox.checked = true) : (checkBox.checked = false);
    let programEl = components.getTagTD();
    programEl.append(checkBox);
    trEl.append(programEl);
  });

  tableEl.append(captionEl, theadEl, tBody);
  //createUnit();
  editUnit();
}

function editUnit() {
  const checkAll = document.querySelectorAll('.form-check');
  console.log(checkAll);
  checkAll.forEach((el) => {
    el.addEventListener('change', async () => {
      const [program_id, unit_id] = el.id.split(':');
      const is_active = el.checked ? true : false;
      const payload = { unit_id, program_id, is_active };
      const responce = await postDataServer('edit_program_active', payload);
    });
  });
}

function getListUnits(departments) {
  const select = components.getTagSelect();
  select.classList.add('selectUnit');
  departments.forEach((unit) => {
    const option = components.getTagOption(unit.name, unit.name);
    select.append(option);
  });
  const unitsEl = document.getElementById('units');
  unitsEl.append(select);
}

//const unitsSettings = await getServerApi('unitsSettings');
// let departments = await getServerApi('departments');
//   departments = departments.sort((a, b) => a.departmentName.localeCompare(b.departmentName));

//   let spiner = document.querySelector('.spinner-border');
//   spiner.style.display = 'none';

//   table_admin.innerHTML = '';

//   let rowUnits = components.getTagDiv('row');
//   const units = components.getTagDiv('col-auto');
//   units.setAttribute('id', 'units');
//   rowUnits.append(units);
//   table_admin.append(rowUnits);
//   getListUnits(departments);

//   const tableEl = components.getTagTable();
//   tableEl.classList.add('table-sm');
//   table_admin.append(tableEl);

//   const departmentName = departments[0].departmentName;

//   document.querySelector('.selectUnit').addEventListener('change', function (e) {
//     render(e.target.value, departments, tableEl, unitsSettings);
//   });
//   render(departmentName, departments, tableEl, unitsSettings);
// }

// function render(departmentName, departments, tableEl, unitsSettings) {
//   tableEl.innerHTML = '';
//   const captionEl = components.getTagCaption('Список подраздений по каждому департаменту');

//   // Заголовок таблицы THead
//   const theadEl = components.getTagTHead();
//   theadEl.classList.add('sticky-top');
//   let trEl = components.getTagTR();

//   let thEl = components.getTagTH('Наименование');
//   trEl.append(thEl);

//   thEl = components.getTagTH('Тип');
//   trEl.append(thEl);

//   thEl = components.getTagTH('Статус подразделения');
//   trEl.append(thEl);

//   let programs = unitsSettings.find((el) => el.departmentName === 'Тюмень').programs;
//   if (programs) {
//     programs.forEach((program) => {
//       thEl = components.getTagTH(program.name);
//       trEl.append(thEl);
//     });
//   }

//   theadEl.append(trEl);
//   // Тело таблицы tBody
//   const tBody = components.getTagTBody();
//   tBody.classList.add('tBody');
//   let { units } = departments.find((el) => el.departmentName === departmentName);
//   units = units.sort();
//   console.log(units);
//   units.forEach((unitName) => {
//     const unit = unitsSettings.find((el) => el.unitName === unitName);

//     let trEl = components.getTagTR();
//     tBody.append(trEl);
//     let unittNameEl = components.getTagTD(unitName);
//     unittNameEl.classList.add('unittName');
//     trEl.append(unittNameEl);

//     let typeEl = components.getTagTD(unit?.type);
//     typeEl.classList.add('type');
//     trEl.append(typeEl);

//     const status = unit ? (unit.isActive ? 'Active' : 'Disabled') : 'Нет подразделения';

//     let statusEl = components.getTagTD(status);
//     statusEl.classList.add('status');
//     trEl.append(statusEl);

//     let programs = unit?.programs;
//     if (programs) {
//       programs.forEach((program) => {
//         let checkBox = components.getTagInput_checkbox(`${program.name}:${unit.unitId}`);
//         checkBox.classList = 'form-check form-switch form-check-input';
//         program.isActive ? (checkBox.checked = true) : (checkBox.checked = false);
//         let programEl = components.getTagTD();
//         programEl.append(checkBox);
//         trEl.append(programEl);
//       });
//     }

//     if (!unit) {
//       let tdEl = components.getTagTD();
//       let btnEl = components.getTagButton('Добавить');
//       btnEl.classList.add('createUnit');
//       btnEl.setAttribute('data-id', `${departmentName}:${unitName}`);
//       tdEl.append(btnEl);
//       trEl.append(tdEl);
//     }
//   });
//   tableEl.append(captionEl, theadEl, tBody);
//   createUnit();
//   editUnit(tBody);
// }

// function editUnit(tBody) {
//   const checkAll = tBody.querySelectorAll('.form-check');
//   checkAll.forEach((el) => {
//     el.addEventListener('change', async () => {
//       const [name, unitId] = el.id.split(':');
//       const isActive = el.checked ? true : false;
//       const payload = { unitId, name, isActive };
//       const responce = await postDataServer('editUnitsettings', payload);
//       if (responce.unitId !== unitId) {
//         alert('ОШибка');
//       }
//     });
//   });
// }

// function createUnit() {
//   const createUnits = document.querySelectorAll('.createUnit');
//   createUnits.forEach((createUnit) => {
//     createUnit.addEventListener('click', async function (e) {
//       const [departmentName, unitName] = e.target.dataset.id.split(':');
//       const payload = { departmentName, unitName };
//       const responce = await postDataServer('newUnit', payload);
//       if (responce.departmentName === departmentName) {
//         createUnit.disabled = true;
//       }
//     });
//   });
// }

// function getListUnits(departments) {
//   let departmentName = [];
//   departments.forEach((department) => {
//     if (!departmentName.includes(department.departmentName)) {
//       departmentName.push(department.departmentName);
//     }
//   });
//   departmentName = departmentName.sort();

//   const select = components.getTagSelect();
//   select.classList.add('selectUnit');
//   departmentName.forEach((unit) => {
//     const option = components.getTagOption(unit, unit);
//     select.append(option);
//   });

//   const unitsEl = document.getElementById('units');
//   unitsEl.append(select);
//}
