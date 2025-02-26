import { getServerApi } from "../../apiServer.js";
import { postServer } from "./server_idTeleramm.js";

export async function editData() {
  const dataFromServer = await getServerApi("notDismissedStaff");
  makeButtonActive("idTelegramm", dataFromServer);

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

function makeButtonActive(objectProperty, dataFromServer) {
  const property = document.querySelectorAll(`.idTelegramm-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener("input", async function (e) {
      let element = await dataFromServer.find((el) => e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === el.id);
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
