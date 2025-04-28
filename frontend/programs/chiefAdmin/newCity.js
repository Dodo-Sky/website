import { getServerApi, postDataServer } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderСity } from './renderSity_shiefAdmin.js';

export async function addNewCity(table_admin, btnUpdate, tableEl) {
  btnUpdate.style.display = 'none';
  tableEl.style.display = 'none';

  // спинер загрузки
  let spinnerDiv = components.getTagDiv('spinner');
  table_admin.append(spinnerDiv);
  spinnerDiv.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const dataUnit = await getServerApi('dataUnit');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  // форма
  const formEl = components.getTagForm('form');
  let divRowEl = components.getTagDiv('mb-3');
  divRowEl.classList.add('row');
  formEl.append(divRowEl);

  let arrCity = [
    ...new Set(
      dataUnit
        .filter((el) => el?.Type === 1)
        .map((el) => {
          let name = el.Name;
          let lastIndexOf = name.lastIndexOf('-');
          return name.slice(0, lastIndexOf);
        }),
    ),
  ];

  let labelEl = components.getTagLabel('arrCity', 'Укажите название города');
  labelEl.classList = 'col-sm-3 col-form-label';
  let divCol = components.getTagDiv('col-sm-5');
  divRowEl.append(labelEl, divCol);

  let inputCity = document.createElement('input');
  inputCity.classList.add('form-control');
  inputCity.setAttribute('list', 'datalistOptions');
  inputCity.setAttribute('id', 'arrCity');
  inputCity.setAttribute('placeholder', 'Введите для поиска...');
  inputCity.required = true;
  let datalist = components.getTagDatalist();
  datalist.setAttribute('id', 'datalistOptions');
  arrCity.forEach((el) => {
    let option = components.getTagOption('', el);
    datalist.append(option);
  });
  divCol.append(inputCity, datalist);

  // Администратор  - логин
  divRowEl = components.getTagDiv('mb-3');
  divRowEl.classList.add('row');
  formEl.append(divRowEl);
  labelEl = components.getTagLabel('login', 'Логин администратора города');
  labelEl.classList = 'col-sm-3 col-form-label';
  divCol = components.getTagDiv('col-sm-5');
  divRowEl.append(labelEl, divCol);
  let inputLogin = document.createElement('input');
  inputLogin.classList.add('form-control');
  inputLogin.setAttribute('id', 'login');
  inputLogin.setAttribute('placeholder', 'логин');
  inputLogin.required = true;
  divCol.append(inputLogin);

  // Администратор  - пароль
  divRowEl = components.getTagDiv('mb-3');
  divRowEl.classList.add('row');
  formEl.append(divRowEl);
  labelEl = components.getTagLabel('password', 'Пароль администратора города');
  labelEl.classList = 'col-sm-3 col-form-label';
  divCol = components.getTagDiv('col-sm-5');
  divRowEl.append(labelEl, divCol);
  let inputPassword = document.createElement('input');
  inputPassword.classList.add('form-control');
  inputPassword.setAttribute('id', 'password');
  inputPassword.setAttribute('placeholder', 'пароль');
  inputPassword.required = true;
  divCol.append(inputPassword);

  let submit = components.getTagButton('Добавить', 'submit');
  formEl.append(submit);

  table_admin.prepend(formEl);

  formEl.addEventListener('submit', (event) => addDataForm(event, dataUnit));
}

async function addDataForm(e, dataUnit) {
  e.preventDefault();
  const formEl = document.querySelector('#form');
  const arrCity = document.querySelector('#arrCity');
  const login = document.querySelector('#login');
  const password = document.querySelector('#password');

  let {DepartmentUUId} = dataUnit.find (el => el.Name.includes (arrCity.value));
  console.log(DepartmentUUId);

  const dataToServer = {
    DepartmentUUId,
    loginAdm: login.value,
    passwordAdm: password.value,
  };

  let responce = await postDataServer('newCity', dataToServer);
  if (responce.loginAdm === login.value) {
    formEl.reset();
    formEl.style.display = 'none';
    renderСity();
  }
}