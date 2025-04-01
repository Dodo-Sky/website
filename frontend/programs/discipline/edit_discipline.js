import { getServerApi } from "../../apiServer.js";
import { postServer } from "./server_ discipline.js";

export async function editData(fullDataUnit) {
  makeButtonActive("managerDecision", fullDataUnit);
  makeButtonActive("unitDirectorControl", fullDataUnit);

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
        if (elem.scheduleId) return e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === elem.scheduleId;
        if (!elem.scheduleId) return e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === elem.staffId + elem.clockInAtLocal;
      });
      let btn = e.target.parentNode.parentNode.lastChild.firstChild;
      if (e.target.value !== element[objectProperty]) {
        btn.disabled = false;
      }
      if (e.target.value === element[objectProperty]) {
        btn.disabled = true;
      }
    });
  });
}
