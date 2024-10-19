import { getRequest, postRequest } from "../utils/apiRequests";
import { CreateFormData } from "../utils/createFormData";


export const uploadFile = async (payload) => {
    return await postRequest('upload-file', CreateFormData(payload));
};

export const printQuote = async (payload) => {
    return await postRequest('print-quote', payload);
};
export const submitPayment = async (payload) => {
    return await postRequest('payment', payload);
};

export const printJob = async (payload) => {
    return await postRequest('print', payload);
};

export const updatePricing = async (payload) => {
    return await postRequest('pricing', payload);
};

export const fetchPricing = async () => {
    return await getRequest('pricing', '');
};


export const fetchPrintJobs = async () => {
    return await getRequest('jobs', '');
};


