import {getDataServer} from "../../../apiServer";

export const getProblemOrders = async (params) => {
    return await getDataServer(`problem-orders-pagination?unitId=${params.unitId}&page=${params.page}&size=${params.size}&period=${params.period}&graphistComment=${params.graphistComment}&directorComment=${params.directorComment}`)
}
