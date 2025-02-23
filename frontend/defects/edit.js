import * as components from "../components.js";
import { getServerApi } from "../apiServer.js";
import { postServer } from "./server.js";

export async function editData() {
  const defects = await getServerApi("defects");
  makeButtonActive("disposal", defects);
  makeButtonActive("reasonDefect", defects);
  makeButtonActive("nameViolator", defects);
  makeButtonActive("decisionManager", defects);
  makeButtonActive("control", defects);

  // проверка сохранения данных юзером
  window.addEventListener("beforeunload", function (event) {
    const btns = document.querySelector(".tBody").querySelectorAll(".btn");
    btns.forEach((btn) => {
      if (!btn.disabled) {
        // Recommended https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
        event.preventDefault();
        // Included for legacy support, e.g. Chrome/Edge < 119
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
      let defect = await defects.find((el) => e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === `${el.soldAtLocal}+${el.productId}`);
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
