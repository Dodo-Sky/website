import {getDataServer} from "../../apiServer";

export const getDiscipline = async (params) => {
    return getDataServer(`discipline-pagination?unitId=${params.unitId}&page=${params.page}&size=${params.size}&period=${params.period}&managerDecision=${params.managerDecision}&directorDecision=${params.directorDecision}`);
}

export const getDisciplineInfo = async (unitId) => {
    return getDataServer(`discipline-info?unitId=${unitId}`);
}
