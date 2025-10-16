import { getDataServer, putDataServer } from "../../apiServer";

export const getStaffDismissed = async (params) => {
    return await getDataServer(`staff-dismissed-pagination?unitId=${params.unitId}&page=${params.page}&size=${params.size}&dateOfCall=${params.dateOfCall}&position=${params.position}&result=${params.result}`);
}

export const updateStaffDismissed = async (contactId, body) => {
    return await putDataServer(`staff-dismissed/${contactId}`, body)
}

export const getStaffDismissedPositions = async (params) => {
    return await getDataServer(`staff-dismissed-positions?unitId=${params.unitId}`);
}

export const getStaffContacts = async (id) => {
    return await getDataServer(`staff/${id}/contacts`);
}

export const getStaffDismissedInworkResult = async (params) => {
    return await getDataServer(`staff-dismissed-inwork-result?unitId=${params.unitId}`);
}

export const getStaffDismissedDelayResult = async (params) => {
    return await getDataServer(`staff-dismissed-delay-result?unitId=${params.unitId}`);
}


export const getStaffDismissedSuccessReturns = async (params) => {
    return await getDataServer(`staff-dismissed-success-returns?unitId=${params.unitId}`);
}

export const getInterview = async (params) => {
    return await getDataServer(`interview-pagination?departmentName=${params.departmentName}&page=${params.page}&size=${params.size}`);
}

export const getDelayCommentHrCount = async (params) => {
    return await getDataServer(`staff-dismissed-delay-commentHr?departmentName=${params.departmentName}`);
}

export const updateInterview = async (dismissedId, body) => {
    return await putDataServer(`interview/${dismissedId}`, body)
}

export const getCancelReason = async (params) => {
    return await getDataServer(`cancel-reason-pagination?departmentName=${params.departmentName}&page=${params.page}&size=${params.size}`);
}

export const getCancelReasonInWorkCount = async (params) => {
    return await getDataServer(`cancel-reason-inwork-count?departmentName=${params.departmentName}`);
}

export const updateCancelReason = async (idContact, body) => {
    return await putDataServer(`cancel-reason/${idContact}`, body)
}
