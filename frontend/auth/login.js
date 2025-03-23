import { loginServerApi } from '../apiServer.js';
import {
  getTagButton,
  getTagDiv,
  getTagForm,
  getTagH,
  getTagInput,
  getTagLabel,
} from '../components.js';

export function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export function getUserFioAndUnitName() {
  return `${localStorage.getItem('fio')} | ${localStorage.getItem('unitName')}`;
}

export function getUserRole() {
  return localStorage.getItem('role');
}

export function getLoginForm(onSuccess) {
  const content = document.querySelector('#content');

  const row = getTagDiv('row');
  row.classList.add('justify-content-center');

  const col = getTagDiv('col-md-6');
  const card = getTagDiv('card');

  const cardHeader = getTagDiv('card-header');
  cardHeader.classList.add('text-center');

  const headerText = getTagH(4, 'Авторизация');
  cardHeader.append(headerText);

  const cardBody = getTagDiv('card-body');
  const form = getTagForm('loginForm');
  const loginGroup = getTagDiv('mb-3');
  const loginLabel = getTagLabel('login', 'Логин');

  const loginInput = getTagInput();
  loginInput.className = 'form-control';
  loginInput.id = 'login';
  loginInput.required = true;
  loginInput.placeholder = 'Ваш логин';
  loginInput.autocomplete = 'username';
  loginGroup.append(loginLabel, loginInput);

  const passwordGroup = getTagDiv('mb-3');
  const passwordLabel = getTagLabel('password', 'Пароль');

  const passwordInput = getTagInput();
  passwordInput.type = 'password';
  passwordInput.className = 'form-control';
  passwordInput.autocomplete = 'current-password';
  passwordInput.id = 'password';
  passwordInput.required = true;
  passwordInput.placeholder = 'Ваш пароль';
  passwordGroup.append(passwordLabel, passwordInput);

  const loginButton = getTagButton('Войти', 'submit');
  loginButton.id = 'login-submit-button';
  loginButton.classList.add('w-100');

  form.append(loginGroup, passwordGroup, loginButton);
  cardBody.appendChild(form);
  card.append(cardHeader, cardBody);
  col.appendChild(card);
  row.appendChild(col);
  content.appendChild(row);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const login = loginInput.value;
    const password = passwordInput.value;
    loginServerApi(login, password, onSuccess);
  });

  // loginButton.addEventListener('click', async function (e) {
  //   e.preventDefault();
  //   const login = loginInput.value;
  //   const password = passwordInput.value;
  //   if (!login) {
  //     alert('Введите логин');
  //     return;
  //   }
  //   if (!password) {
  //     alert('Введите пароль');
  //     return;
  //   }
  //   loginServerApi (login, password, onSuccess);
  // });
}
