import apiClient from '../../services/apiClient';
import { BASE_URL } from '../../config/env';

/**
 * Calculate Fire Insurance Premium
 * @param {Object} data - The calculation request payload
 * @returns {Promise} API response with premium calculation
 */
export const calculateFireInsuranceAPI = (data) => {
  return apiClient.post('/api/fire-insurance/calculate', data);
};

/**
 * Format the form data to match API payload structure
 * @param {Object} form - Form state from the calculator
 * @returns {Object} Formatted payload for API
 */
export const formatFireInsurancePayload = (form) => {
  // Parse numeric values
  const parseNum = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  // Convert terrorism/burglary from 'Yes'/'No' to boolean
  const toBool = (val) => val === 'Yes';

  // Parse discount percentages
  const iibDiscount = parseNum(form.discountIIB) || 0;
  const natcatDiscount = parseNum(form.discountNetCat) || 0;

  return {
    customerDetails: {
      customerName: form.customerName || '',
      address: form.address || '',
      pinCode: form.pinCode || '',
      riskCode: form.riskCode || '1001', // Default risk code
      occupancy: form.occupancy || 'Dwellings', // Default occupancy
    },
    riskCovers: {
      terrorism: toBool(form.terrorism),
      burglary: toBool(form.burglary),
    },
    discounts: {
      iibDiscountPercent: iibDiscount,
      natcatDiscountPercent: natcatDiscount,
    },
    sumInsured: {
      building: parseNum(form.building) || 0,
      plantAndMachinery: parseNum(form.plantMachinery) || 0,
      stock: parseNum(form.stock) || 0,
      furnitureFixturesFittings: parseNum(form.furnitureFixture) || 0,
      otherContents: parseNum(form.otherContents) || 0,
    },
  };
};