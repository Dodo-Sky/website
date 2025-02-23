import { getServerApi, updateUnitSettings, postDataServer } from "../apiServer.js";
import * as components from "../components.js";

export async function getForm(unitsSettings) {
  const $unitSettings_content = document.querySelector(".unitSettings_content");
  $unitSettings_content.addEventListener("click", function (e) {
    if (e.target.textContent === "Редактировать подразделение") {
      $unitSettings_content.innerHTML = "";
      const unit = unitsSettings.find((el) => el.unitId === e.target.dataset.id);

      // Редактировать ID в телеграмм
      const formEl = components.getTagForm("form");
      const divRowEl = components.getTagDiv("mb-3");
      divRowEl.classList.add("row");
      let hEl = components.getTagH(5, "Контактные данные");
      formEl.append(divRowEl);
      const divElId = components.getTagDiv("col-md-3");
      divElId.textContent = "ID в телеграмм";
      const divElPosizion = components.getTagDiv("col-md-4");
      divElPosizion.textContent = "Функция";
      const divElfio = components.getTagDiv("col-md-5");
      divElfio.textContent = "ФИО";

      unit.idTelegramm.forEach((el) => {
        let nameFunctionInput = components.getTagInput("text", el.nameFunction);
        nameFunctionInput.classList.add("mb-1");
        nameFunctionInput.disabled = true;
        divElPosizion.append(nameFunctionInput);

        let idInput = components.getTagInput("number", el.id);
        idInput.classList.add("mb-1");
        idInput.classList.add("idInput");
        idInput.setAttribute("data-function", el.nameFunction);
        divElId.append(idInput);

        let fioInput = components.getTagInput("text", el.fio);
        fioInput.classList.add("mb-1");
        fioInput.classList.add("fioInput");
        fioInput.setAttribute("data-function", el.nameFunction);
        if (!el.fio) fioInput.disabled = true;
        divElfio.append(fioInput);
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

          let programmInput = components.getTagInput_checkbox(el.name);
          programmInput.setAttribute("name", el.name);
          programmInput.classList.add("programmInput");
          programmInput.setAttribute("data-program", el.name);

          if (el.isActive) programmInput.checked = true;
          if (!el.isActive) programmInput.checked = false;
          let labelCheck = components.getTagLabel_checkbox(el.name, el.name);
          divElfprograms.append(labelCheck, programmInput);
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
          const startInput = components.getTagInput("time", unit.timeWork.delivery.workingTimeStart);
          startInput.setAttribute("name", "deliveryStart");
          divElStart.append(startInput);

          let divElStop = components.getTagDiv("col-auto");
          divElStop.classList.add("mb-3");
          const stopInput = components.getTagInput("time", unit.timeWork.delivery.workingTimeStop);
          stopInput.setAttribute("name", "deliveryStop");
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
          const startInput = components.getTagInput("time", unit.timeWork.restoran.workingTimeStart);
          startInput.setAttribute("name", "restoranStart");
          divElStart.append(startInput);

          let divElStop = components.getTagDiv("col-auto");
          const stopInput = components.getTagInput("time", unit.timeWork.restoran.workingTimeStop);
          stopInput.setAttribute("name", "restoranStop");
          divElStop.append(stopInput);
          divElDel.append(divElStart, divElStop);
        }

        timeWorkDelivery();
        timeWorkRestoran();
      }

      let btn = components.getTagButton("Внести изменения", "submit");
      btn.setAttribute("id", "submit");
      formEl.append(btn);

      // отправка формы на сервер
      formEl.addEventListener("submit", async function (e) {
        e.preventDefault();
        // формирование idTelegramm
        let idTelegramm = [];
        const idInputs = document.querySelectorAll(".idInput");
        const fioInputs = document.querySelectorAll(".fioInput");
        for (const idInput of idInputs) {
          let fio;
          for (const fioInput of fioInputs) {
            if (fioInput.dataset.function !== idInput.dataset.function) continue;
            fio = fioInput.value;
          }
          idTelegramm.push({
            nameFunction: idInput.dataset.function,
            id: +idInput.value,
            fio,
          });
        }
        // программы
        const programmInputs = document.querySelectorAll(".programmInput");
        let programs = [];
        programmInputs.forEach((programmInput) => {
          programs.push({
            name: programmInput.dataset.program,
            isActive: programmInput.checked ? true : false,
          });
        });

        const formData = new FormData(formEl);
        let dataToServer;
        if (unit.type === "Пиццерия") {
          dataToServer = {
            idTelegramm,
            unitId: unit.unitId,
            timeWork: {
              delivery: {
                workingTimeStart: formData.get("deliveryStart"),
                workingTimeStop: formData.get("deliveryStop"),
              },
              restoran: {
                workingTimeStart: formData.get("restoranStart"),
                workingTimeStop: formData.get("restoranStop"),
              },
            },
            programs,
          };
        } else {
          dataToServer = { idTelegramm, unitId: unit.unitId };
        }
        let responce = await postDataServer("unitsSettings", dataToServer);
        if (responce) {
          alert ('Изменения сохранены')
        }
      });
    }
  });
}
