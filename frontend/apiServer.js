const URL = 'http://178.46.153.198:1860';

// Загрузка данных с сервера (указываем имя переменной на сервере)
export async function getServerApi(variableName) {
  try {
    const response = await fetch(`${URL}/globalGet?payload=${variableName}`);
    if (!response.ok) {
      alert('Ошибка обратитесь к администратору ' + (await response.text()));
    } else {
      return await response.json();
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
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert('Запись обновлена данные сохранены на сервер');
    } else {
      alert('Ошибка обратитесь к администратору ' + (await response.text()));
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
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      alert('Запись обновлена данные сохранены на сервер');
    } else {
      alert('Ошибка обратитесь к администратору ' + (await response.text()));
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
    });
    if (!response.ok) {
      alert('Ошибка обратитесь к администратору ' + (await response.text()));
    }
  } catch (error) {
    alert('Ошибка ' + error.message);
  }
}
