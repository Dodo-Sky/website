import { getDataServer } from "../../apiServer";

export const getCourierStaffingYears = async () => {
    return await getDataServer(`courier-staffing/years`);
}

export const getCourierStaffingSummary = async (params) => {
    return await getDataServer(`courier-staffing/summary?year=${params.year}`);
}

export const getCourierStaffing = async (params) => {
    return await getDataServer(`courier-staffing?year=${params.year}`);
}