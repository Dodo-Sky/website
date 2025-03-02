// адрес сервера
// с внешней ссылки
const URL = 'http://178.46.153.198:1860/api';
// const URL = 'http://localhost:1880';
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
    onSuccess?.();
  }
}

export function handleUnauthorizedResponse(responseDataJSON) {
  try {
    const responseData = JSON.parse(responseDataJSON)
    if (responseData?.error === 'unauthorized') {
      localStorage.removeItem('token')
      window.location.reload()
    }  
  } catch (error) {
    console.error("Invalid JSON")
    return
  }
}

// по локальной сети
//const URL = 'http://190.186.72.106:86';
// Загрузка данных с сервера (указываем имя переменной сохраненной на сервере)
export async function getServerApi(variableName) {
  try {
    const response = await fetch(`${URL}/globalGet?payload=${variableName}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
      alert('Ошибка обратитесь к администратору ' + responseData);
    } else {
      return await response.json();
    }
  } catch (error) {
    alert(`Ошибка запроса ${variableName} ` + error.message);
  }
  // let test = [variableName, variableName, variableName]
  // return test
}

// Загрузка данных с сервера (указываем напрямую наименование переменной выгружаемой с сервера)
export async function getDataServer(variableName) {
  try {
    const response = await fetch(`${URL}/${variableName}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
      alert('Ошибка обратитесь к администратору ' + responseData);
    } else {
      return await response.json();
    }
  } catch (error) {
    alert(`Ошибка запроса ${variableName} ` + error.message);
  }
}

export async function postDataServer (variableName, payload) {
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
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
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
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
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
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
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
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
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
      const responseData = await response.text()
      handleUnauthorizedResponse(responseData)
      alert('Ошибка обратитесь к администратору ' + responseData);
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}
