import * as components from "../components.js";
import { getServerApi } from "../apiServer.js";

function makeButtonActive(objectProperty, defects) {
  const property = document.querySelectorAll(`.defects-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener("input", async function (e) {
      let defect = await defects.find((el) => e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === `${el.soldAtLocal}+${el.productId}`);
      let btn = e.target.parentNode.parentNode.lastChild.firstChild;
      if (e.target.value !== defect[objectProperty]) {
        btn.disabled = false;
      }
    });
  });
}

export async function editData() {
  const defects = await getServerApi("defects");
  makeButtonActive("disposal", defects);
  makeButtonActive("reasonDefect", defects);
  makeButtonActive("nameViolator", defects);
  makeButtonActive("decisionManager", defects);
  makeButtonActive("control", defects);

  const bnts = document.querySelectorAll(".btn");
  bnts.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      console.log(e.target);
      let defect = defects.find((el) => e.target.dataset.id === `${el.soldAtLocal}+${el.productId}`);
      //тут размещаем информацию на сервер 
    });
  });


  
}
