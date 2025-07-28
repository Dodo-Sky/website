import { postServer } from "./server_discipline.js";

export async function editData (fullDataUnit) {
  makeButtonActive("managerDecision", fullDataUnit);
  makeButtonActive("unitDirectorControl", fullDataUnit);
  makeButtonActive("reason_absenteeism", fullDataUnit);

  // проверка сохранения данных юзером
  window.addEventListener("beforeunload", function (event) {
    const btns = document.querySelector(".tBody").querySelectorAll(".arrayData-btn-save");
    btns.forEach((btn) => {
      if (!btn.disabled) {
        event.preventDefault();
        event.returnValue = true;
      }
    });
  });
  postServer();
}

function makeButtonActive(objectProperty, dataFromServer) {
  const property = document.querySelectorAll(`.discipline-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener("input", async function (e) {
      let element = await dataFromServer.find((elem) => {
        if (elem.id) return e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === elem.id;
        if (!elem.id) return e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === elem.staffId + elem.clockInAtLocal;
      });
      let btn = e.target.parentNode.parentNode.lastChild.firstChild;
      let value = e.target.value

      if (e.target.type === "checkbox") {
        value = e.target.checked;
      }

      console.log("objectProperty", objectProperty)
      console.log("element", element)
      console.log("element[objectProperty]", element[objectProperty])

      if (value !== element[objectProperty]) {
        btn.disabled = false;
      }
      if (value === element[objectProperty]) {
        btn.disabled = true;
      }
    });
  });
}
