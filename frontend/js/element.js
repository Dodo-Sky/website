export function getUnitNameEl(name) {
  const $choiceUnit = document.querySelector('.choiceUnit');
  for (let i = 1; i < 9; i++) {
    const $div_form_check = document.createElement('div');
    $div_form_check.classList.add('form-check');
    $div_form_check.classList.add('form-check-inline');

    const $form_check_label = document.createElement('label');
    $form_check_label.classList.add('form-check-label');
    $form_check_label.textContent = `${name}-${i}`;
    $div_form_check.append($form_check_label);

    const $form_check_input = document.createElement('input');
    $form_check_input.classList.add('form-check-input');
    $form_check_input.classList.add('unitName');
    $form_check_input.setAttribute('type', 'checkbox');
    $form_check_input.setAttribute('value', `${name}-${i}`);
    $form_check_label.append($form_check_input);
    $choiceUnit.append($div_form_check);
  }
}

export function getInputfEl (querySelector, selector, arr) {
  const $choiceUnit = document.querySelector(`.${querySelector}`);
  
  arr.forEach(element => {
    const $div_form_check = document.createElement('div');
    $div_form_check.classList.add('form-check');
    $div_form_check.classList.add('form-check-inline');

    const $form_check_label = document.createElement('label');
    $form_check_label.classList.add('form-check-label');
    $form_check_label.textContent = element;
    $div_form_check.append($form_check_label);

    const $form_check_input = document.createElement('input');
    $form_check_input.classList.add('form-check-input');
    $form_check_input.classList.add(selector);
    $form_check_input.setAttribute('type', 'checkbox');
    $form_check_input.setAttribute('value', element);
    $form_check_label.append($form_check_input);
    $choiceUnit.append($div_form_check);
  });
}
