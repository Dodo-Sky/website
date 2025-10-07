import { postDataServer } from '../../apiServer.js';
const variableName = 'dismissed';

export function postServer() {
  const bnts = document.querySelectorAll('.arrayData-btn-save');
  bnts.forEach((btn) => {
    btn.addEventListener('click', async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const resolutionManager = trEl.querySelector('.dismissed-resolutionManager').value;
      const result = trEl.querySelector('.dismissed-result').value;
      const dateBack = trEl.querySelector('.dismissed-dateBack').value;
      const furtherCall = trEl.querySelector('.dismissed-furtherCall').value;

      let changeServer = {
        idContact: btn.dataset.id,
        resolutionManager,
        result,
        dateBack,
        furtherCall,
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(variableName, changeServer);
      if (responce.idContact === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}
