import { createUser, updateUser, deleteUserByLogin, getUsers, getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';

export async function renderUsersTable(usersData) {
  usersData.sort((a, b) => a.unitName.localeCompare(b.unitName));
  const departmentName = localStorage.getItem('departmentName');
  const unitsSettings = await getServerApi('unitsSettings');
  const units = [
    ...new Set(unitsSettings.filter((el) => el.departmentName === departmentName).map((el) => el.unitName)),
  ].sort();
  console.log(units);
  const roles = ['администратор', 'менеджер офиса', 'управляющий', 'Гость', 'менеджер смены'];

  const table_admin = document.querySelector('.table-admin');
  table_admin.innerHTML = '';

  const tableEl = components.getTagTable();
  tableEl.classList.add('table-sm');
  table_admin.append(tableEl);
  const captionEl = components.getTagCaption('Список пользователей');

  // Заголовок таблицы THead
  const theadEl = components.getTagTHead();
  theadEl.classList.add('sticky-top');
  let trEl = components.getTagTR();

  let thEl = components.getTagTH('Логин');
  trEl.append(thEl);

  thEl = components.getTagTH('ФИО');
  trEl.append(thEl);

  thEl = components.getTagTH('Должность');
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

  const nameFunctions = [...new Set(usersData.map((el) => el.nameFunction))].sort();

  usersData.forEach((user) => {
    trEl = components.getTagTR();
    tBody.append(trEl);

    // Логин
    let login = components.getTagTD(user.login);
    trEl.append(login);

    // ФИО (редактируемое поле)
    let fio = components.getTagTD();
    let fioInput = components.getTagTextarea(user.fio);
    fioInput.classList.add('fioInput');
    fio.append(fioInput);
    trEl.append(fio);

    let nameFunctionEl = components.getTagTD();
    let nameFunctionInput = components.getTagTextarea(user.nameFunction);
    nameFunctionInput.classList.add('nameFunctionEl');
    nameFunctionEl.append(nameFunctionInput);
    trEl.append(nameFunctionEl);

    // Пароль (редактируемое поле)
    let password = components.getTagTD();
    let passwordInput = components.getTagInput('text', user.password || ''); // Пароль может быть пустым
    passwordInput.id = `password-${user.login}`;
    passwordInput.classList.add('password');
    password.append(passwordInput);
    trEl.append(password);

    // Роль (выпадающий список)
    let role = components.getTagTD();
    let roleSelect = components.getTagSelect();
    roleSelect.classList.add('roleSelect');
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
    unitSelect.classList.add('unitSelect');
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
    saveBtn.className = 'btn btn-outline-success btn-sm me-2';
    saveBtn.setAttribute('data-id', user.login);

    let deleteBtn = components.getTagButton('Удалить');
    deleteBtn.className = 'btn btn-outline-danger btn-sm';
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
                <label for="nameFunction" class="form-label">Должность</label>
                <input type="text" class="form-control" id="nameFunction" required>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input type="text" class="form-control" id="password" required>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Роль</label>
                <select class="form-select" id="role" required>
                  ${roles.map((role) => `<option value="${role}">${role}</option>`).join('')}
                </select>
              </div>
              <div class="mb-3">
                <label for="unitName" class="form-label">Подразделение</label>
                <select class="form-select" id="unitName" required>
                  ${units.map((unit) => `<option value="${unit}">${unit}</option>`).join('')}
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
  table_admin.insertAdjacentHTML('beforeend', modalHTML);

  // Обработчик для кнопки "Сохранить" в таблице
  const saveButtons = document.querySelectorAll('.btn-outline-success');
  saveButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const userId = btn.dataset.id;
      const row = btn.closest('tr');
      const fioInput = row.querySelector('.fioInput');
      const passwordInput = row.querySelector('.password');
      const roleSelect = row.querySelector('.roleSelect');
      const unitSelect = row.querySelector('.unitSelect');
      const nameFunction = row.querySelector('.nameFunctionEl')?.value ?? '';
      const departmentName = localStorage.getItem('departmentName');

      const updatedUser = {
        login: userId,
        fio: fioInput.value,
        password: passwordInput.value,
        role: roleSelect.value,
        unitName: unitSelect.value,
        nameFunction: nameFunction,
        departmentName: departmentName,
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
  const deleteButtons = document.querySelectorAll('.btn-outline-danger');
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
    const nameFunction = document.getElementById('nameFunction').value;
    const departmentName = localStorage.getItem('departmentName');

    try {
      await createUser({ login, password, fio, unitName, role, nameFunction, departmentName });
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
