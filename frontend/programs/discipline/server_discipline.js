import { postDataServer } from "../../apiServer.js";
const departmentName = localStorage.getItem('departmentName');
const variableName = "discipline";

export function postServer() {
  const bnts = document.querySelectorAll(".arrayData-btn-save");
  bnts.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const unitDirectorControl = trEl.querySelector(".discipline-unitDirectorControl").value;
      const managerDecision = trEl.querySelector(".discipline-managerDecision").value;

      let changeServer = {
        scheduleId : btn.dataset.id,
        unitDirectorControl,
        managerDecision,
        departmentName,
      };
      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(variableName, changeServer);
      if (responce.scheduleId === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
