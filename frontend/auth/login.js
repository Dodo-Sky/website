import { loginServerApi } from '../apiServer.js';

export function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export function getUserFioAndUnitName() {
  return `${localStorage.getItem('fio')} | ${localStorage.getItem('unitName')}`
}

export function getUserRole() {
  return localStorage.getItem('role');
}

export function getLoginForm(onSuccess) {
  const container = document.createElement('div');
  container.className = 'container mt-5';

  const row = document.createElement('div');
  row.className = 'row justify-content-center';

  const col = document.createElement('div');
  col.className = 'col-md-6';

  const card = document.createElement('div');
  card.className = 'card';

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header text-center';
  const headerText = document.createElement('h4');
  headerText.textContent = 'Авторизация';
  cardHeader.appendChild(headerText);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const form = document.createElement('form');
  form.id = 'loginForm';

  const loginGroup = document.createElement('div');
  loginGroup.className = 'mb-3';
  const loginLabel = document.createElement('label');
  loginLabel.className = 'form-label';
  loginLabel.setAttribute('for', 'логин');
  loginLabel.textContent = 'Логин';
  const loginInput = document.createElement('input');
  loginInput.className = 'form-control';
  loginInput.id = 'login';
  loginInput.required = true;
  loginInput.placeholder = 'Ваш логин';
  loginInput.autocomplete = 'username';
  loginGroup.appendChild(loginLabel);
  loginGroup.appendChild(loginInput);

  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'mb-3';
  const passwordLabel = document.createElement('label');
  passwordLabel.className = 'form-label';
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.textContent = 'Пароль';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.className = 'form-control';
  passwordInput.autocomplete = 'current-password'
  passwordInput.id = 'password';
  passwordInput.required = true;
  passwordInput.placeholder = 'Ваш пароль';
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  const loginButton = document.createElement('button');
  loginButton.id = 'login-submit-button';
  loginButton.className = 'btn btn-primary w-100';
  loginButton.textContent = 'Войти';

  form.appendChild(loginGroup);
  form.appendChild(passwordGroup);
  form.appendChild(loginButton);
  cardBody.appendChild(form);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  col.appendChild(card);
  row.appendChild(col);
  container.appendChild(row);

  document.body.appendChild(container);

  loginButton.addEventListener('click', async function (e) {
    e.preventDefault();
    const login = loginInput.value;
    const password = passwordInput.value;
    if (!login) {
      alert('Введите логин');
      return;
    }
    if (!password) {
      alert('Введите пароль');
      return;
    }
    loginServerApi(login, password, onSuccess);
  });
  return container;
}
