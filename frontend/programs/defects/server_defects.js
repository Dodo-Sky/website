import {postDataServer, putDataServer} from "../../apiServer.js";

export function postServer() {
  const bnts = document.querySelectorAll(".defects-btn-save");
  bnts.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const is_trashed = trEl.querySelector(".defects-disposal").value;
      const reason = trEl.querySelector(".defects-reasonDefect").value;
      const staff_name = trEl.querySelector(".defects-nameViolator").value;
      const graphist_comment = trEl.querySelector(".defects-decisionManager").value;
      const manager_comment = trEl.querySelector(".defects-control").value;

      let changeServer = {
        is_trashed,
        reason,
        staff_name,
        graphist_comment,
        manager_comment,
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await putDataServer(`product-defects/${e.target.dataset.id}`, changeServer);
      if (responce.id === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
