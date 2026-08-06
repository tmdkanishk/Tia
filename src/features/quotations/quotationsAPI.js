import apiClient from '../../services/apiClient';

const VALID_QUOTE_TYPES = ['fire', 'business', 'iar'];

/** Normalize API/list values like FIRE / Business / iar → fire | business | iar */
export const normalizeQuoteType = (type) => {
  const value = String(type || '')
    .trim()
    .toLowerCase();

  if (VALID_QUOTE_TYPES.includes(value)) return value;

  if (value.includes('fire')) return 'fire';
  if (value.includes('business')) return 'business';
  if (value.includes('iar')) return 'iar';

  return '';
};

export const resolveQuoteType = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = normalizeQuoteType(candidate);
    if (normalized) return normalized;
  }
  return '';
};

export const getQuotations = ({
  page = 1,
  limit = 10,
  search = '',
  tab = 'all',
  sortBy = 'id',
  order = 'desc',
} = {}) => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  params.append('sortBy', sortBy);
  params.append('order', order);

  if (search) {
    params.append('search', search);
  }

  // Omit quoteType for "all" — API returns combined fire + business + iar
  const normalizedTab = normalizeQuoteType(tab);
  if (normalizedTab) {
    params.append('quoteType', normalizedTab);
  }

  return apiClient.get(`/api/quotations?${params.toString()}`);
};

export const getQuotationDetails = (quoteId, quoteType) => {
  const type = normalizeQuoteType(quoteType);
  if (!type) {
    return Promise.reject(new Error('quoteType is required (fire | business | iar)'));
  }
  return apiClient.get(`/api/quotations/${quoteId}?quoteType=${type}`);
};

export const updateQuotation = (quoteId, quoteType, payload = {}) => {
  const type = normalizeQuoteType(quoteType);
  if (!type) {
    return Promise.reject(new Error('quoteType is required (fire | business | iar)'));
  }
  // quoteType only as query param — not a DB column
  const { quoteType: _ignored, ...body } = payload || {};
  return apiClient.put(`/api/quotations/${quoteId}?quoteType=${type}`, body);
};

export const deleteQuotation = (quoteId, quoteType) => {
  const type = normalizeQuoteType(quoteType);
  if (!type) {
    return Promise.reject(new Error('quoteType is required (fire | business | iar)'));
  }
  return apiClient.delete(`/api/quotations/${quoteId}?quoteType=${type}`);
};

/** Relative path used by file download (Bearer auth via ReactNativeBlobUtil). */
export const getQuotationPdfExportPath = (quoteId, quoteType) => {
  const type = normalizeQuoteType(quoteType);
  return `/api/quotations/export/${quoteId}/export/pdf?quoteType=${type}`;
};
