import { getServerApi } from '../../apiServer.js'
import * as components from '../../components.js'
import { renderUsersTable } from './renderTable_admin.js'

const content = document.getElementById('content')

export async function render() {
  const authTokens = await getServerApi('authTokens')
  renderUsersTable(authTokens)
}
