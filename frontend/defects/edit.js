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
