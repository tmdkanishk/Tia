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

  // Optional list filter only (detail/update/delete no longer use quoteType)
  const normalizedTab = normalizeQuoteType(tab);
  if (normalizedTab) {
    params.append('quoteType', normalizedTab);
  }

  return apiClient.get(`/api/quotations?${params.toString()}`);
};

/** GET /api/quotations/:id — quoteType query no longer required */
export const getQuotationDetails = (quoteId) => {
  return apiClient.get(`/api/quotations/${quoteId}`);
};

/** PUT /api/quotations/:id */
export const updateQuotation = (quoteId, payload = {}) => {
  const { quoteType: _ignored, ...body } = payload || {};
  return apiClient.put(`/api/quotations/${quoteId}`, body);
};

/** DELETE /api/quotations/:id */
export const deleteQuotation = (quoteId) => {
  return apiClient.delete(`/api/quotations/${quoteId}`);
};

/** Relative path used by file download (Bearer auth via ReactNativeBlobUtil). */
export const getQuotationPdfExportPath = (quoteId) => {
  return `/api/quotations/${quoteId}/export/pdf`;
};
