import { getDisciplineProgramSettings, updateDisciplineProgramSettings } from "../../apiServer.js";

const tooltips = {
  message_to_director_unit: "Отправляем уведомление управляющему пиццерией через 30 минут после задержки?",
  time_message_to_director_min: "Через сколько времени отстутвия сотрудника на месте отправляется сообщение?",
  shift_extending_control: "Контролируем продление смен?",
  shift_time_extending_control: "Продленное время (в минутах) после истечения которого будет создано нарушение о продлении смены",
  shift_early_opening_control: "Контролируем раннее открытие смены сотрудниками (по умолчанию за 61 минуту до открытия пиццерии)?",
  shift_time_early_opening_control: "За сколько времени можно открывать смену в пиццерии (сравнивается время открытия пиццерии со временем смены на доставку)",
  large_staff_open_pizzeria: "Контроль количества сотрудников на открытие пиццерии",
  time_start_shift_open_pizzeria: "Время выхода сотрудников (без открывающей смены) до начала открытия пиццерии",
  number_staff_to_open_pizzeria: "Количество сотрудников открывающей смены (до открытия пиццерии). По умолчанию 2 - один менеджер смены и один линейный сотрудник.\n" +
    "Курьеры и управляющие не учитываются",
  message_to_territorial_director: "Отправляем сообщение территориальному управляющему при нарушении управляющим сроков решения вопросов по программе Дисциплина?",
  message_to_grafist_unit: "Отправляем ли сообщение графисту через 30 минут?",
  early_clock_in_manager_interval: "Допустимое время раннего выхода для менеджера (мин.)",
  early_clock_in_non_manager_interval: "Допустимое время раннего выхода для сотрудника (мин.)",
};

// Главная функция рендера страницы
export async function render() {
  const content = document.querySelector(".contentSetting");
  content.innerHTML = "";

  const spinner = document.createElement("div");
  spinner.classList.add("spinner-border");
  spinner.setAttribute("role", "status");
  spinner.innerHTML = `<span class="visually-hidden">Загрузка...</span>`;
  content.append(spinner);

  const dataList = await getDisciplineProgramSettings();
  spinner.remove();

  const select = document.createElement("select");
  select.classList.add("form-select", "mb-3");
  select.innerHTML = `
    <option disabled selected>Выберите пиццерию</option>
    ${dataList.map((d) => `<option value="${d.id}">${d.unit_name}</option>`).join("")}
  `;
  content.appendChild(select);

  const tableWrapper = document.createElement("div");
  content.appendChild(tableWrapper);

  select.addEventListener("change", () => {
    const selectedId = parseInt(select.value);
    const selectedData = dataList.find((d) => d.id === selectedId);
    renderVerticalTable(selectedData, tableWrapper);
  });

  if (dataList.length > 0) {
    select.selectedIndex = 1;
    const selectedId = parseInt(select.value);
    const selectedData = dataList.find((d) => d.id === selectedId);
    renderVerticalTable(selectedData, tableWrapper);
  }
}

