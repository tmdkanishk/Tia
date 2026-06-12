import apiClient from '../../services/apiClient';

export const getQuotations = ({ page, search, tab }) => apiClient.get(`/api/quotations?search=${search}&page=${page}&quoteType=${tab}`);

export const getQuotationDetails = (quoteId) => apiClient.get(`/api/quotations/${quoteId}`);