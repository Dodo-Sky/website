import { getServerApi } from "../apiServer.js";
import { getForm } from "./workingForm.js";
import * as components from "../components.js";

export async function renderData() {
  const unitsSettings = await getServerApi("unitsSettings");

  // отрисовка верхней навигации
  const unitSettings_nav = document.querySelector(".unitSettings_nav");

  const navEl = components.getNavEl();
  const ulEL_nav = components.getUlEl_nav();

  const liEl_dropdown_toggle = components.getLiEl_dropdown_toggle("Пиццерии");
  const ulEl_dropdown_menu = components.getUlEl_dropdown_menu();
  liEl_dropdown_toggle.append(ulEl_dropdown_menu);
  for (const unit of unitsSettings) {
    if (unit.type !== "Пиццерия") continue;
    const liEl_dropdown_item = components.getLiEl_dropdown_item(unit.unitName);
    ulEl_dropdown_menu.append(liEl_dropdown_item);
  }
  const liEl_prz = components.getLiEl_nav("Тюмень-ПРЦ-3");
  const liEl_ofis = components.getLiEl_nav("Офис");
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
    const $content = document.querySelector(".unitSettings_content");
    $content.innerHTML = "";
    for (const unit of unitsSettings) {
      if (unit.unitName !== e.target.textContent) continue;

      const title = components.getHEl(6, `Информация по подразделению ${unit.unitName}`);
      const unitNameEl = components.getPEl(`Название - ${unit.unitName}`);
      $content.append(title, unitNameEl);

      if (unit.type === "Пиццерия") {
        const deliveryWork = components.getPEl(`Время работы доставки: с ${unit.timeWork.delivery.workingTimeStart} до ${unit.timeWork.delivery.workingTimeStop}`);
        deliveryWork.classList.add("mb-0");
        const restoranWork = components.getPEl(`Время работы ресторана: с ${unit.timeWork.restoran.workingTimeStart} до ${unit.timeWork.restoran.workingTimeStop}`);

        // таблица по программам
        const table = components.getTableEl();
        const captionEl1 = components.getCaptionEl("Список программ");
        const tHead = components.getTheadEl();
        const tBody = components.getTbodyEl();
        const trEl = components.getTrEl();
        const thName = components.getThEl("Наименование программы");
        const thStatus = components.getThEl("Состояние");
        trEl.append(thName, thStatus);
        tHead.append(trEl);
        for (const program of unit.programs) {
          const trEl = components.getTrEl();
          let tdElname = components.getTdEl(program.name);

          let isActive = program.isActive ? "Включена" : "Отключена";
          let tdElactive = components.getTdEl(isActive);
          if (isActive === "Включена") tdElactive.classList.add("table-success");
          if (isActive === "Отключена") tdElactive.classList.add("table-danger");
          trEl.append(tdElname, tdElactive);
          tBody.append(trEl);
        }
        table.append(captionEl1, tHead, tBody);
        $content.append(deliveryWork, restoranWork, table);
      }

      if (unit.type === "Тюмень-ПРЦ-3") {
        const deliveryWork = components.getPEl(`Время работы ПРЦ: с ${unit.timeWork.workingTimeStart} до ${unit.timeWork.workingTimeStop}`);
        $content.append(deliveryWork);
      }

      // таблица по ID телеграмм
      const tableId = components.getTableEl();
      const captionEl = components.getCaptionEl("Список ID телеграмм");
      const tHeadId = components.getTheadEl();
      const tBodyId = components.getTbodyEl();
      const trElId = components.getTrEl();
      const thId = components.getThEl("Id телеграмм");
      const thNameFunction = components.getThEl("Функция");
      const thfio = components.getThEl("ФИО");
      trElId.append(thId, thNameFunction, thfio);
      tHeadId.append(trElId);

      for (const idTelegram of unit.idTelegramm) {
        const trEl = components.getTrEl();
        let tdid = components.getTdEl(idTelegram.id);
        let tdnameFunction = components.getTdEl(idTelegram.nameFunction);
        let tdfio = components.getTdEl(idTelegram.fio);
        trEl.append(tdid, tdnameFunction, tdfio);
        tBodyId.append(trEl);
      }
      tableId.append(captionEl, tHeadId, tBodyId);
      $content.append(tableId);

      let btnEdit = components.getButtonEl("Редактировать подразделение", "submit");
      btnEdit.setAttribute("data-id", unit.unitId);
      $content.append(btnEdit);
    }
  });
  getForm();
}
