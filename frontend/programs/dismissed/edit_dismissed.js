import { getServerApi } from '../../apiServer.js';
import { postServer } from "./server_dismissed.js";

export async function editData() {
  const dismissed = await getServerApi('dismissed');
  makeButtonActive('resolutionManager', dismissed);
  makeButtonActive('result', dismissed);
  makeButtonActive('dateBack', dismissed);
  makeButtonActive('furtherCall', dismissed);

  // проверка сохранения данных юзером
  window.addEventListener('beforeunload', function (event) {
    const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
    btns.forEach((btn) => {
      if (!btn.disabled) {
        event.preventDefault();
        event.returnValue = true;
      }
    });
  });
  postServer();
}

function makeButtonActive(objectProperty, dismissed) {
  const property = document.querySelectorAll(`.dismissed-${objectProperty}`);
  property.forEach((el) => {
    el.addEventListener('input', async function (e) {
      const staff = await dismissed.find((el) =>
        el.contact?.find(
          (elem) =>
            elem.idContact ===
            e.target.parentNode.parentNode.lastChild.firstChild.dataset.id,
        ),
      );
      let idContact = staff.contact.find(
        (el) =>
          el.idContact === e.target.parentNode.parentNode.lastChild.firstChild.dataset.id,
      );
      let btn = e.target.parentNode.parentNode.lastChild.firstChild;

      if (objectProperty === 'dateBack') {
        if (e.target.value !== staff[objectProperty]) {
          btn.disabled = false;
        }
        if (e.target.value === staff[objectProperty]) {
          btn.disabled = true;
        }
      }

      if (objectProperty === 'furtherCall') {
        if (e.target.value !== staff[objectProperty]) {
          btn.disabled = false;
        }
        if (e.target.value === staff[objectProperty]) {
          btn.disabled = true;
        }
      }

      if (e.target.value !== idContact[objectProperty]) {
        btn.disabled = false;
      }
      if (e.target.value === idContact[objectProperty]) {
        btn.disabled = true;
      }
    });
  });
}
