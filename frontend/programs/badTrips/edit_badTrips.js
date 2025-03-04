import { getServerApi } from "../../apiServer.js";
import { postServer } from "./server_badTrips.js";

export async function editData() {
  const dataFromServer = await getServerApi("couriersOrder");
  makeButtonActive("graphistComment", dataFromServer);
  makeButtonActive("directorComment", dataFromServer);

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
  const property = document.querySelectorAll(`.badTrips-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener("input", async function (e) {
      let element = await dataFromServer.find((el) => e.target.parentNode.parentNode.lastChild.firstChild.dataset.id === el.orderId);
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
