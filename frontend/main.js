
// включение подсказок с внешней библиотеки
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));


const settingPayoutNav = document.getElementById("settingPayout_nav");
settingPayoutNav.addEventListener("click", async function () {
  await import("./settingPayout/renderTable.js");
});

const unitSettingsNav = document.getElementById("unitSettings_nav");
unitSettingsNav.addEventListener("click", async function () {
  await import("./unitsSettings/renderData.js");
});


