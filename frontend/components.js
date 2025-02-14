export {
  getTagDiv,
  getTagButton,
  getTagH,
  getTagP,
  getTagNav,
  getTagULListNav,
  etTagULDropdownMenu,
  getTagLINav,
  getTagLIDropdownToggle,
  getTagLIDropdownItem,
  getTagForm,
  getTagLabel,
  getTagCheckboxLabel,
  getTagInput,
  getTagInputCheckbox,
  getTagSelect,
  getTagOption,
  getTagTableDiv,
  getTagTable,
  getTagCaption,
  getTagTHead,
  getTagTB,
  getTagTR,
  getTagTH,
  getTagTD,
};

// Базовая разметка
function getTagDiv(addClass) {
  const element = document.createElement('div');
  element.classList.add(addClass);
  return element;
}

function getTagButton(textContent, type = 'button') {
  const element = document.createElement('button');
  element.setAttribute('type', type);
  element.classList.add(`btn`);
  element.classList.add(`btn-primary`);
  element.textContent = textContent;
  return element;
}

function getTagH(size, textContent) {
  const element = document.createElement(`h${size}`);
  element.textContent = textContent;
  return element;
}

function getTagP(textContent) {
  const element = document.createElement('p');
  element.textContent = textContent;
  return element;
}

// Навигация
function getTagNav() {
  const element = document.createElement('nav');
  return element;
}

function getTagULListNav() {
  const element = document.createElement('ul');
  element.classList.add('nav');
  element.classList.add('nav-tabs');
  return element;
}

function etTagULDropdownMenu() {
  const element = document.createElement('ul');
  element.classList.add('dropdown-menu');
  return element;
}

function getTagLINav(textContent) {
  const element = document.createElement('li');
  element.classList.add('nav-item');
  element.classList.add('nav-link');
  element.textContent = textContent;
  return element;
}

function getTagLIDropdownToggle(textContent) {
  const element = document.createElement('li');
  element.classList.add('nav-item');
  element.classList.add('nav-link');
  element.classList.add('dropdown-toggle');
  element.setAttribute('data-bs-toggle', 'dropdown');
  element.textContent = textContent;
  return element;
}

function getTagLIDropdownItem(textContent) {
  const element = document.createElement('li');
  element.classList.add('dropdown-item');
  element.textContent = textContent;
  return element;
}

// Элементы форм
function getTagForm(idForm) {
  const element = document.createElement('form');
  element.setAttribute('id', idForm);
  return element;
}

function getTagLabel(idInput, textContent) {
  const element = document.createElement('label');
  element.classList.add('form-label');
  element.setAttribute('for', idInput);
  element.textContent = textContent;
  return element;
}

function getTagCheckboxLabel(idInput, textContent) {
  const element = document.createElement('label');
  element.classList.add('form-check-label');
  element.setAttribute('for', idInput);
  element.textContent = textContent;
  return element;
}

function getTagInput(idInput, type = 'text', value = '', placeholder = '') {
  const element = document.createElement('input');
  element.classList.add('form-control');
  element.setAttribute('id', idInput);
  element.setAttribute('type', type);
  element.setAttribute('value', value);
  element.setAttribute('placeholder', placeholder);
  return element;
}

function getTagInputCheckbox(idInput) {
  const element = document.createElement('input');
  element.classList.add('form-check-input');
  element.setAttribute('id', idInput);
  element.setAttribute('type', 'checkbox');
  return element;
}

function getTagSelect() {
  const element = document.createElement('select');
  element.classList.add('form-select');
  return element;
}

function getTagOption(textContent, value) {
  const element = document.createElement('option');
  element.setAttribute('value', value);
  element.textContent = textContent;
  return element;
}

// элементы таблиц
function getTagTableDiv() {
  // горизонтальная прокрутка
  const element = document.createElement('div');
  element.classList.add('table-responsive');
  return element;
}

function getTagTable() {
  const element = document.createElement('table');
  element.classList.add('table');
  element.classList.add('table-hover');
  element.classList.add('table-bordered');
  element.classList.add('caption-top');
  return element;
}

function getTagCaption(textContent) {
  const element = document.createElement('caption');
  element.textContent = textContent;
  return element;
}

function getTagTHead() {
  const element = document.createElement('thead');
  element.classList.add('table-secondary');
  return element;
}

function getTagTB() {
  const element = document.createElement('tbody');
  return element;
}

function getTagTR() {
  const element = document.createElement('tr');
  return element;
}

function getTagTH(textContent) {
  const element = document.createElement('th');
  element.setAttribute('scope', 'col');
  element.classList.add('fs-6');
  element.textContent = textContent;
  return element;
}

function getTagTD(textContent) {
  const element = document.createElement('td');
  element.classList.add('fs-6');
  element.textContent = textContent;
  return element;
}
