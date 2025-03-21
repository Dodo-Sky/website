
import { getServerApi } from "../../apiServer.js";
import { postServer } from "./server_defects.js";

export async function editData(dataFromServer) {
  //const defects = await getServerApi("defects");
  makeButtonActive("disposal", dataFromServer);
  makeButtonActive("reasonDefect", dataFromServer);
  makeButtonActive("nameViolator", dataFromServer);
  makeButtonActive("decisionManager", dataFromServer);
  makeButtonActive("control", dataFromServer);

  // проверка сохранения данных юзером
  window.addEventListener("beforeunload", function (event) {
    const btns = document.querySelector(".tBody").querySelectorAll(".defects-btn-save");
    btns.forEach((btn) => {
      if (!btn.disabled) {
        event.preventDefault();
        event.returnValue = true;
      }
    });
  });
  postServer();
}

function makeButtonActive(objectProperty, defects) {
  const property = document.querySelectorAll(`.defects-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener("input", async function (e) {
      let defect = await defects.find((el) => e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === `${el.id}`);
      let btn = e.target.parentNode.parentNode.lastChild.firstChild;
      if (e.target.value !== defect[objectProperty]) {
        btn.disabled = false;
      }
      if (e.target.value === defect[objectProperty]) {
        btn.disabled = true;
      }
    });
  });
}
