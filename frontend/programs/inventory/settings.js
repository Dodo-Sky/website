import * as components from '../../components.js';
import { renderInventoryDepartmentSettings } from './department_settings';
import { renderInventoryItemSettings } from './item_settings';
import { renderInventoryUnitSettings } from './unit_settings';

let currentNavId = "#inventory-item-settings-nav";

const changeTab = (className) => {
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
  
const changeActiveTab = (navId, contentId) => {
    const unsavedChanges = document.querySelectorAll('.unsaved_changes');
  
    if (unsavedChanges.length) {
        if (confirm('У вас есть несохраненные данные. Вы уверены, что хотите перейти на другую вкладку?')) {
            currentNavId = navId;
            changeTab(contentId);
  
            unsavedChanges.forEach(change => {
            change.classList.remove('unsaved_changes');
            });
  
            return true;
        } else {
            const tab = document.querySelector(navId);
            tab.classList.remove('active');
    
            const prevTab = document.querySelector(currentNavId);
            prevTab.classList.add('active');
    
            return false;
        }
    } else {
        currentNavId = navId;
        changeTab(contentId);
    
        return true;
    }
}

const generateNav = () => {
    const navEl = components.getTagUL_nav();
    navEl.classList.add('nav-tabs');
  
    const inventoryItemSettingsEl = components.getTagLI_nav('Настройка по каждой позиции сырья');
    inventoryItemSettingsEl.id = "inventory-item-settings-nav"
    inventoryItemSettingsEl.classList.add('inventoryItemSettingsNav');
    inventoryItemSettingsEl.classList.add('active');
  
    const unitSettingsEl = components.getTagLI_nav('Настройка по пиццериям');
    unitSettingsEl.id = "unit-settings-nav"
    unitSettingsEl.classList.add('unitSettingsNav');
  
    const departmentSettingsEl = components.getTagLI_nav('Настройка департамента');
    departmentSettingsEl.id = "department-settings-nav"
    departmentSettingsEl.classList.add('departmentSettingsNav');
  
    inventoryItemSettingsEl.addEventListener('click', async (e) => {
        const isChanged = changeActiveTab('#inventory-item-settings-nav', '#inventory-item-settings-tab');
        if (!isChanged) {
            return;
        }
        unitSettingsEl.classList.remove('active');
        departmentSettingsEl.classList.remove('active');
        inventoryItemSettingsEl.classList.add('active');
          await renderInventoryItemSettings();
    });

    unitSettingsEl.addEventListener('click', async (e) => {
        const isChanged = changeActiveTab('#unit-settings-nav', '#unit-settings-tab');
        if (!isChanged) {
            return;
        }
        inventoryItemSettingsEl.classList.remove('active');
        departmentSettingsEl.classList.remove('active');
        unitSettingsEl.classList.add('active');
        await renderInventoryUnitSettings();
    });
  
    departmentSettingsEl.addEventListener('click', async (e) => {
        const isChanged = changeActiveTab('#department-settings-nav', '#department-settings-tab');
        if (!isChanged) {
            return;
        }
        inventoryItemSettingsEl.classList.remove('active');
        unitSettingsEl.classList.remove('active');
        departmentSettingsEl.classList.add('active');
        await renderInventoryDepartmentSettings();
    });
  
    navEl.append(inventoryItemSettingsEl, unitSettingsEl, departmentSettingsEl);
  
    return navEl;
  }
  
  const generateTabs = () => {
    const tabsEl = components.getTagDiv('tabs');
    tabsEl.classList.add('tabs');
  
    const inventoryItemSettingsTabContent = components.getTagDiv(['tab-pane', 'fade', 'show', 'active'], "inventory-item-settings-tab");
    const unitSelectorContent = components.getTagDiv(["mt-2", "mb-2", "row", "inventory-item-unit-selector"], "inventory-item-unit-selector");
    const inventoryItemSettingsContent = components.getTagDiv("inventory-item-settings-content", "inventory-item-settings-content");
    const inventoryItemSettingsSpinner = components.getSpinner("inventory-item-settings-spinner");
    inventoryItemSettingsTabContent.append(unitSelectorContent, inventoryItemSettingsSpinner, inventoryItemSettingsContent);
    
    const unitSettingsTabContent = components.getTagDiv(['tab-pane', 'fade', 'd-none'], "unit-settings-tab");
    const unitSettingsContent = components.getTagDiv("unit-settings-content", "unit-settings-content");
    const unitSettingsSpinner = components.getSpinner("unit-settings-spinner");
    unitSettingsTabContent.append(unitSettingsSpinner, unitSettingsContent);
  
    const departmentSettingsTabContent = components.getTagDiv(['tab-pane', 'fade', 'd-none'], "department-settings-tab");
    const departmentSettingsContent = components.getTagDiv("department-settings-content", "department-settings-content");
    const departmentSettingsSpinner = components.getSpinner("department-settings-spinner");
    departmentSettingsTabContent.append(departmentSettingsSpinner, departmentSettingsContent);
  
    tabsEl.append(inventoryItemSettingsTabContent, unitSettingsTabContent, departmentSettingsTabContent);
  
    return tabsEl;
  }

export const renderInventorySettings = async (contentSetting) => {
  contentSetting.innerHTML = '';
  
  const title = components.getTagH(4, "Уведомление о низких остатках");
  contentSetting.append(title, generateNav(), generateTabs());

  await renderInventoryItemSettings();
}