function renderVerticalTable(data, container) {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.classList.add("d-flex", "flex-column", "gap-3");

  const makeId = (name) => `${name}_${data.id}`;

  const fields = [
    ["Сообщение управляющему пиццерии", "message_to_director_unit", "checkbox"],
    ["Время для сообщения управляющему пиццерии (мин.)", "time_message_to_director_min", "number"],
    ["Сообщение графисту", "message_to_grafist_unit", "checkbox"],
    ["Контроль продления смены", "shift_extending_control", "checkbox"],
    ["Время продления смены (мин.)", "shift_time_extending_control", "number"],
    ["Контроль раннего открытия смены", "shift_early_opening_control", "checkbox"],
    ["Время раннего открытия смены (мин.)", "shift_time_early_opening_control", "number"],
    ["Интервал менеджера (мин.)", "early_clock_in_manager_interval", "number"],
    ["Интервал сотрудника (мин.)", "early_clock_in_non_manager_interval", "number"],
    ["Настройки времени работы команды запуска", "large_staff_open_pizzeria", "checkbox"],
    ["Время начала смены для открытия (мин.)", "time_start_shift_open_pizzeria", "number"],
    ["Количество сотрудников для открытия", "number_staff_to_open_pizzeria", "number"],
    ["Сообщение территориальному управляющему о нарушении сроков управляющим", "message_to_territorial_director", "checkbox"],
  ];

  const controlMap = {
    message_to_director_unit: ["time_message_to_director_min"],
    shift_extending_control: ["shift_time_extending_control"],
    shift_early_opening_control: [
      "shift_time_early_opening_control",
      "early_clock_in_manager_interval",
      "early_clock_in_non_manager_interval",
    ],
    large_staff_open_pizzeria: ["time_start_shift_open_pizzeria", "number_staff_to_open_pizzeria"],
  };

  const inputs = {};
  let original = {};
  const formBlocks = {};

  for (const [label, key, type] of fields) {
    const id = makeId(key);
    const value = data[key];

    const block = document.createElement("div");
    block.classList.add("border", "p-3", "rounded");
    if (type === "checkbox") block.classList.add("bg-light");

    const formGroup = document.createElement("div");
    formGroup.classList.add("form-check");

    const input = document.createElement("input");
    input.id = id;
    inputs[key] = input;

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", id);
    const tooltipText = tooltips[key];
    if (tooltipText) {
      labelEl.innerHTML = `
    ${label}
    <i class="bi bi-info-circle ms-1 text-muted" data-bs-toggle="tooltip" title="${tooltipText}" style="cursor: pointer;"></i>
  `;
    } else {
      labelEl.textContent = label;
    }
    if (type === "checkbox") {
      input.type = "checkbox";
      input.checked = !!value;
      input.classList.add("form-check-input");
      labelEl.classList.add("form-check-label");
      formGroup.appendChild(input);
      formGroup.appendChild(labelEl);
      block.appendChild(formGroup);
      original[key] = input.checked;
    } else {
      input.type = "number";
      input.value = value ?? "";
      input.classList.add("form-control");
      labelEl.classList.add("form-label");
      block.appendChild(labelEl);
      block.appendChild(input);
      original[key] = input.value;
    }

    formBlocks[key] = block;
    wrapper.appendChild(block);
  }

  const saveButton = document.createElement("button");
  saveButton.classList.add("btn", "btn-primary", "align-self-start", "mt-2");
  saveButton.textContent = "Сохранить";
  saveButton.disabled = true;

  wrapper.appendChild(saveButton);
  container.appendChild(wrapper);

  // Инициализация Bootstrap тултипов
  const tooltipTriggerList = [].slice.call(wrapper.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  function applyControlDependencies() {
    for (const [controlKey, dependentKeys] of Object.entries(controlMap)) {
      const control = inputs[controlKey];
      const enabled = control.checked;

      dependentKeys.forEach((depKey) => {
        const input = inputs[depKey];
        const block = formBlocks[depKey];
        if (input) input.disabled = !enabled;
        if (block) {
          block.classList.toggle("opacity-50", !enabled);
        }
      });
    }
  }

  function onChange() {
    applyControlDependencies();

    const isChanged = fields.some(([_, key, type]) => {
      const el = inputs[key];
      if (type === "checkbox") return el.checked !== original[key];
      return el.value !== original[key];
    });

    saveButton.disabled = !isChanged;
  }

  for (const [, key, type] of fields) {
    const el = inputs[key];
    const event = type === "checkbox" ? "change" : "input";
    el.addEventListener(event, onChange);
  }

  applyControlDependencies();

  saveButton.addEventListener("click", async () => {
    const payload = {};
    for (const [, key, type] of fields) {
      const el = inputs[key];
      payload[key] = type === "checkbox" ? el.checked : el.value === "" ? null : parseInt(el.value);
      original[key] = type === "checkbox" ? el.checked : el.value;
    }

    await updateDisciplineProgramSettings(data.id, payload);
    saveButton.disabled = true;
  });
}
