import * as components from "./components.js";
let btnNavs;

export function showNavMain() {
  // первый уровень после авторизации
  let cardRow = components.getCardRow();
  let adminUser = components.getCardNav("Администратор", "Настройка прав доступа");
  let ofisUser = components.getCardNav("Менеджер офиса", "Параметры с настройками");
  let managerUser = components.getCardNav("Менеджер смены", "Тут находятся программы");
  cardRow.append(adminUser, ofisUser, managerUser);
  const content = document.getElementById("content");
  content.innerHTML = "";
  content.append(cardRow);

  btnNavs = document.querySelectorAll(".btnNav");
  showNavManager();
  showNavOfis();
  showNavAdmin();
}

// навигация администратор
function showNavAdmin() {
  btnNavs.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      if (e.target.previousSibling.previousSibling.textContent === "Администратор") {
        console.log("Элдос этот раздел надо делать отдельно думать над логикой");
      }
    });
  });
}

// навигация менеджера офиса
function showNavOfis() {
  btnNavs.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      if (e.target.previousSibling.previousSibling.textContent === "Менеджер офиса") {
        // спинер
        const content = document.getElementById("content");
        content.innerHTML = `
          <div class="spinner-border" role="status">
          <span class="visually-hidden">Загрузка...</span>
          </div>`;
        const module = await import("./navSettings.js");
        module.renderLeftNav();
      }
    });
  });
}

// навигация менеджера смены
function showNavManager() {
  btnNavs.forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      if (e.target.previousSibling.previousSibling.textContent === "Менеджер смены") {
        let cardRow = components.getCardRow();
        let orders = components.getCardNav("Проблемные заказы");
        let diszipline = components.getCardNav("Соблюдение дисциплины");
        let badSupply = components.getCardNav("Контроль брака");
        let yearBonus = components.getCardNav("Годовой бонус");
        let frends = components.getCardNav("Приведи друга");

        cardRow.append(orders, diszipline, badSupply, yearBonus, frends);
        content.innerHTML = "";
        const titte = components.getTagH(5, "Выберите нужную вам программу");
        titte.classList.add("text-center");
        content.append(titte, cardRow);
      }
    });
  });

  content.addEventListener("click", function (e) {
    if (e.target.previousSibling?.previousSibling?.textContent === "Проблемные заказы") {
      const titte = components.getTagH(5, `Программа ${e.target.previousSibling.previousSibling.textContent} в разработке`);
      content.append(titte);
    }
  });

  content.addEventListener("click", async function (e) {
    if (e.target.previousSibling?.previousSibling?.textContent === "Контроль брака") {
      const tittle = components.getTagH (5, e.target.previousSibling?.previousSibling?.textContent)
      tittle.classList.add ('text-center')
      const module = await import("./defects/mainDefects.js");
      module.render(tittle);

    }
  });
}
