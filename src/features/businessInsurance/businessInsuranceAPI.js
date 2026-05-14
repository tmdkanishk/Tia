import apiClient from '../../services/apiClient';
import { BASE_URL } from '../../config/env';


export const getRiskCodeAndOccupancy = (searchText) => apiClient.get(`/api/occupancy/search/by-text?query=${searchText}`);


