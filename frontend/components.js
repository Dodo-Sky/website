import { clearAuthData } from './auth/login.js'

export {
  getTagDiv,
  getTagSpan,
  getTagSpan_badge,
  getTagButton,
  getTagButton_close,
  getTagButton_dropdown,
  getTagH,
  getTagP,
  getTagNav,
  getTagUL_nav,
  getTagUL_dropdownMenu,
  getTagLI_navItem,
  getTagLI_nav,
  getTagLI_dropdownToggle,
  getTagLI_dropdownItem,
  getTagLI_breadcrumb,
  getTagLI_breadcrumbActive,
  getTagForm,
  getTagLabel,
  getTagLabel_checkbox,
  getTagInput,
  getTagInput_checkbox,
  getTagTextarea,
  getTagSelect,
  getTagOption,
  getTagDatalist,
  getTagDiv_table,
  getTagTable,
  getTagCaption,
  getTagTHead,
  getTagTBody,
  getTagTR,
  getTagTH,
  getTagTD,
  getCardNav,
  getCardRow,
  getTagButton_logout
}

// Базовая разметка
function getTagDiv(addClass) {
  const element = document.createElement('div')
  element.classList.add(addClass)
  return element
}

function getTagSpan() {
  const element = document.createElement('span')
  return element
}

function getTagButton_close() {
  const element = document.createElement('button')
  element.setAttribute('type', 'button')
  element.setAttribute('data-bs-dismiss', 'modal')
  element.classList.add('btn-close')
  return element
}

function getTagButton(textContent, type = 'button') {
  const element = document.createElement('button')
  element.setAttribute('type', type)
  element.className = 'btn btn-primary'
  element.textContent = textContent
  return element
}

function getTagButton_dropdown(textContent) {
  const element = document.createElement('button')
  element.setAttribute('type', 'button')
  element.setAttribute('data-bs-toggle', 'dropdown')
  element.className = 'btn position-relative btn-secondary dropdown-toggle'
  element.textContent = textContent
  return element
}

function getTagH(size, textContent) {
  const element = document.createElement(`h${size}`)
  element.textContent = textContent
  return element
}

function getTagP(textContent) {
  const element = document.createElement('p')
  element.textContent = textContent
  return element
}
function getTagSpan_badge(textContent) {
  const element = document.createElement('span')
  element.textContent = textContent
  element.className = 'badge position-absolute top-0 start-100 translate-middle rounded-pill bg-danger'
  return element
}

// Навигация
function getTagNav() {
  const element = document.createElement('nav')
  return element
}

function getTagUL_nav() {
  const element = document.createElement('ul')
  element.classList.add('nav')
  return element
}

function getTagUL_dropdownMenu() {
  const element = document.createElement('ul')
  element.classList.add('dropdown-menu')
  return element
}

function getTagLI_nav(textContent) {
  const element = document.createElement('li')
  element.className = 'nav-item nav-link'
  element.textContent = textContent
  return element
}

function getTagLI_navItem() {
  const element = document.createElement('li')
  element.className = 'nav-item'
  return element
}

function getTagLI_dropdownToggle(textContent) {
  const element = document.createElement('li')
  element.className = 'nav-item nav-link dropdown-toggle'
  element.setAttribute('data-bs-toggle', 'dropdown')
  element.textContent = textContent
  return element
}

function getTagLI_dropdownItem(textContent) {
  const element = document.createElement('li')
  element.classList.add('dropdown-item')
  element.textContent = textContent
  return element
}

function getTagLI_breadcrumb(textContent) {
  const element = document.createElement('li')
  element.classList.add('breadcrumb-item')
  const aEl = document.createElement('a')
  aEl.setAttribute('href', '#')
  aEl.textContent = textContent
  element.append(aEl)
  return element
}

function getTagLI_breadcrumbActive(textContent) {
  const element = document.createElement('li')
  element.className = 'breadcrumb-item active'
  element.textContent = textContent
  return element
}

