import { getDataServer } from '../../apiServer.js';

export async function getUnitNameEl() {
  const $choiceUnit = document.querySelector('.choiceUnit');

  let units = await getDataServer('unitName');
  units = units.filter(Boolean).filter((el) => el !== 'Офис');
  units = units.sort();

  for (const unit of units) {
    const $div_form_check = document.createElement('div');
    $div_form_check.classList.add('form-check');
    $div_form_check.classList.add('form-check-inline');

    const $form_check_label = document.createElement('label');
    $form_check_label.classList.add('form-check-label');
    $form_check_label.textContent = unit;
    $div_form_check.append($form_check_label);

    const $form_check_input = document.createElement('input');
    $form_check_input.classList.add('form-check-input');
    $form_check_input.classList.add('unitName');
    $form_check_input.setAttribute('type', 'checkbox');
    $form_check_input.setAttribute('value', unit);
    $form_check_label.append($form_check_input);
    $choiceUnit.append($div_form_check);
  }
}

export async function getStaffType() {
  const $typeAll = document.querySelector('.typeAll');

  let staffType = await getDataServer('staffType');
  staffType = staffType.filter(Boolean);
  staffType = staffType.sort();

  for (const element of staffType) {
    const $div_form_check = document.createElement('div');
    $div_form_check.classList.add('form-check');
    $div_form_check.classList.add('form-check-inline');

    const $form_check_label = document.createElement('label');
    $form_check_label.classList.add('form-check-label');
    $form_check_label.textContent = element;
    $div_form_check.append($form_check_label);

    const $form_check_input = document.createElement('input');
    $form_check_input.classList.add('form-check-input');
    $form_check_input.classList.add('staffType');
    $form_check_input.setAttribute('type', 'checkbox');
    $form_check_input.setAttribute('value', element);
    $form_check_label.append($form_check_input);
    $typeAll.append($div_form_check);
  }
}

export function getDayWeek() {
  const $choiceUnit = document.querySelector(`.dayWeek`);
  const dayWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суботта',
    'Воскресение',
  ];

  dayWeek.forEach((element) => {
    const $div_form_check = document.createElement('div');
    $div_form_check.classList.add('form-check');
    $div_form_check.classList.add('form-check-inline');

    const $form_check_label = document.createElement('label');
    $form_check_label.classList.add('form-check-label');
    $form_check_label.textContent = element;
    $div_form_check.append($form_check_label);

    const $form_check_input = document.createElement('input');
    $form_check_input.classList.add('form-check-input');
    $form_check_input.classList.add('dayWeek-inp');
    $form_check_input.setAttribute('type', 'checkbox');
    $form_check_input.setAttribute('value', element);
    $form_check_label.append($form_check_input);
    $choiceUnit.append($div_form_check);
  });
}
