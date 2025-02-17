import { getServerApi } from "../apiServer.js";
import * as components from "../components.js";

const content = document.getElementById("content");

export async function render(name) {
  content.innerHTML = `
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Загрузка...</span>
    </div>`;
  const defects = await getServerApi("defects");
  console.log(defects);
  let spiner = document.querySelector(".spinner-border");
  spiner.style.display = "none";
  content.append(name);

  function makeData(params) {}

  function renderTable() {
    const divEl = components.getTagDiv_table();
    const tableEl = components.getTagTable();
    divEl.append(tableEl);
    const captionEl = components.getTagCaption("Программа контроля списания забракованных продуктов");
    const theadEl = components.getTagTHead();
    let trEl = components.getTagTR();
    let thEl = components.getTagTH("Время продажи");
    trEl.append(thEl);
    thEl = components.getTagTH("Продукт");
    trEl.append(thEl);
    thEl = components.getTagTH("Продукт утилизирован?");
    trEl.append(thEl);
    thEl = components.getTagTH("Причина брака");
    trEl.append(thEl);
    thEl = components.getTagTH("Лицо допустившее брак");
    trEl.append(thEl);
    thEl = components.getTagTH("Решение менеджера");
    trEl.append(thEl);
    thEl = components.getTagTH("Контроль управляющего");
    trEl.append(thEl);
    thEl = components.getTagTH("Управление");
    trEl.append(thEl);
    theadEl.append(trEl);
    const tBody = components.getTagTBody();

    defects.forEach((defect) => {
      trEl = components.getTagTR();
      const uniqueID = `${Math.random().toString(36).slice(2)}`;
      const formel = components.getTagForm(uniqueID);
      tBody.append(trEl);
      trEl.append(formel);

      let tdEl = components.getTagTD(defect.soldAtLocal);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD(defect.productName);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD();
      let inputDisposal = components.getTagInput();
      inputDisposal.value = defect.disposal;
      tdEl.append(inputDisposal);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD();
      let textareaEl = components.getTagTextarea();
      textareaEl.value = defect.reasonDefect;
      tdEl.append(textareaEl);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD();
      let inputNameViolator = components.getTagInput();
      inputNameViolator.value = defect.nameViolator;
      tdEl.append(inputNameViolator);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD();
      textareaEl = components.getTagTextarea();
      textareaEl.value = defect.decisionManager;
      tdEl.append(textareaEl);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD();
      textareaEl = components.getTagTextarea();
      textareaEl.value = defect.control;
      tdEl.append(textareaEl);
      //trEl.append (tdEl)
      formel.append(tdEl);

      tdEl = components.getTagTD();
      let btnEl = components.getTagButton("Редактировать", "submit");
      tdEl.append(btnEl);
      //trEl.append (tdEl)
      formel.append(tdEl);
    });
    tableEl.append(captionEl, theadEl, tBody);
    content.append(divEl);
  }
  renderTable();
}
