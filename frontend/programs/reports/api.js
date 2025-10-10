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