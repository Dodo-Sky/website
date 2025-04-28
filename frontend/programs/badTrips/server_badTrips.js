import { postDataServer } from '../../apiServer.js';
const variableName = 'couriersOrder';

export function postServer() {
  const bnts = document.querySelectorAll('.arrayData-btn-save');
  bnts.forEach((btn) => {
    btn.addEventListener('click', async function (e) {
      const trEl = e.target.parentNode.parentNode;
      const directorComment = trEl.querySelector('.badTrips-directorComment').value;
      const graphistComment = trEl.querySelector('.badTrips-graphistComment').value;

      let changeServer = {
        orderId: btn.dataset.id,
        directorComment,
        graphistComment,
        departmentName: localStorage.getItem('departmentName'),
      };

      // Отправляем на сервер изменения, смотрим ответ и делаем кнопку неактивной
      let responce = await postDataServer(variableName, changeServer);
      if (responce.orderId === e.target.dataset.id) {
        btn.disabled = true;
      }
    });
  });
}

