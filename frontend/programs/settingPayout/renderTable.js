import { initDeletePayoutHandlers } from "./deletePayout.js";
import { getServerApi } from "../../apiServer.js";
import { getUnitNameEl, getDayWeek, getStaffType } from "./markupHtml.js";

export async function renderTable() {
  const contentSetting = document.querySelector(".contentSetting");
  contentSetting.innerHTML = `
          <h1>Настройки динамичной оплаты</h1>
        <form class="mb-4" action="#" id="form">
          <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label"
              >Описание выплаты (описание в личном кабинете сотрудника)</label
            >
            <textarea
              class="form-control description"
              id="exampleFormControlTextarea1"
              rows="1"
            ></textarea>
          </div>

          <div class="wrappper">
            <div class="input-group mb-3">
              <span class="input-group-text">Размер доплаты</span>
              <input type="number" class="form-control amountSize" />
              <span class="input-group-text">руб.</span>
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">Дата старта</span>
              <input class="form-control date-inp" type="date" />
            </div>

            <div class="mb-3 choiceUnit">
              <span class="input-group-text">Выберите пиццерии</span>
            </div>

            <div class="input-group mb-3 holiday">
              <label
                class="input-group-text"
                for="inputGroupSelect01"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="Праздничные дни определены в статье 112 Трудового кодекса РФ"
                >Оплата в праздничные дни</label
              >
              <select class="form-select" id="inputGroupSelect01">
                <option selected>Выберите...</option>
                <option value="1">Оплачиваем в праздничные дни</option>
                <option value="">НЕ оплачиваем в праздничные дни</option>
              </select>
            </div>

            <div class="input-group mb-3">
              <label class="input-group-text" for="typeAmount">Тип доплаты</label>
              <select class="form-select" id="typeAmount">
                <option selected>Выберите...</option>
                <option value="Оплата за заказ">Оплата за заказ</option>
                <option value="Оплата в час">Оплата в час</option>
              </select>
            </div>

            <div class="mb-3 typeAll">
              <span class="input-group-text">Укажите тип сотрудника</span>
            </div>

            <div class="mb-3 dayWeek">
              <span class="input-group-text">Выберете дни недели</span>
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">Ежедневное время начала</span>
              <input type="time" class="form-control start-time" />
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">Ежедневное время окончания</span>
              <input type="time" class="form-control stop-time" />
            </div>
          </div>

          <button class="btn btn-primary" type="submit" id="button-submit">
            Добавить новую выплату
          </button>

          <button class="btn btn-secondary" type="button" id="button-reset">
            Очистить форму
          </button>
        </form>

        <div class="table-responsive">
          <table class="table table-hover table-bordered caption-top">
            <caption>
              Действующие доплаты
            </caption>
            <thead class="table-secondary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Описание</th>
                <th scope="col">Размер доплаты</th>
                <th scope="col">Дата начала</th>
                <th scope="col">Пиццерии</th>
                <th scope="col">Оплата в праздничные дни</th>
                <th scope="col">Тип доплаты</th>
                <th scope="col">Тип сотрудника</th>
                <th scope="col">Дни недели</th>
                <th scope="col">Время начала</th>
                <th scope="col">Время окончания</th>
                <th scope="col">Управление</th>
              </tr>
            </thead>
            <tbody class="table-light tableBody"></tbody>
          </table>
        </div>
  `;

  await getUnitNameEl();
  getDayWeek();
  await getStaffType();

  // очистка формы
  document.getElementById("button-reset").addEventListener("click", function () {
    document.getElementById("form").reset();
    document.querySelector(".wrappper").style.display = "none";
    document.getElementById("button-submit").textContent = "Добавить новую запись";
  });

  //скрытие и раскрытие формы
  const $description = document.querySelector(".description");
  const $wrappper = document.querySelector(".wrappper");
  $wrappper.style.display = "none";
  $description.addEventListener("input", function (e) {
    $wrappper.style.display = "block";
    if (!e.target.value) $wrappper.style.display = "none";
  });

  // очистка
  const $tbody = document.querySelector(".tableBody");
  $tbody.innerHTML = "";

  // загрузка данных с сервера
  let arrPremium = await getServerApi("settingPremium");
  let count = 1;

  arrPremium.forEach((el) => {
    const $trEl = document.createElement("tr");
    $tbody.append($trEl);

    const $thEl = document.createElement("th");
    $thEl.classList.add("fs-6");
    $thEl.textContent = count;
    $thEl.scope = "col";
    count++;
    $trEl.append($thEl);

    let $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.description;
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.amountSize;
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.date_start;
    $trEl.append($tdEl);

    let unitName = el.unitName.join(" ");
    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = unitName;
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.holiday ? "Оплачиваем" : " Не оплачиваем";
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.typeAmount;
    $trEl.append($tdEl);

    let staffTypeArr = el.staffTypeArr.join(" ");
    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = staffTypeArr;
    $trEl.append($tdEl);

    let dayWeek = el.dayWeek.join(" ");
    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = dayWeek;
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.start_time;
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    $tdEl.classList.add("fs-6");
    $tdEl.textContent = el.stop_time;
    $trEl.append($tdEl);

    $tdEl = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.classList.add("btn");
    editButton.classList.add("btn-outline-success");
    editButton.classList.add("btn-sm");
    editButton.type = "button";
    editButton.textContent = "Редактировать";
    editButton.style.marginBottom = "10px";
    editButton.setAttribute("data-id", el.id);
    $trEl.append($tdEl);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-outline-danger");
    deleteButton.classList.add("btn-sm");
    deleteButton.textContent = "Удалить";
    deleteButton.type = "button";
    deleteButton.setAttribute("data-id", el.id);
    $trEl.append($tdEl);
    $tdEl.append(editButton, deleteButton);
  });

  await import("./editPayout.js");
  await import("./addPayout.js");
  initDeletePayoutHandlers();
  await import("./validator.js");

  // включение подсказок с внешней библиотеки
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}
