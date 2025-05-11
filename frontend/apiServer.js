import { URL } from './config.js';

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export async function loginServerApi(login, password, onSuccess) {
  const response = await fetch(`${URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });
  const data = await response.json();
  console.log(data);
  if (data.error === 'invalid credentials') {
    alert('Ошибка. Неправильные логин или пароль');
  }
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('fio', data.fio);
    localStorage.setItem('unitName', data.unitName);
    localStorage.setItem('nameFunction', data.nameFunction);
    localStorage.setItem('departmentName', data.departmentName);
    onSuccess?.();
  }
}

export function handleUnauthorizedResponse(responseDataJSON) {
  try {
    const responseData = JSON.parse(responseDataJSON);
    if (responseData?.error === 'unauthorized') {
      localStorage.removeItem('token');
      window.location.reload();
    }
  } catch (error) {
    console.error('Invalid JSON');
    return;
  }
}

// Загрузка данных с сервера (указываем имя переменной сохраненной на сервере)
export async function getServerApi (variableName) {
  try {
    const response = await fetch(`${URL}/globalGet?payload=${variableName}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    } else {
      return await response.json();
    }
  } catch (error) {
    alert(`Ошибка запроса ${variableName} ` + error.message);
  }
}

// Загрузка данных с сервера (указываем напрямую наименование переменной выгружаемой с сервера)
export async function getDataServer(variableName) {
  try {
    const response = await fetch(`${URL}/${variableName}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    } else {
      return await response.json();
    }
  } catch (error) {
    alert(`Ошибка запроса ${variableName} ` + error.message);
  }
}

export async function postDataServer(variableName, payload) {
  try {
    const url = `${URL}/${variableName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
      // body: payload,
    });
    let data = await response.json();
    if (response.ok) {
      return data;
    } else {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}

// Изменение элемента в массиве объектов переменной на сервере (указываем id элемента а также новую информаицию для этого элемента)
export async function putServerApi(elementId, payload) {
  try {
    const url = `${URL}/config/${elementId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert('Запись обновлена данные сохранены на сервер');
    } else {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}

// Добавление нового объекта в массив объектов на сервере (отправляем {объект})
export async function createServerApi(payload) {
  try {
    const url = `${URL}/config`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert('Запись обновлена данные сохранены на сервер');
    } else {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}

// Удаление элемента из массива (указываем в параметре функции id элемента)
export async function deleteServerApi(id) {
  try {
    const url = `${URL}/config/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      ...getAuthHeaders(),
    });
    if (!response.ok) {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}

export async function updateUnitSettings({ unitId, settings }) {
  const url = `${URL}/unitsSettings/${unitId}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(settings),
    });
    if (response.ok) {
      alert('Данные сохранены');
    } else {
      const responseData = await response.text();
      handleUnauthorizedResponse(responseData);
      alert('Ошибка обратитесь к администратору ' + responseData);
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}

export async function getUsers() {
  try {
    let res = await getServerApi('authTokens');
    return res.filter((el) => el.departmentName === localStorage.getItem('departmentName'));
  } catch (error) {
    console.error('Ошибка загрузки пользователей', error);
    alert('Ошибка загрузки пользователей' + error.message);
  }
}

export async function createUser({ login, password, fio, unitName, role, nameFunction, departmentName }) {
  const url = `${URL}/users`;
  try {
    let request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ login, password, fio, unitName, role, nameFunction, departmentName }),
    });
    if (request.status === 409) {
      throw new Error('Пользователь с таким логином уже существует');
    }
    alert('Пользователь успешно создан!');
  } catch (error) {
    if (error.message === 'Пользователь с таким логином уже существует') {
      console.error('Ошибка создания пользователя', error);
      alert('Ошибка создания пользователя ' + error.message);
    } else {
      console.error('Ошибка создания пользователя', error);
      alert('Ошибка создания пользователя ' + error.message);
      throw error;
    }
  }
}

export async function updateUser({ login, password, fio, unitName, role, nameFunction, departmentName }) {
  const url = `${URL}/users/${login}`;
  try {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ login, password, fio, unitName, role, nameFunction, departmentName }),
    });
  } catch (error) {
    console.error('Ошибка обновления пользователя', error);
    alert('Ошибка обновления пользователя' + error.message);
  }
}

export async function deleteUserByLogin(login) {
  const url = `${URL}/users/${login}`;
  try {
    await fetch(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
  } catch (error) {
    console.error('Ошибка удаления пользователя', error);
    alert('Ошибка удаления пользователя' + error.message);
  }
}

