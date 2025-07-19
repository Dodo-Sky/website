import { getDisciplineProgramSettings, updateDisciplineProgramSettings } from '../../apiServer.js';

// Основная функция отрисовки таблицы
export async function render() {
  const content = document.querySelector('.contentSetting');
  content.innerHTML = '';

  const spinner = createSpinner();
  content.append(spinner);

  const dataList = await getDisciplineProgramSettings();
  spinner.remove();

  const table = createTable();
  const tbody = table.querySelector('tbody');

  dataList.forEach((data) => {
    const row = createRow(data);
    tbody.appendChild(row);
  });

  content.appendChild(table);
}

// Создание спиннера загрузки
function createSpinner() {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner-border');
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = `<span class="visually-hidden">Загрузка...</span>`;
  return spinner;
}

// Создание заголовков таблицы
function createTable() {
  const table = document.createElement('table');
  table.classList.add('table', 'table-bordered', 'table-sm');
  table.innerHTML = `
    <thead class="table-light">
      <tr>
        <th>Пиццерия</th>
        <th>Контроль раннего выхода</th>
        <th>Интервал менеджера (мин.)</th>
        <th>Интервал сотрудника (мин.)</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  return table;
}

// Создание строки таблицы с логикой отслеживания изменений
function createRow(data) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${data.unit_name}</td>
    <td><input type="checkbox" id="control_${data.id}" ${data.is_early_clock_in_control_enabled ? 'checked' : ''}></td>
    <td><input type="number" class="form-control" id="manager_${data.id}" value="${data.early_clock_in_manager_interval ?? ''}"></td>
    <td><input type="number" class="form-control" id="non_manager_${data.id}" value="${data.early_clock_in_non_manager_interval ?? ''}"></td>
    <td><button class="btn btn-primary btn-sm" id="save_${data.id}" disabled>Сохранить</button></td>
  `;

  const checkbox = row.querySelector(`#control_${data.id}`);
  const managerInput = row.querySelector(`#manager_${data.id}`);
  const nonManagerInput = row.querySelector(`#non_manager_${data.id}`);
  const saveButton = row.querySelector(`#save_${data.id}`);

  const initial = {
    checkbox: checkbox.checked,
    manager: managerInput.value,
    nonManager: nonManagerInput.value
  };

  // Отслеживание изменений — если что-то изменилось, активируем кнопку
  const trackChanges = () => {
    const changed =
      checkbox.checked !== initial.checkbox ||
      managerInput.value !== initial.manager ||
      nonManagerInput.value !== initial.nonManager;
    saveButton.disabled = !changed;
  };

  checkbox.addEventListener('change', trackChanges);
  managerInput.addEventListener('input', trackChanges);
  nonManagerInput.addEventListener('input', trackChanges);

  // Обработчик клика по кнопке сохранения
  saveButton.addEventListener('click', async () => {
    const payload = {
      is_early_clock_in_control_enabled: checkbox.checked,
    };

    const managerValue = parseInt(managerInput.value);
    const nonManagerValue = parseInt(nonManagerInput.value);

    if (!isNaN(managerValue)) payload.early_clock_in_manager_interval = managerValue;
    if (!isNaN(nonManagerValue)) payload.early_clock_in_non_manager_interval = nonManagerValue;

    await updateDisciplineProgramSettings(data.id, payload);

    // Обновляем начальные значения после успешного сохранения
    initial.checkbox = checkbox.checked;
    initial.manager = managerInput.value;
    initial.nonManager = nonManagerInput.value;
    saveButton.disabled = true;
  });

  return row;
}
