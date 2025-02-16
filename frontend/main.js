import { showNavMain } from "./navMain.js";

// включение подсказок с внешней библиотеки
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));


showNavMain ()