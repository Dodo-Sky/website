import { getServerApi, updateUnitSettings } from "../apiServer.js";
import * as components from "../components.js";

function createFormSubmitHandler(unitId) {
  async function onFormSubmit(event) {
    event.preventDefault();

    const inventoryStocksInput = document.querySelector('[id="Уведомление по складским остаткам"]');
    const problematicOrdersInput = document.querySelector('[id="Проблемные заказы"]');
    const disciplineInput = document.querySelector('[id="Соблюдение дисциплины"]');
    const defectsControlInput = document.querySelector('[id="Контроль брака"]');

    const programs = [
      { name: "Уведомление по складским остаткам", isActive: inventoryStocksInput.checked },
      { name: "Проблемные заказы", isActive: problematicOrdersInput.checked },
      { name: "Соблюдение дисциплины", isActive: disciplineInput.checked },
      { name: "Контроль брака", isActive: defectsControlInput.checked },
    ];

    const deliveryWorkTimeStartInput = document.querySelector("#form > div.mb-4 > div:nth-child(2) > div:nth-child(2) > input");
    const deliveryWorkTimeStopInput = document.querySelector("#form > div.mb-4 > div:nth-child(2) > div:nth-child(3) > input");

    const restaurantWorkTimeStartInput = document.querySelector("#form > div.mb-4 > div:nth-child(3) > div:nth-child(2) > input");
    const restaurantWorkTimeStopInput = document.querySelector("#form > div.mb-4 > div:nth-child(3) > div:nth-child(2) > input");

    const idTelegramInputs = document.querySelectorAll("#form > div.mb-3.row > div.col-md-3 input");
    const fullNameInputs = document.querySelectorAll("#form > div.mb-3.row > div.col-md-5 input");

    const rowCount = Math.min(idTelegramInputs.length, fullNameInputs.length);

    const staffData = [];
    for (let i = 0; i < rowCount; i++) {
      staffData.push({
        idTelegram: idTelegramInputs[i].value,
        fullName: fullNameInputs[i].value,
      });
    }

    const timeWork = {
      delivery: {
        workingTimeStart: deliveryWorkTimeStartInput.value,
        workingTimeStop: deliveryWorkTimeStopInput.value,
      },
      restoran: {
        workingTimeStart: restaurantWorkTimeStartInput.value,
        workingTimeStop: restaurantWorkTimeStopInput.value,
      },
    };

    const requestData = {
      programs,
      timeWork,
      staffData,
    };

    await updateUnitSettings({ unitId, settings: requestData });
  }

  return onFormSubmit;
}

export async function getForm(unitsSettings) {
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

      let btn = components.getTagButton("Внести изменения", "submit");
      $unitSettings_content.append(btn);

      btn.addEventListener("click", createFormSubmitHandler(unit.unitId));
    }
  });
}
