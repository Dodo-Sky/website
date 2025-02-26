import { getServerApi } from "../../apiServer.js";
import { getForm } from "./workingForm.js";
import * as components from "../../components.js";

export async function renderData() {
  const content = document.querySelector(".contentSetting");
  content.innerHTML = "";
  
  // спинер
  content.innerHTML = `
  <div class="spinner-border" role="status">
  <span class="visually-hidden">Загрузка...</span>
  </div>`;

  let unitsSettings = await getServerApi("unitsSettings");
  unitsSettings.sort ((a,b) => a.unitName.localeCompare(b.unitName))

  const unitSettings_nav = components.getTagDiv("unitSettings_nav");
  content.append(unitSettings_nav);
  const $content = components.getTagDiv("unitSettings_content");
  content.append($content);

  // выключаем спинер
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none'

  // отрисовка верхней навигации
  const navEl = components.getTagNav();
  const ulEL_nav = components.getTagUL_nav();
  ulEL_nav.classList.add("nav-tabs");

  const liEl_dropdown_toggle = components.getTagLI_dropdownToggle("Пиццерии");
  const ulEl_dropdown_menu = components.getTagUL_dropdownMenu();
  liEl_dropdown_toggle.append(ulEl_dropdown_menu);

  for (const unit of unitsSettings) {
    if (unit.type !== "Пиццерия") continue;
    const liEl_dropdown_item = components.getTagLI_dropdownItem(unit.unitName);
    ulEl_dropdown_menu.append(liEl_dropdown_item);
  }
  const liEl_prz = components.getTagLI_nav("Тюмень-ПРЦ-3");
  const liEl_ofis = components.getTagLI_nav("Офис");
  ulEL_nav.append(liEl_dropdown_toggle, liEl_prz, liEl_ofis);
  navEl.append(ulEL_nav);
  unitSettings_nav.append(navEl);

  // активация кнопок
  unitSettings_nav.addEventListener("click", function (e) {
    let liEl = unitSettings_nav.querySelectorAll(".nav-item");
    liEl.forEach((el) => {
      el.classList.remove("active");
    });
    if (e.target.className.includes("nav-item nav-link")) {
      e.target.classList.add("active");
    }

    // отрисовка пиццерий
    $content.innerHTML = "";
    for (const unit of unitsSettings) {
      if (unit.unitName !== e.target.textContent) continue;

      const title = components.getTagH(6, `Информация по подразделению ${unit.unitName}`);
      const unitNameEl = components.getTagP(`Название - ${unit.unitName}`);
      $content.append(title, unitNameEl);

      if (unit.type === "Пиццерия") {
        const deliveryWork = components.getTagP(`Время работы доставки: с ${unit.timeWork.delivery.workingTimeStart} до ${unit.timeWork.delivery.workingTimeStop}`);
        deliveryWork.classList.add("mb-0");
        const restoranWork = components.getTagP(`Время работы ресторана: с ${unit.timeWork.restoran.workingTimeStart} до ${unit.timeWork.restoran.workingTimeStop}`);

        // таблица по программам
        const table = components.getTagTable();
        const captionEl1 = components.getTagCaption("Список программ");
        const tHead = components.getTagTHead();
        const tBody = components.getTagTBody();
        const trEl = components.getTagTR();
        const thName = components.getTagTH("Наименование программы");
        const thStatus = components.getTagTH("Состояние");
        trEl.append(thName, thStatus);
        tHead.append(trEl);
        for (const program of unit.programs) {
          const trEl = components.getTagTR();
          let tdElname = components.getTagTD(program.name);

          let isActive = program.isActive ? "Включена" : "Отключена";
          let tdElactive = components.getTagTD(isActive);
          if (isActive === "Включена") tdElactive.classList.add("table-success");
          if (isActive === "Отключена") tdElactive.classList.add("table-danger");
          trEl.append(tdElname, tdElactive);
          tBody.append(trEl);
        }
        table.append(captionEl1, tHead, tBody);
        $content.append(deliveryWork, restoranWork, table);
      }

      if (unit.type === "Тюмень-ПРЦ-3") {
        const deliveryWork = components.getTagP(`Время работы ПРЦ: с ${unit.timeWork.workingTimeStart} до ${unit.timeWork.workingTimeStop}`);
        $content.append(deliveryWork);
      }

      // таблица по ID телеграмм
      const tableId = components.getTagTable();
      const captionEl = components.getTagCaption("Список ID телеграмм");
      const tHeadId = components.getTagTHead();
      const tBodyId = components.getTagTBody();
      const trElId = components.getTagTR();
      const thId = components.getTagTH("Id телеграмм");
      const thNameFunction = components.getTagTH("Функция");
      const thfio = components.getTagTH("ФИО");
      trElId.append(thId, thNameFunction, thfio);
      tHeadId.append(trElId);

      for (const idTelegram of unit.idTelegramm) {
        const trEl = components.getTagTR();
        let tdid = components.getTagTD(idTelegram.id);
        let tdnameFunction = components.getTagTD(idTelegram.nameFunction);
        let tdfio = components.getTagTD(idTelegram.fio);
        trEl.append(tdid, tdnameFunction, tdfio);
        tBodyId.append(trEl);
      }
      tableId.append(captionEl, tHeadId, tBodyId);
      $content.append(tableId);

      let btnEdit = components.getTagButton("Редактировать подразделение", "submit");
      btnEdit.setAttribute("data-id", unit.unitId);
      $content.append(btnEdit);
    }
  });
  getForm(unitsSettings);
}
