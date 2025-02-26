import { postDataServer } from "../../apiServer.js";
const programName = "ordersFilter";

export function postServer() {
  const bnts = document.querySelectorAll(".arrayData-btn-save");
  bnts.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const directorComment = trEl.querySelector(".badTrips-directorComment").value;
      const graphistComment = trEl.querySelector(".badTrips-graphistComment").value;

      let changeServer = {
        orderId : btn.dataset.id,
        directorComment,
        graphistComment,
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(programName, changeServer);
      if (responce.orderId === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
