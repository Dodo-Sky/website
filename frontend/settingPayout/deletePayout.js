import { renderTable } from './renderTable.js';
import { deleteServerApi } from '../apiServer.js';

export async function deletePayout () {
const deleteButton = document.querySelectorAll('.deleteButton');
  deleteButton.forEach((button) => {
    button.addEventListener('click', async function (e) {

      const id = e.target.dataset.id;
      console.log(id);
      await deleteServerApi(id);

      document.querySelector('.table-light').innerHTML = '';
      renderTable();
    });
  });
}
