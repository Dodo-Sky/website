import { getServerApi } from "../apiServer.js";
import * as components from "../components.js";

export async function getForm() {
  const unitsSettings = await getServerApi("unitsSettings");
  const $unitSettings_content = document.querySelector(".unitSettings_content");
  $unitSettings_content.addEventListener("click", function (e) {
    if (e.target.textContent === "Редактировать подразделение") {
      console.log(e);
      $unitSettings_content.innerHTML = "";
      const unit = unitsSettings.find((el) => el.unitId === e.target.dataset.id);

      // Редактировать ID в телеграмм
      const formEl = components.getTagForm("form");
      const divRowEl = components.getTagDiv("mb-3");
      let hEl = components.getTagH(5, "Контактные данные");
      divRowEl.classList.add("row");
      formEl.append(divRowEl);
      const divElId = components.getTagDiv("col-md-3");
      divElId.textContent = "ID в телеграмм";
      const divElPosizion = components.getTagDiv("col-md-4");
      divElPosizion.textContent = "Функция";
      const divElfio = components.getTagDiv("col-md-5");
      divElfio.textContent = "ФИО";

      unit.idTelegramm.forEach((el) => {
        let inputEl = components.getTagInput("", "text", el.nameFunction);
        inputEl.classList.add("mb-1");
        inputEl.disabled = true;
        divElPosizion.append(inputEl);

        inputEl = components.getTagInput("", "number", el.id);
        inputEl.classList.add("mb-1");
        divElId.append(inputEl);

        inputEl = components.getTagInput("", "text", el.fio);
        inputEl.classList.add("mb-1");
        if (!el.fio) inputEl.disabled = true;
        divElfio.append(inputEl);
      });

      $unitSettings_content.append(formEl);
      divRowEl.append(hEl, divElPosizion, divElId, divElfio);

      // программы
      if (unit.type === "Пиццерия") {
        const divEl = components.getTagDiv("mb-3");
        formEl.append(divEl);
        hEl = components.getTagH(5, "Список программ");
        divEl.append(hEl);
        unit.programs.forEach((el) => {
          const divElfprograms = components.getTagDiv("mb-0");
          divElfprograms.classList.add("form-check");
          divElfprograms.classList.add("form-switch");

          let inputCheck = components.getTagInput_checkbox(el.name);
          if (el.isActive) inputCheck.checked = true;
          let labelCheck = components.getTagLabel_checkbox(el.name, el.name);
          divElfprograms.append(labelCheck, inputCheck);
          divEl.append(divElfprograms);
        });
      }

      // Рассписания
      if (unit.type === "Пиццерия") {
        let divEl = components.getTagDiv("mb-4");
        formEl.append(divEl);
        hEl = components.getTagH(5, "Время работы");
        divEl.append(hEl);

        function timeWorkDelivery() {
          const divElDel = components.getTagDiv("row");
          let pEl = components.getTagP("Время работы пиццерии на доставку");
          pEl.classList.add("mb-0");
          divElDel.append(pEl);
          divEl.append(divElDel);

          let divElStart = components.getTagDiv("col-auto");
          divElStart.classList.add("mb-3");
          const startInput = components.getTagInput("", "time", unit.timeWork.delivery.workingTimeStart, "старт");
          divElStart.append(startInput);

          let divElStop = components.getTagDiv("col-auto");
          divElStop.classList.add("mb-3");
          const stopInput = components.getTagInput("", "time", unit.timeWork.delivery.workingTimeStop, "стоп");
          divElStop.append(stopInput);
          divElDel.append(divElStart, divElStop);
        }

        function timeWorkRestoran() {
          const divElDel = components.getTagDiv("row");
          let pEl = components.getTagP("Время работы ресторана");
          pEl.classList.add("mb-0");
          divElDel.append(pEl);
          divEl.append(divElDel);

          let divElStart = components.getTagDiv("col-auto");
          const startInput = components.getTagInput("", "time", unit.timeWork.restoran.workingTimeStart, "старт");
          divElStart.append(startInput);

          let divElStop = components.getTagDiv("col-auto");
          const stopInput = components.getTagInput("", "time", unit.timeWork.restoran.workingTimeStop, "стоп");
          divElStop.append(stopInput);
          divElDel.append(divElStart, divElStop);
        }
        timeWorkDelivery();
        timeWorkRestoran();
      }

      let btn = components.getTagButton("внести изменения", "submit");
      $unitSettings_content.append(btn);
    }
  });
}
