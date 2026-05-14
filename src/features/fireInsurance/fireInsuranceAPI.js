import apiClient from '../../services/apiClient';
import { BASE_URL } from '../../config/env';


export const calculateFireInsuranceAPI = (data) => {
  return apiClient.post('/api/fire-insurance/calculate', data);
};


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
      riskCode: form.riskCode || '', // Default risk code
      occupancy: form.occupancy || '', // Default occupancy
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