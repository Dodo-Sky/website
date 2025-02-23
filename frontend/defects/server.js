import { postDataServer } from "../apiServer.js";
const programName = "defects";

export function postServer() {
  const bnts = document.querySelectorAll(".defects-btn-save");
  bnts.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const disposal = trEl.querySelector(".defects-disposal").value;
      const reasonDefect = trEl.querySelector(".defects-reasonDefect").value;
      const nameViolator = trEl.querySelector(".defects-nameViolator").value;
      const decisionManager = trEl.querySelector(".defects-decisionManager").value;
      const control = trEl.querySelector(".defects-control").value;

      let changeServer = {
        soldAtLocal: e.target.dataset.id.split("+")[0],
        productId: e.target.dataset.id.split("+")[1],
        disposal,
        reasonDefect,
        nameViolator,
        decisionManager,
        control,
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(programName, changeServer);
      if (responce.soldAtLocal === e.target.dataset.id.split("+")[0] && responce.productId === e.target.dataset.id.split("+")[1]) {
        btn.disabled = true;
      }
    });
  });
}
