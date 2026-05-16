import apiClient from '../../services/apiClient';
export const calculatIARIndurance = (data) => apiClient.post('/api/iar-insurance/calculate', data);