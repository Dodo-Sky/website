import { getServerApi } from '../apiServer.js';
import { getForm } from './workingForm.js';
import * as components from '../components.js';

export async function renderData() {
  const unitsSettings = await getServerApi('unitsSettings');

  // отрисовка верхней навигации
  const unitSettings_nav = document.querySelector('.unitSettings_nav');

  const navEl = components.getTagNavigation();
  const ulEL_nav = components.getTagUnorderedListNav();

  const liEl_dropdown_toggle = components.getTagListItemDropdownToggle('Пиццерии');
  const ulEl_dropdown_menu = components.getTagUnorderedListDropdownMenu();
  liEl_dropdown_toggle.append(ulEl_dropdown_menu);
  for (const unit of unitsSettings) {
    if (unit.type !== 'Пиццерия') continue;
    const liEl_dropdown_item = components.getTagListItemDropdownItem(unit.unitName);
    ulEl_dropdown_menu.append(liEl_dropdown_item);
  }
  const liEl_prz = components.getTagListItemNav('Тюмень-ПРЦ-3');
  const liEl_ofis = components.getTagListItemNav('Офис');
  ulEL_nav.append(liEl_dropdown_toggle, liEl_prz, liEl_ofis);
  navEl.append(ulEL_nav);
  unitSettings_nav.append(navEl);

  // активация кнопок
  unitSettings_nav.addEventListener('click', function (e) {
    let liEl = unitSettings_nav.querySelectorAll('.nav-item');
    liEl.forEach((el) => {
      el.classList.remove('active');
    });
    if (e.target.className.includes('nav-item nav-link')) {
      e.target.classList.add('active');
    }

    // отрисовка пиццерий
    const $content = document.querySelector('.unitSettings_content');
    $content.innerHTML = '';
    for (const unit of unitsSettings) {
      if (unit.unitName !== e.target.textContent) continue;

      const title = components.getTagHeading(6, `Информация по подразделению ${unit.unitName}`);
      const unitNameEl = components.getTagParagraph(`Название - ${unit.unitName}`);
      $content.append(title, unitNameEl);

      if (unit.type === 'Пиццерия') {
        const deliveryWork = components.getTagParagraph(
          `Время работы доставки: с ${unit.timeWork.delivery.workingTimeStart} до ${unit.timeWork.delivery.workingTimeStop}`,
        );
        deliveryWork.classList.add('mb-0');
        const restoranWork = components.getTagParagraph(
          `Время работы ресторана: с ${unit.timeWork.restoran.workingTimeStart} до ${unit.timeWork.restoran.workingTimeStop}`,
        );

        // таблица по программам
        const table = components.getTagTable();
        const captionEl1 = components.getTagCaption('Список программ');
        const tHead = components.getTagTableHead();
        const tBody = components.getTagTableBody();
        const trEl = components.getTagTableRow();
        const thName = components.getTagTableHeaderCell('Наименование программы');
        const thStatus = components.getTagTableHeaderCell('Состояние');
        trEl.append(thName, thStatus);
        tHead.append(trEl);
        for (const program of unit.programs) {
          const trEl = components.getTagTableRow();
          let tdElname = components.etTagTableDataCell(program.name);

          let isActive = program.isActive ? 'Включена' : 'Отключена';
          let tdElactive = components.etTagTableDataCell(isActive);
          if (isActive === 'Включена') tdElactive.classList.add('table-success');
          if (isActive === 'Отключена') tdElactive.classList.add('table-danger');
          trEl.append(tdElname, tdElactive);
          tBody.append(trEl);
        }
        table.append(captionEl1, tHead, tBody);
        $content.append(deliveryWork, restoranWork, table);
      }

      if (unit.type === 'Тюмень-ПРЦ-3') {
        const deliveryWork = components.getTagParagraph(
          `Время работы ПРЦ: с ${unit.timeWork.workingTimeStart} до ${unit.timeWork.workingTimeStop}`,
        );
        $content.append(deliveryWork);
      }

      // таблица по ID телеграмм
      const tableId = components.getTagTable();
      const captionEl = components.getTagCaption('Список ID телеграмм');
      const tHeadId = components.getTagTableHead();
      const tBodyId = components.getTagTableBody();
      const trElId = components.getTagTableRow();
      const thId = components.getTagTableHeaderCell('Id телеграмм');
      const thNameFunction = components.getTagTableHeaderCell('Функция');
      const thfio = components.getTagTableHeaderCell('ФИО');
      trElId.append(thId, thNameFunction, thfio);
      tHeadId.append(trElId);

      for (const idTelegram of unit.idTelegramm) {
        const trEl = components.getTagTableRow();
        let tdid = components.etTagTableDataCell(idTelegram.id);
        let tdnameFunction = components.etTagTableDataCell(idTelegram.nameFunction);
        let tdfio = components.etTagTableDataCell(idTelegram.fio);
        trEl.append(tdid, tdnameFunction, tdfio);
        tBodyId.append(trEl);
      }
      tableId.append(captionEl, tHeadId, tBodyId);
      $content.append(tableId);

      let btnEdit = components.getTagButton('Редактировать подразделение', 'submit');
      btnEdit.setAttribute('data-id', unit.unitId);
      $content.append(btnEdit);
    }
  });
  getForm();
}
