import { createUser, updateUser, deleteUserByLogin, getUsers } from '../../apiServer.js';
import * as components from '../../components.js';

export async function renderUsersTable (usersData) {
  const tableContent = document.querySelector('#content');
  tableContent.innerHTML = '';

  // Кнопка "Добавить пользователя"
  const addUserBtn = components.getTagButton('Добавить пользователя');
  addUserBtn.classList.add('btn-primary', 'mt-3');
  addUserBtn.setAttribute('data-bs-toggle', 'modal');
  addUserBtn.setAttribute('data-bs-target', '#addUserModal');
  tableContent.append(addUserBtn);

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  tableContent.append(tableEl);
  const captionEl = components.getTagCaption('Список пользователей');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH('Логин');
  trEl.append(thEl);

  thEl = components.getTagTH('ФИО');
  trEl.append(thEl);

  thEl = components.getTagTH('Пароль');
  trEl.append(thEl);

  thEl = components.getTagTH('Роль');
  trEl.append(thEl);

  thEl = components.getTagTH('Подразделение');
  trEl.append(thEl);

  thEl = components.getTagTH('Действия');
  trEl.append(thEl);

  theadEl.append(trEl);

  // Тело таблицы tBody
  const tBody = components.getTagTBody();
  tBody.classList.add('tBody');

  // Списки для выпадающих меню
  const roles = [
    'управляющий',
    'менеджер смены',
    'менеджер офиса',
    'администратор',
    'Гость',
  ];
  const units = [
    'Тюмень-1',
    'Тюмень-2',
    'Тюмень-3',
    'Тюмень-4',
    'Тюмень-5',
    'Тюмень-6',
    'Тюмень-7',
    'Тюмень-8',
    'Офис',
  ];

  usersData.forEach((user) => {
    trEl = components.getTagTR();
    tBody.append(trEl);

    // Логин
    let login = components.getTagTD(user.login);
    trEl.append(login);

    // ФИО (редактируемое поле)
    let fio = components.getTagTD();
    let fioInput = components.getTagInput('text', user.fio);
    fio.append(fioInput);
    trEl.append(fio);

    // Пароль (редактируемое поле)
    let password = components.getTagTD();
    let passwordInput = components.getTagInput('text', user.password || ''); // Пароль может быть пустым
    passwordInput.id = `password-${user.login}`;
    password.append(passwordInput);
    trEl.append(password);

    // Роль (выпадающий список)
    let role = components.getTagTD();
    let roleSelect = components.getTagSelect();
    roles.forEach((roleItem) => {
      let option = components.getTagOption(roleItem, roleItem);
      if (roleItem === user.role) option.selected = true;
      roleSelect.append(option);
    });
    role.append(roleSelect);
    trEl.append(role);

    // Подразделение (выпадающий список)
    let unitName = components.getTagTD();
    let unitSelect = components.getTagSelect();
    units.forEach((unitItem) => {
      let option = components.getTagOption(unitItem, unitItem);
      if (unitItem === user.unitName) option.selected = true;
      unitSelect.append(option);
    });
    unitName.append(unitSelect);
    trEl.append(unitName);

    // Кнопки "Сохранить" и "Удалить"
    let tdEl = components.getTagTD();
    let saveBtn = components.getTagButton('Сохранить');
    saveBtn.classList.add('btn', 'btn-success', 'btn-sm', 'me-2');
    saveBtn.setAttribute('data-id', user.login);

    let deleteBtn = components.getTagButton('Удалить');
    deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteBtn.setAttribute('data-id', user.login);

    tdEl.append(saveBtn, deleteBtn);
    trEl.append(tdEl);
  });

  tableEl.append(captionEl, theadEl, tBody);

  // Модальное окно для добавления пользователя (HTML-тег)
  const modalHTML = `
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addUserModalLabel">Добавить пользователя</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="addUserForm">
              <div class="mb-3">
                <label for="login" class="form-label">Логин</label>
                <input type="text" class="form-control" id="login" required>
              </div>
              <div class="mb-3">
                <label for="fio" class="form-label">ФИО</label>
                <input type="text" class="form-control" id="fio" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input type="text" class="form-control" id="password" required>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Роль</label>
                <select class="form-select" id="role" required>
                  ${roles
                    .map((role) => `<option value="${role}">${role}</option>`)
                    .join('')}
                </select>
              </div>
              <div class="mb-3">
                <label for="unitName" class="form-label">Подразделение</label>
                <select class="form-select" id="unitName" required>
                  ${units
                    .map((unit) => `<option value="${unit}">${unit}</option>`)
                    .join('')}
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            <button type="button" class="btn btn-primary" id="saveNewUser">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  `;
  tableContent.insertAdjacentHTML('beforeend', modalHTML);

  // Обработчик для кнопки "Сохранить" в таблице
  const saveButtons = document.querySelectorAll('.btn-success');
  saveButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const userId = btn.getAttribute('data-id');
      const row = btn.closest('tr');
      const fioInput = row.querySelector('input[type="text"]');
      const passwordInput = row.querySelector(`#password-${userId}`);
      const roleSelect = row.querySelector('select');
      const unitSelect = row.querySelectorAll('select')[1];

      const updatedUser = {
        login: userId,
        fio: fioInput.value,
        password: passwordInput.value,
        role: roleSelect.value,
        unitName: unitSelect.value,
      };

      try {
        await updateUser(updatedUser);
        alert('Пользователь успешно обновлен!');
        reloadUsers();
      } catch (error) {
        alert('Ошибка обновления пользователя: ' + error.message);
      }
    });
  });

  // Обработчик для кнопки "Удалить"
  const deleteButtons = document.querySelectorAll('.btn-danger');
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const userId = btn.getAttribute('data-id');
      try {
        await deleteUserByLogin(userId);
        alert('Пользователь успешно удален!');
        reloadUsers(); // Перезагрузка данных
      } catch (error) {
        alert('Ошибка удаления пользователя: ' + error.message);
      }
    });
  });

  // Обработчик для кнопки "Сохранить" в модальном окне
  const saveNewUserBtn = document.getElementById('saveNewUser');
  saveNewUserBtn.addEventListener('click', async () => {
    const login = document.getElementById('login').value;
    const fio = document.getElementById('fio').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const unitName = document.getElementById('unitName').value;

    try {
      await createUser({ login, password, fio, unitName, role });
      alert('Пользователь успешно создан!');
      reloadUsers(); // Перезагрузка данных
      bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide(); // Закрыть модальное окно
    } catch (error) {
      alert('Ошибка создания пользователя: ' + error.message);
    }
  });
}

// Функция для перезагрузки данных
async function reloadUsers() {
  const usersData = await getUsers();
  renderUsersTable(usersData);
}
