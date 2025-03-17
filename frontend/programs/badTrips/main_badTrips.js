import { getServerApi } from '../../apiServer.js';
import * as components from '../../components.js';
import { renderTable } from './renderTable_badTrips.js';

// Проверка данных на отсутствие несохраненных данных
function editDataNoChange(data, time) {
  const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
  let isCnanges = false;
  btns.forEach((element) => {
    if (!element.disabled) isCnanges = true;
  });
  if (isCnanges) {
    alert('Сохраните данные');
  } else {
    renderTable(data, time);
  }
}

const content = document.getElementById('content');

export async function render(name, breadcrumbs) {
  const breadcrumb = document.querySelector('.breadcrumb');
  breadcrumb.innerHTML = '';
  let navMainEl = components.getTagLI_breadcrumb('Главная');
  let navManaergEl = components.getTagLI_breadcrumb(breadcrumbs);
  let navControlEl = components.getTagLI_breadcrumbActive(name);
  breadcrumb.append(navMainEl, navManaergEl, navControlEl);

  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const couriersOrder = await getServerApi('couriersOrder');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  let row = components.getTagDiv('row');
  const unitsCol = components.getTagDiv('col-auto');
  const sortCol = components.getTagDiv('col-auto');
  row.append(unitsCol, sortCol);

  row.classList.add('mb-3');
  const units = components.getTagDiv('col-auto');
  units.setAttribute('id', 'units');
  unitsCol.append(units);

  const update = components.getTagDiv('col-auto');
  const btnUpdate = components.getTagButton('Обновить');
  btnUpdate.setAttribute('id', 'update');
  update.append(btnUpdate);
  row.append(update);

  const sortEl = components.getTagDiv('row');
  sortEl.classList.add('start-50');
  let sortLabelDiv = components.getTagDiv('col-auto');
  const sortLabel = components.getTagLabel('sort', 'Сортировка');
  sortLabel.className = 'col-form-label';
  sortEl.append(sortLabelDiv);
  sortLabelDiv.append(sortLabel);

  sortLabelDiv = components.getTagDiv('col-auto');
  sortEl.append(sortLabelDiv);
  const sortSelect = components.getTagSelect();
  sortSelect.setAttribute('id', 'sort');
  sortLabelDiv.append(sortSelect);
  const dateOption = components.getTagOption('По дате', 'По дате');
  const courierOption = components.getTagOption('По курьеру', 'По курьеру');
  sortSelect.append(dateOption, courierOption);

  const divEl = components.getTagDiv('badTrips-table');
  const title = components.getTagH(3, name);
  title.classList.add('text-center');
  title.classList.add('sticky-top');

  content.append(title, row, sortEl, divEl);

  getListUnits(couriersOrder);
  filterData(couriersOrder);
}

function getListUnits(couriersOrder) {
  let unitsName = [];
  couriersOrder.forEach((order) => {
    if (!unitsName.includes(order.unitName)) {
      unitsName.push(order.unitName);
    }
  });
  unitsName = unitsName.sort();
  const select = components.getTagSelect();
  select.classList.add('selectUnit');
  unitsName.forEach((unit) => {
    const option = components.getTagOption(unit, unit);
    select.append(option);
  });

  const unitsEl = document.getElementById('units');
  unitsEl.append(select);
}

function filterData(couriersOrder) {
  let ordersFilterPizzeria = couriersOrder.filter((el) => el.unitName === 'Тюмень-1');
  ordersFilterPizzeria.sort(
    (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
  );
  renderTable(ordersFilterPizzeria, 'все время');

  document.querySelector('.selectUnit').addEventListener('change', function (e) {
    ordersFilterPizzeria = couriersOrder.filter((el) => el.unitName === e.target.value);
    ordersFilterPizzeria.sort(
      (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
    );
    editDataNoChange(ordersFilterPizzeria, 'все время');
  });

  document.getElementById('sort').addEventListener('change', function (e) {
    if (e.target.value === 'По курьеру') {
      console.log(e.target.value);
      ordersFilterPizzeria.sort((a, b) => a.fio.localeCompare(b.fio));
      editDataNoChange(ordersFilterPizzeria, 'все время');
    }
    if (e.target.value === 'По дате') {
      console.log(ordersFilterPizzeria);
      ordersFilterPizzeria.sort((a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt));
      editDataNoChange(ordersFilterPizzeria, 'все время');
    }
  });

  // обновить
  let btnUpdate = document.getElementById('update');
  let selectUnit = document.querySelector('.selectUnit');
  btnUpdate.addEventListener('click', async function (e) {
    const couriersOrder = await getServerApi('couriersOrder');
    let data = couriersOrder.filter((el) => el.unitName === selectUnit.value);
    filterData = data.filter((el) => {
      let now = new Date();
      return (
        new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 1))
      );
    });
    editDataNoChange(filterData, 'за сутки');
  });

  // сортировка по времени
  const tableContent = document.querySelector('.badTrips-table');
  let filterData;

  tableContent.addEventListener('click', function (e) {
    // сортировка по дате
    if (e.target.textContent === 'За прошедшие сутки') {
      filterData = ordersFilterPizzeria.filter((el) => {
        let now = new Date();
        return (
          new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 1))
        );
      });
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'за сутки');
    }
    if (e.target.textContent === 'За прошедшие 3 дня') {
      filterData = ordersFilterPizzeria.filter((el) => {
        let now = new Date();
        return (
          new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 3))
        );
      });
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'за 3 дня');
    }
    if (e.target.textContent === 'За последнюю неделю') {
      filterData = ordersFilterPizzeria.filter((el) => {
        let now = new Date();
        return (
          new Date(el.handedOverToDeliveryAt) > new Date(now.setDate(now.getDate() - 7))
        );
      });
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'за неделю');
    }
    if (
      e.target.textContent === 'Показать за все время' ||
      e.target.textContent === 'Показать все'
    ) {
      ordersFilterPizzeria.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      renderTable(ordersFilterPizzeria, 'все время');
    }
    // сортировка по менеджеру и управляющему
    if (e.target.textContent === 'Только просроченные менеджером') {
      filterData = ordersFilterPizzeria.filter(
        (el) => el.graphistComment === 'Просрочка',
      );
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'все время');
    }
    if (e.target.textContent === 'В работе менеджера (пустые)') {
      filterData = ordersFilterPizzeria.filter((el) => !el.graphistComment);
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'все время');
    }
    if (e.target.textContent === 'Только просроченные управляющим') {
      filterData = ordersFilterPizzeria.filter(
        (el) => el.directorComment === 'Просрочка',
      );
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'все время');
    }
    if (e.target.textContent === 'В работе управляющего (пустые)') {
      filterData = ordersFilterPizzeria.filter((el) => !el.directorComment);
      filterData.sort(
        (a, b) => new Date(a.handedOverToDeliveryAt) - new Date(b.handedOverToDeliveryAt),
      );
      editDataNoChange(filterData, 'все время');
    }
  });
}
