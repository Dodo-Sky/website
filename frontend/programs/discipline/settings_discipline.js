import { getDisciplineProgramSettings, updateDisciplineProgramSettings } from '../../apiServer.js';

// Главная функция рендера страницы
export async function render() {
  const content = document.querySelector('.contentSetting');
  content.innerHTML = '';

  const spinner = document.createElement('div');
  spinner.classList.add('spinner-border');
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = `<span class="visually-hidden">Загрузка...</span>`;
  content.append(spinner);

  const dataList = await getDisciplineProgramSettings();
  spinner.remove();

  const select = document.createElement('select');
  select.classList.add('form-select', 'mb-3');
  select.innerHTML = `
    <option disabled selected>Выберите пиццерию</option>
    ${dataList.map(d => `<option value="${d.id}">${d.unit_name}</option>`).join('')}
  `;
  content.appendChild(select);

  const tableWrapper = document.createElement('div');
  content.appendChild(tableWrapper);

  select.addEventListener('change', () => {
    const selectedId = parseInt(select.value);
    const selectedData = dataList.find(d => d.id === selectedId);
    renderVerticalTable(selectedData, tableWrapper);
  });
}

function renderVerticalTable(data, container) {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('d-flex', 'flex-column', 'gap-3'); // Вертикальный список блоков

  const makeId = name => `${name}_${data.id}`;

  const fields = [
    ['Контроль раннего выхода сотрудников', 'is_early_clock_in_control_enabled', 'checkbox'],
    ['Допустимое время раннего выхода для менеджера (мин.)', 'early_clock_in_manager_interval', 'number'],
    ['Допустимое время раннего выхода для сотрудника (мин.)', 'early_clock_in_non_manager_interval', 'number'],
    ['Отправлять уведомление директору при опоздании?', 'message_to_director_unit', 'checkbox'],
    ['Через сколько минут отсутствия отправлять сообщение директору?', 'time_message_to_director_min', 'number'],
    ['Контролировать продление смен?', 'shift_extending_control', 'checkbox'],
    ['Максимальное допустимое продление смены (мин.)', 'shift_time_extending_control', 'number'],
    ['Контролировать раннее открытие смены?', 'shift_early_opening_control', 'checkbox'],
    ['Максимальное время раннего открытия смены (мин.)', 'shift_time_early_opening_control', 'number'],
    ['Контроль открытия пиццерии большим штатом?', 'large_staff_open_pizzeria', 'checkbox'],
    ['Время начала смены для открытия пиццерии (мин. до открытия)', 'time_start_shift_open_pizzeria', 'number'],
    ['Минимальное количество сотрудников на открытие пиццерии', 'number_staff_to_open_pizzeria', 'number'],
    ['Отправлять сообщение территориальному директору при нарушении?', 'message_to_territorial_director', 'checkbox'],
    ['Отправлять сообщение графисту через 30 минут?', 'message_to_grafist_unit', 'checkbox'],
  ];


  const controlMap = {
    is_early_clock_in_control_enabled: ['early_clock_in_manager_interval', 'early_clock_in_non_manager_interval'],
    message_to_director_unit: ['time_message_to_director_min'],
    shift_extending_control: ['shift_time_extending_control'],
    shift_early_opening_control: ['shift_time_early_opening_control'],
    large_staff_open_pizzeria: ['time_start_shift_open_pizzeria', 'number_staff_to_open_pizzeria'],
  };

  const inputs = {};
  let original = {};

  const formBlocks = {};

  // Создание блоков
  for (const [label, key, type] of fields) {
    const id = makeId(key);
    const value = data[key];

    const block = document.createElement('div');
    block.classList.add('border', 'p-3', 'rounded');

    if (type === 'checkbox') block.classList.add('bg-light');

    const formGroup = document.createElement('div');
    formGroup.classList.add('form-check');

    const input = document.createElement('input');
    input.id = id;
    inputs[key] = input;

    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', id);
    labelEl.textContent = label;

    if (type === 'checkbox') {
      input.type = 'checkbox';
      input.checked = !!value;
      input.classList.add('form-check-input');
      labelEl.classList.add('form-check-label');
      formGroup.appendChild(input);
      formGroup.appendChild(labelEl);
      block.appendChild(formGroup);
      original[key] = input.checked;
    } else {
      input.type = 'number';
      input.value = value ?? '';
      input.classList.add('form-control');
      labelEl.classList.add('form-label');

      block.appendChild(labelEl);
      block.appendChild(input);
      original[key] = input.value;
    }

    formBlocks[key] = block;
    wrapper.appendChild(block);
  }

  // Кнопка сохранения
  const saveButton = document.createElement('button');
  saveButton.classList.add('btn', 'btn-primary', 'align-self-start', 'mt-2');
  saveButton.textContent = 'Сохранить';
  saveButton.disabled = true;

  wrapper.appendChild(saveButton);
  container.appendChild(wrapper);

  // Обновление зависимостей
  function applyControlDependencies() {
    for (const [controlKey, dependentKeys] of Object.entries(controlMap)) {
      const control = inputs[controlKey];
      const enabled = control.checked;

      dependentKeys.forEach(depKey => {
        const input = inputs[depKey];
        const block = formBlocks[depKey];
        if (input) input.disabled = !enabled;
        if (block) {
          block.classList.toggle('opacity-50', !enabled);
        }
      });
    }
  }

  function onChange() {
    applyControlDependencies();

    const isChanged = fields.some(([_, key, type]) => {
      const el = inputs[key];
      if (type === 'checkbox') return el.checked !== original[key];
      return el.value !== original[key];
    });

    saveButton.disabled = !isChanged;
  }

  // Добавляем обработчики
  for (const [, key, type] of fields) {
    const el = inputs[key];
    const event = type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(event, onChange);
  }

  applyControlDependencies();

  saveButton.addEventListener('click', async () => {
    const payload = {};
    for (const [, key, type] of fields) {
      const el = inputs[key];
      payload[key] = type === 'checkbox' ? el.checked : (el.value === '' ? null : parseInt(el.value));
      original[key] = type === 'checkbox' ? el.checked : el.value;
    }

    await updateDisciplineProgramSettings(data.id, payload);
    saveButton.disabled = true;
  });
}