// Элементы форм
function getTagForm(idForm) {
  const element = document.createElement('form')
  element.setAttribute('id', idForm)
  return element
}

function getTagLabel(idInput, textContent) {
  const element = document.createElement('label')
  element.classList.add('form-label')
  element.setAttribute('for', idInput)
  element.textContent = textContent
  return element
}

function getTagLabel_checkbox(idInput, textContent) {
  const element = document.createElement('label')
  element.classList.add('form-check-label')
  element.setAttribute('for', idInput)
  element.textContent = textContent
  return element
}

function getTagInput(type = 'text', value = '') {
  const element = document.createElement('input')
  element.classList.add('form-control')
  element.setAttribute('type', type)
  element.setAttribute('value', value)
  return element
}

function getTagInput_checkbox(idInput) {
  const element = document.createElement('input')
  element.classList.add('form-check-input')
  element.setAttribute('id', idInput)
  element.setAttribute('type', 'checkbox')
  return element
}

function getTagTextarea() {
  const element = document.createElement('textarea')
  element.classList.add('form-control')
  element.setAttribute('rows', 3)
  return element
}

function getTagSelect() {
  const element = document.createElement('select')
  element.classList.add('form-select')
  return element
}

function getTagOption(textContent, value) {
  const element = document.createElement('option')
  element.setAttribute('value', value)
  element.textContent = textContent
  return element
}

function getTagDatalist() {
  const element = document.createElement('datalist')
  return element
}

// элементы таблиц
function getTagDiv_table() {
  // горизонтальная прокрутка
  const element = document.createElement('div')
  element.classList.add('table-responsive')
  return element
}

function getTagTable() {
  const element = document.createElement('table')
  element.className = 'table table-hover table-bordered caption-top'
  return element
}

function getTagCaption(textContent) {
  const element = document.createElement('caption')
  element.textContent = textContent
  return element
}

function getTagTHead() {
  const element = document.createElement('thead')
  element.classList.add('table-secondary')
  return element
}

function getTagTBody() {
  const element = document.createElement('tbody')
  return element
}

function getTagTR() {
  const element = document.createElement('tr')
  return element
}

function getTagTH(textContent) {
  const element = document.createElement('th')
  element.setAttribute('scope', 'col')
  element.classList.add('fs-6')
  element.textContent = textContent
  return element
}

function getTagTD(textContent) {
  const element = document.createElement('td')
  element.classList.add('fs-6')
  element.textContent = textContent
  return element
}

// карточки с навигацией
function getCardRow() {
  const divEl_row = document.createElement('div')
  divEl_row.className = 'row text-center justify-content-center'
  divEl_row.setAttribute('id', 'cardNav')

  return divEl_row
}

function getCardNav(title, text) {
  const colCard = document.createElement('div')
  colCard.className = 'col-auto mb-3'

  const card = document.createElement('div')
  card.className = 'card h-100'

  const cardBody = document.createElement('div')
  cardBody.className = 'card-body bg-secondary-subtle'

  const titleEl = document.createElement('h5')
  titleEl.classList.add('card-title')
  titleEl.textContent = title

  const textEl = document.createElement('p')
  textEl.classList.add('card-text')
  textEl.textContent = text

  const btnEl = document.createElement('button')
  btnEl.className = 'btn btn-primary btnNav'
  btnEl.textContent = 'Перейти'
  btnEl.setAttribute('data-id', title)

  cardBody.append(titleEl, textEl, btnEl)
  card.append(cardBody)
  colCard.append(card)
  return colCard
}

function getTagButton_logout() {
  const element = document.createElement('button')
  element.setAttribute('type', 'button')
  element.className = 'btn btn-link'
  element.textContent = 'Выйти'
  element.addEventListener('click', () => {
    clearAuthData()
    window.location.reload()
  })
  return element
}
