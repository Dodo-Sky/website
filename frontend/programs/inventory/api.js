import { getDataServer, postDataServer, putDataServer } from '../../apiServer';

export const getUnits = async (params) => {
    return await getDataServer(`inventory-units?departmentName=${params.departmentName}`);
}

export const getInventoryItemSettings = async (params) => {
    return await getDataServer(`inventory-item-settings?unitId=${params.unitId}`);
}

export const updateInventoryItemSettings = async (id, params) => {
    return await putDataServer(`inventory-item-settings/${id}`, params);
}

export const getInventoryItemSettingsCommon = async (params) => {
    return await getDataServer(`inventory-item-settings-common?departmentName=${params.departmentName}`);
}

export const updateInventoryItemSettingsCommon = async (id, params) => {
    return await putDataServer(`inventory-item-settings-common/${id}`, params);
}

export const getInventoryUnitSettings = async (params) => {
    return await getDataServer(`inventory-unit-settings?departmentName=${params.departmentName}`);
}

export const updateInventoryUnitSettings = async (id, params) => {
    return await putDataServer(`inventory-unit-settings/${id}`, params);
}

export const getInventoryDepartmentSettings = async (params) => {
    return await getDataServer(`inventory-department-settings?departmentName=${params.departmentName}`);
}

export const updateInventoryDepartmentSettings = async (id, params) => {
    return await putDataServer(`inventory-department-settings/${id}`, params);
}

export const testSupplyBot = async (payload) => {
    return await postDataServer(`test_supply_bot`, payload);
}