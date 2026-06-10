import apiClient from '../../services/apiClient';
export const searchAddon = (keyword, pageNo) => apiClient.get(`/api/policy-addons?search=${keyword}&page=${pageNo}`);