import * as components from "../components.js";
import { getForm } from "./form.js";

export function renderTable (defects) {
    defects.sort((a, b) => new Date(a.soldAtLocal) - new Date(b.soldAtLocal));
  
    const tableContent = document.querySelector(".table-responsive");
    tableContent.innerHTML = "";
  
    const tableEl = components.getTagTable();
    tableContent.append(tableEl);
  
    const captionEl = components.getTagCaption("Программа контроля списания забракованных продуктов");
    const theadEl = components.getTagTHead();
    theadEl.classList.add("table-sm");
  
    let trEl = components.getTagTR();
  
    let thEl = components.getTagTH();
    thEl.innerHTML = `
  <div class="btn-group">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      Время
    </button>
    <ul class="dropdown-menu">
      <li class="dropdown-item">За прошедшие 3 дня</li>
      <li class="dropdown-item">За последнюю неделю</li>
      <li class="dropdown-item">Показать за все время</li>
    </ul>
  </div>`;
    trEl.append(thEl);
  
    thEl = components.getTagTH("Продукт");
    trEl.append(thEl);
    thEl = components.getTagTH("В мусорке?");
    trEl.append(thEl);
    thEl = components.getTagTH("Причина брака");
    trEl.append(thEl);
    thEl = components.getTagTH("Лицо допустившее брак");
    trEl.append(thEl);
  
    thEl = components.getTagTH();
    thEl.innerHTML = `
  <div class="btn-group">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      Менеджер
    </button>
    <ul class="dropdown-menu">
      <li class="dropdown-item">Показать все</li>
      <li class="dropdown-item">Только просроченные менеджером</li>
       <li class="dropdown-item">В работе менеджера (пустые)</li>
    </ul>
  </div>`;
    trEl.append(thEl);
  
    thEl = components.getTagTH();
    thEl.innerHTML = `
  <div class="btn-group">
    <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      Управляющий
    </button>
    <ul class="dropdown-menu">
      <li class="dropdown-item">Показать все</li>
      <li class="dropdown-item">Только просроченные управляющим</li>
      <li class="dropdown-item">В работе управляющего (пустые)</li>
    </ul>
  </div>`;
    trEl.append(thEl);
  
    thEl = components.getTagTH("Управление");
    trEl.append(thEl);
    theadEl.append(trEl);
    const tBody = components.getTagTBody();
  
    defects.forEach((defect) => {
      trEl = components.getTagTR();
      tBody.append(trEl);
      let tdEl = components.getTagTD(defect.soldAtLocal);
      trEl.append(tdEl);
      tdEl = components.getTagTD(defect.productName);
      trEl.append(tdEl);
      tdEl = components.getTagTD(defect.disposal);
      trEl.append(tdEl);
      tdEl = components.getTagTD(defect.reasonDefect);
      trEl.append(tdEl);
      tdEl = components.getTagTD(defect.nameViolator);
      trEl.append(tdEl);
  
      tdEl = components.getTagTD(defect.decisionManager);
      if (defect.decisionManager === "Просрочка") {
        tdEl.classList.add("text-danger");
      }
      trEl.append(tdEl);
  
      tdEl = components.getTagTD(defect.control);
      if (defect.control === "Просрочка") {
        tdEl.classList.add("text-danger");
      }
      trEl.append(tdEl);
  
      tdEl = components.getTagTD();
      let btnEl = components.getTagButton("Изменить");
      btnEl.setAttribute("data-id", `${defect.soldAtLocal}+${defect.productId}`);
      btnEl.setAttribute("data-bs-toggle", 'modal');
      btnEl.setAttribute("data-bs-target", '#exampleModal');
      tdEl.append(btnEl);
      trEl.append(tdEl);

    });
    tableEl.append(captionEl, theadEl, tBody);
    getForm ()
  }