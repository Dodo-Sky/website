import { renderTable } from './render.js';

export async function deletePayout () {
const deleteButton = document.querySelectorAll('.deleteButton');
console.log(deleteButton);
  deleteButton.forEach((button) => {
    button.addEventListener('click', async function (e) {

      const id = e.target.dataset.id;
      console.log(id);
      async function deleteConfig(configId) {
        const url = `http://178.46.153.198:1860/config/${configId}`;
        const response = await fetch(url, {
          method: 'DELETE',
        });
        const data = await response.json();
      }
      await deleteConfig(id);

      document.querySelector('.table-light').innerHTML = '';

      renderTable();
    });
  });
}
