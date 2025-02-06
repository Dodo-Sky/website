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

export function renderTable (arr) {
  const $tbody = document.querySelector('.table-light');
  let count = 1;

  arr.forEach(el => {
    const $trEl = document.createElement('tr');
    $tbody.append ($trEl);

    const $thEl = document.createElement('th');
    $thEl.classList.add('fs-6');
    $thEl.textContent = count;
    $thEl.scope = 'col';
    count++;
    $trEl.append ($thEl);

    let $tdEl = document.createElement('td');
    $tdEl.classList.add('fs-6');
    $tdEl.textContent = el.description;
    $trEl.append ($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.amountSize;
    $trEl.append ($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.date_start;
    $trEl.append ($tdEl);

    let unitName = el.unitName.join (' ')
    $tdEl = document.createElement('td');
    $tdEl.textContent = unitName;
    $trEl.append ($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.holiday;
    $trEl.append ($tdEl);


    $tdEl = document.createElement('td');
    $tdEl.textContent = el.typeAmount;
    $trEl.append ($tdEl);

    let staffTypeArr = el.staffTypeArr.join (' ')
    $tdEl = document.createElement('td');
    $tdEl.textContent = staffTypeArr;
    $trEl.append ($tdEl);

    let dayWeek = el.dayWeek.join (' ')
    $tdEl = document.createElement('td');
    $tdEl.textContent = dayWeek;
    $trEl.append ($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.start_time;
    $trEl.append ($tdEl);

    $tdEl = document.createElement('td');
    $tdEl.textContent = el.stop_time;
    $trEl.append ($tdEl);

    $tdEl = document.createElement('td');
    let editButton = document.createElement('button');
    editButton.classList.add ('editButton');
    editButton.classList.add ('btn');
    editButton.classList.add ('btn-outline-success');
    editButton.classList.add ('btn-sm');
    editButton.type = 'button';
    editButton.textContent = 'Редактировать';
    editButton.style.marginBottom = '10px';
    $trEl.append ($tdEl);

    let deleteButton = document.createElement('button');
    deleteButton.classList.add ('deleteButton');
    deleteButton.classList.add ('btn');
    deleteButton.classList.add ('btn-outline-danger');
    deleteButton.classList.add ('btn-sm');
    deleteButton.textContent = 'Удалить';
    deleteButton.type = 'button';
    $trEl.append ($tdEl);
    $tdEl.append (editButton, deleteButton);
 
  });
 }
