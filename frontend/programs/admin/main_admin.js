import { getServerApi } from '../../apiServer.js';
import { renderUsersTable } from './renderTable_admin.js';

const content = document.querySelector('#content');

export async function render() {
  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const authTokens = await getServerApi('authTokens');
  let spiner = document.querySelector('.spinner-border');
  spiner.style.display = 'none';

  renderUsersTable(authTokens);
}
