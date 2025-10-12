import { getDataServer } from "../../apiServer";

export const getCourierStaffingYears = async () => {
    return await getDataServer(`courier-staffing/years`);
}

export const getCourierStaffingDesc = async (params) => {
    return await getDataServer(`courier-staffing-desc?year=${params.year}`);
}

export const getCourierStaffingAsc = async (params) => {
    return await getDataServer(`courier-staffing-asc?year=${params.year}`);
}

export const getCourierStaffingLevelTop = async (params) => {
    return await getDataServer(`courier-staffing-level-top?year=${params.year}`);
}

export const getCourierStaffingStopTop = async (params) => {
    return await getDataServer(`courier-staffing-stop-top?year=${params.year}`);
}