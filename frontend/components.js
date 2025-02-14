export {
  getDivEl,
  getButtonEl,
  getHEl,
  getPEl,
  getNavEl,
  getUlEl_nav,
  getUlEl_dropdown_menu,
  getLiEl_nav,
  getLiEl_dropdown_toggle,
  getLiEl_dropdown_item,
  getFormEl,
  getLabelEl,
  getLabelCheckboxEl,
  getInputEl,
  getInputCheckboxEl,
  getSelectEl,
  getOptionEl,
  getDivTableEl,
  getTableEl,
  getCaptionEl,
  getTheadEl,
  getTbodyEl,
  getTrEl,
  getThEl,
  getTdEl,
};

// Базовая разметка
function getDivEl(addClass) {
  const element = document.createElement('div');
  element.classList.add(addClass);
  return element;
}
function getButtonEl(textContent, type = 'button') {
  const element = document.createElement('button');
  element.setAttribute('type', type);
  element.classList.add(`btn`);
  element.classList.add(`btn-primary`);
  element.textContent = textContent;
  return element;
}
function getHEl(size, textContent) {
  const element = document.createElement(`h${size}`);
  element.textContent = textContent;
  return element;
}
function getPEl(textContent) {
  const element = document.createElement('p');
  element.textContent = textContent;
  return element;
}

// Навигация
function getNavEl() {
  const element = document.createElement('nav');
  return element;
}
function getUlEl_nav() {
  const element = document.createElement('ul');
  element.classList.add('nav');
  element.classList.add('nav-tabs');
  return element;
}
function getUlEl_dropdown_menu() {
  const element = document.createElement('ul');
  element.classList.add('dropdown-menu');
  return element;
}
function getLiEl_nav(textContent) {
  const element = document.createElement('li');
  element.classList.add('nav-item');
  element.classList.add('nav-link');
  element.textContent = textContent;
  return element;
}
function getLiEl_dropdown_toggle(textContent) {
  const element = document.createElement('li');
  element.classList.add('nav-item');
  element.classList.add('nav-link');
  element.classList.add('dropdown-toggle');
  element.setAttribute('data-bs-toggle', 'dropdown');
  element.textContent = textContent;
  return element;
}
function getLiEl_dropdown_item(textContent) {
  const element = document.createElement('li');
  element.classList.add('dropdown-item');
  element.textContent = textContent;
  return element;
}

// Элементы форм
function getFormEl(idForm) {
  const element = document.createElement('form');
  element.setAttribute('id', idForm);
  return element;
}
function getLabelEl(idInput, textContent) {
  const element = document.createElement('label');
  element.classList.add('form-label');
  element.setAttribute('for', idInput);
  element.textContent = textContent;
  return element;
}
function getLabelCheckboxEl(idInput, textContent) {
  const element = document.createElement('label');
  element.classList.add('form-check-label');
  element.setAttribute('for', idInput);
  element.textContent = textContent;
  return element;
}
function getInputEl(idInput, type = 'text', value = '', placeholder = '') {
  const element = document.createElement('input');
  element.classList.add('form-control');
  element.setAttribute('id', idInput);
  element.setAttribute('type', type);
  element.setAttribute('value', value);
  element.setAttribute('placeholder', placeholder);
  return element;
}
function getInputCheckboxEl(idInput) {
  const element = document.createElement('input');
  element.classList.add('form-check-input');
  element.setAttribute('id', idInput);
  element.setAttribute('type', 'checkbox');
  return element;
}
function getSelectEl() {
  const element = document.createElement('select');
  element.classList.add('form-select');
  return element;
}
function getOptionEl(textContent, value) {
  const element = document.createElement('option');
  element.setAttribute('value', value);
  element.textContent = textContent;
  return element;
}

// элементы таблиц
function getDivTableEl() {
  // горизонтальная прокрутка
  const element = document.createElement('div');
  element.classList.add('table-responsive');
  return element;
}
function getTableEl() {
  const element = document.createElement('table');
  element.classList.add('table');
  element.classList.add('table-hover');
  element.classList.add('table-bordered');
  element.classList.add('caption-top');
  return element;
}
function getCaptionEl(textContent) {
  const element = document.createElement('caption');
  element.textContent = textContent;
  return element;
}
function getTheadEl() {
  const element = document.createElement('thead');
  element.classList.add('table-secondary');
  return element;
}
function getTbodyEl() {
  const element = document.createElement('tbody');
  return element;
}
function getTrEl() {
  const element = document.createElement('tr');
  return element;
}
function getThEl(textContent) {
  const element = document.createElement('th');
  element.setAttribute('scope', 'col');
  element.classList.add('fs-6');
  element.textContent = textContent;
  return element;
}
function getTdEl(textContent) {
  const element = document.createElement('td');
  element.classList.add('fs-6');
  element.textContent = textContent;
  return element;
}
