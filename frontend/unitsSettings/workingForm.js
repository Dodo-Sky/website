import { getServerApi } from '../apiServer.js';
import * as components from '../components.js';

export async function getForm() {
  const unitsSettings = await getServerApi('unitsSettings');
  const $unitSettings_content = document.querySelector('.unitSettings_content');
  $unitSettings_content.addEventListener('click', function (e) {
    if (e.target.textContent === 'Редактировать подразделение') {
      $unitSettings_content.innerHTML = '';
      const unit = unitsSettings.find((el) => el.unitId === e.target.dataset.id);
      console.log(unit);

      // Редактировать ID в телеграмм
      const formEl = components.getFormEl('form');
      const divRowEl = components.getDivEl('mb-3');
      let hEl = components.getHEl(5, 'Контактные данные');
      divRowEl.classList.add('row');
      formEl.append(divRowEl);
      const divElId = components.getDivEl('col-md-3');
      divElId.textContent = 'ID в телеграмм';
      const divElPosizion = components.getDivEl('col-md-4');
      divElPosizion.textContent = 'Функция';
      const divElfio = components.getDivEl('col-md-5');
      divElfio.textContent = 'ФИО';

      unit.idTelegramm.forEach((el) => {
        let inputEl = components.getInputEl('', 'text', el.nameFunction);
        inputEl.classList.add('mb-1');
        inputEl.disabled = true;
        divElPosizion.append(inputEl);

        inputEl = components.getInputEl('', 'number', el.id);
        inputEl.classList.add('mb-1');
        divElId.append(inputEl);

        inputEl = components.getInputEl('', 'text', el.fio);
        inputEl.classList.add('mb-1');
        if (!el.fio) inputEl.disabled = true;
        divElfio.append(inputEl);
      });

      $unitSettings_content.append(formEl);
      divRowEl.append(hEl, divElPosizion, divElId, divElfio);

      // программы
      if (unit.type === 'Пиццерия') {
        const divEl = components.getDivEl('mb-3');
        formEl.append(divEl);
        hEl = components.getHEl(5, 'Список программ');
        divEl.append(hEl);
        unit.programs.forEach((el) => {
          const divElfprograms = components.getDivEl('mb-0');
          divElfprograms.classList.add('form-check');
          divElfprograms.classList.add('form-switch');

          let inputCheck = components.getInputCheckboxEl(el.name);
          if (el.isActive) inputCheck.checked = true;
          let labelCheck = components.getLabelCheckboxEl(el.name, el.name);
          divElfprograms.append(labelCheck, inputCheck);
          divEl.append(divElfprograms);
        });
      }

      // Рассписания
      if (unit.type === 'Пиццерия') {
        let divEl = components.getDivEl('mb-4');
        formEl.append(divEl);
        hEl = components.getHEl(5, 'Время работы');
        divEl.append(hEl);

        function timeWorkDelivery() {
          const divElDel = components.getDivEl('row');
          let pEl = components.getPEl('Время работы пиццерии на доставку');
          pEl.classList.add('mb-0');
          divElDel.append(pEl);
          divEl.append(divElDel);

          let divElStart = components.getDivEl('col-auto');
          divElStart.classList.add ('mb-3');
          const startInput = components.getInputEl(
            '',
            'time',
            unit.timeWork.delivery.workingTimeStart,
            'старт',
          );
          divElStart.append(startInput);

          let divElStop = components.getDivEl('col-auto');
          divElStop.classList.add ('mb-3');
          const stopInput = components.getInputEl(
            '',
            'time',
            unit.timeWork.delivery.workingTimeStop,
            'стоп',
          );
          divElStop.append(stopInput);
          divElDel.append(divElStart, divElStop);
        }

        function timeWorkRestoran() {
          const divElDel = components.getDivEl('row');
          let pEl = components.getPEl('Время работы ресторана');
          pEl.classList.add('mb-0');
          divElDel.append(pEl);
          divEl.append(divElDel);

          let divElStart = components.getDivEl('col-auto');
          const startInput = components.getInputEl(
            '',
            'time',
            unit.timeWork.restoran.workingTimeStart,
            'старт',
          );
          divElStart.append(startInput);

          let divElStop = components.getDivEl('col-auto');
          const stopInput = components.getInputEl(
            '',
            'time',
            unit.timeWork.restoran.workingTimeStop,
            'стоп',
          );
          divElStop.append(stopInput);
          divElDel.append(divElStart, divElStop);
        }
        timeWorkDelivery();
        timeWorkRestoran();
      }

      let btn = components.getButtonEl('внести изменения', 'submit');
      $unitSettings_content.append(btn);
    }
  });
}
