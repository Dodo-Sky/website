import { postDataServer } from "../../apiServer.js";
const programName = "editStaffData";

export function postServer() {
  const bnts = document.querySelectorAll(".arrayData-btn-save");
  bnts.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const idTelegramm = trEl.querySelector(".idTelegramm-idTelegramm").value;

      let changeServer = {
        id: btn.dataset.id,
        idTelegramm,
        departmentName: localStorage.getItem ('departmentName'),
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(programName, changeServer);
      if (responce.id === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
    