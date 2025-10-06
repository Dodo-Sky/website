import * as components from '../../components.js';
import { renderCancelReasonTable } from './cancel_reason_table.js';
import { renderInterviewTable } from './interview_table.js';
import { renderProgramTable } from './program_table.js';
;

const content = document.getElementById('content');

const changeActiveTab = (className) => {
  document.querySelectorAll('.tab-pane').forEach((tabPane) => {
    tabPane.classList.remove('active');
    tabPane.classList.remove('show');
    tabPane.classList.add('d-none');
  })

  const tab = document.querySelector(className);
  tab.classList.add('active');
  tab.classList.add('show');
  tab.classList.remove('d-none');
}

const generateNav = () => {
  const navEl = components.getTagUL_nav();
  navEl.classList.add('nav-tabs');

  const programEl = components.getTagLI_nav('Программа');
  programEl.id = "program-nav"
  programEl.classList.add('programNav');
  programEl.classList.add('active');

  const interviewEl = components.getTagLI_nav('Выходное интервью');
  interviewEl.id = "interview-nav"
  interviewEl.classList.add('interviewNav');

  const cancelEl = components.getTagLI_nav('Отмена решения');
  cancelEl.id = "cancel-nav"
  cancelEl.classList.add('cancelNav');

  programEl.addEventListener('click', async () => {
    changeActiveTab('#program-tab');
    interviewEl.classList.remove('active');
    cancelEl.classList.remove('active');
    programEl.classList.add('active');
    await renderProgramTable();
  });

  interviewEl.addEventListener('click', async () => {
    changeActiveTab('#interview-tab');
    programEl.classList.remove('active');
    cancelEl.classList.remove('active');
    interviewEl.classList.add('active');
    await renderInterviewTable();
  });

  cancelEl.addEventListener('click', async () => {
    changeActiveTab('#cancel-tab');
    programEl.classList.remove('active');
    interviewEl.classList.remove('active');
    cancelEl.classList.add('active');
    await renderCancelReasonTable();
  });

  navEl.append(programEl, interviewEl, cancelEl);

  return navEl;
}

const generateTabs = () => {
  const tabsEl = components.getTagDiv('tabs');
  tabsEl.classList.add('tabs');

  const programTabContent = components.getTagDiv(['tab-pane', 'fade', 'show', 'active'], "program-tab");
  const unitSelectorContent = components.getTagDiv(["mt-2", "row", "dismissed-unit-selector"], "dismissed-unit-selector");
  const programContent = components.getTagDiv("program-content", "program-content");
  const programSpinner = components.getSpinner("program-spinner");
  programTabContent.append(unitSelectorContent, programSpinner, programContent);

  const interviewTabContent = components.getTagDiv(['tab-pane', 'fade', 'd-none'], "interview-tab");
  const interviewContent = components.getTagDiv("interview-content", "interview-content");
  const interviewSpinner = components.getSpinner("interview-spinner");
  interviewTabContent.append(interviewSpinner, interviewContent);

  const cancelTabContent = components.getTagDiv(['tab-pane', 'fade', 'd-none'], "cancel-tab");
  const cancelContent = components.getTagDiv("cancel-content", "cancel-content");
  const cancelSpinner = components.getSpinner("cancel-spinner");
  cancelTabContent.append(cancelSpinner, cancelContent);

  tabsEl.append(programTabContent, interviewTabContent, cancelTabContent);

  return tabsEl;
}

export async function render() {
  content.innerHTML = ""

  const title = components.getTagH(3, "Обзвон уволенных", ["text-center", "sticky-top"]);

  content.append(title, generateNav(), generateTabs());

  await renderProgramTable();
}
