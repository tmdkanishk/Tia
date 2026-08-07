/** Shared GET /api/quotations/:id payload → UI model */

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const parseMaybeJson = (value) => {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
};

const toStringList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => (item == null ? '' : String(item))).filter((item) => item.trim() !== '');
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = parseMaybeJson(value);
    if (Array.isArray(parsed)) return toStringList(parsed);
    if (value.includes('\n')) {
      return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    }
    return [value];
  }
  return [];
};

const PARTICULAR_TO_ASSET = {
  BUILDING: 'building',
  'PLANT & MACHINERY': 'plantAndMachinery',
  'PLANT AND MACHINERY': 'plantAndMachinery',
  STOCK: 'stock',
  'FURNITURE, FIXTURE & FITTINGS': 'furnitureFixturesFittings',
  'FURNITURE FIXTURE & FITTINGS': 'furnitureFixturesFittings',
  'OTHER CONTENTS': 'otherContents',
};

const assetBreakupFromCoverage = (sections = []) => {
  const breakup = {};
  sections.forEach((section) => {
    (section?.items || []).forEach((item) => {
      const particular = String(item?.particular || '').trim().toUpperCase();
      const key = PARTICULAR_TO_ASSET[particular];
      if (!key) return;
      const amount = Number(item?.sum_insured ?? item?.sumInsured ?? 0) || 0;
      breakup[key] = (breakup[key] || 0) + amount;
    });
  });
  return breakup;
};

const emptyModel = () => ({
  quotation: {},
  customer: {},
  risk: {},
  policy: {},
  covers: {},
  sumInsured: {},
  assetBreakup: {},
  discounts: {},
  premium: {},
  rates: {},
  rateReference: null,
  coverageSections: [],
  inputs: {},
  addons: [],
  wordings: [],
  termsConditions: [],
  remarks: null,
  exports: null,
  totalSi: null,
});

/**
 * Normalize GET detail into a stable model for Quote Detail / Update screens.
 * Supports current API shape + older nested financial / quotationJson payloads.
 */
export const normalizeQuotationDetail = (data = {}) => {
  if (!data || typeof data !== 'object') return emptyModel();

  let fromJson = {};
  const rawJson = parseMaybeJson(data.quotationJson);
  if (isPlainObject(rawJson)) fromJson = rawJson;

  const root = { ...fromJson, ...data };
  const calculation = isPlainObject(parseMaybeJson(root.calculation))
    ? parseMaybeJson(root.calculation)
    : (isPlainObject(fromJson.calculation) ? fromJson.calculation : {});

  const quotation = {
    ...(fromJson.quotation || {}),
    ...(root.quotation || root.quoteDetails || {}),
  };

  // Prefer quotationNumber (current API); keep quotationNo alias for UI
  const quotationNumber =
    quotation.quotationNumber
    || quotation.quotationNo
    || root.quotationNumber
    || root.quotationNo
    || null;
  if (quotationNumber) {
    quotation.quotationNumber = quotationNumber;
    quotation.quotationNo = quotationNumber;
  }

  if (!quotation.status && root.status) quotation.status = root.status;
  if (!quotation.type && root.type) quotation.type = root.type;
  if (!quotation.policyType && root.policyType) quotation.policyType = root.policyType;
  if (!quotation.quotationDate && root.quotationDate) quotation.quotationDate = root.quotationDate;
  if (!quotation.companyName && root.companyName) quotation.companyName = root.companyName;
  if (!quotation.productName && root.productName) quotation.productName = root.productName;
  if (!quotation.createdAt && root.createdAt) quotation.createdAt = root.createdAt;
  if (!quotation.updatedAt && root.updatedAt) quotation.updatedAt = root.updatedAt;

  const customer = {
    ...(fromJson.customer || {}),
    ...(root.customer || {}),
  };
  if (!customer.clientName && (root.clientName || root.riskDetails?.clientName)) {
    customer.clientName = root.clientName || root.riskDetails?.clientName;
  }
  if (!customer.brokerName && root.brokerName) customer.brokerName = root.brokerName;
  const imdValue = customer.imdName || customer.imd || root.imdName || root.imd;
  if (imdValue) {
    customer.imd = imdValue;
    customer.imdName = imdValue;
  }

  const risk = {
    ...(fromJson.risk || {}),
    ...(root.risk || root.riskDetails || {}),
  };
  if (!risk.location && risk.riskLocation) risk.location = risk.riskLocation;
  if (!risk.riskLocation && risk.location) risk.riskLocation = risk.location;
  // city / district alias
  if (!risk.city && risk.district) risk.city = risk.district;
  if (!risk.district && risk.city) risk.district = risk.city;
  // occupancy / riskDescription alias
  if (!risk.occupancy && risk.riskDescription) risk.occupancy = risk.riskDescription;
  if (!risk.riskDescription && risk.occupancy) risk.riskDescription = risk.occupancy;

  const policy = {
    ...(fromJson.policy || {}),
    ...(root.policy || root.policyDetails || {}),
  };
  [
    'caseType',
    'previousInsurer',
    'businessAge',
    'industryType',
    'constructionType',
    'fireFightingMeasures',
    'cctvInstalled',
    'bankName',
    'bankBranch',
  ].forEach((key) => {
    if ((policy[key] == null || policy[key] === '') && root[key] != null && root[key] !== '') {
      policy[key] = root[key];
    }
  });

  const hypothecation =
    policy.hypothecationDetails
    ?? policy.hypothecation
    ?? root.hypothecationDetails
    ?? root.hypothecation;
  if (hypothecation !== undefined) {
    policy.hypothecation = hypothecation;
    policy.hypothecationDetails = hypothecation;
  }

  const financial = isPlainObject(root.financial)
    ? root.financial
    : (isPlainObject(fromJson.financial) ? fromJson.financial : {});

  const coverageSections = Array.isArray(root.coverageSections)
    ? root.coverageSections
    : (Array.isArray(fromJson.coverageSections) ? fromJson.coverageSections : []);

  let sumInsured = isPlainObject(financial.sumInsured)
    ? financial.sumInsured
    : (isPlainObject(calculation.sumInsured) ? calculation.sumInsured : {});

  let assetBreakup = isPlainObject(sumInsured.assetBreakup) ? { ...sumInsured.assetBreakup } : {};
  if (!Object.keys(assetBreakup).length && coverageSections.length) {
    assetBreakup = assetBreakupFromCoverage(coverageSections);
  }

  // Build sumInsured totals from coverage when missing
  if (!Object.keys(sumInsured).length && coverageSections.length) {
    const first = coverageSections[0] || {};
    sumInsured = {
      total: first.total_sum_insured ?? first.totalSumInsured ?? risk.sumInsured ?? null,
      assetBreakup,
    };
  } else if (!sumInsured.assetBreakup && Object.keys(assetBreakup).length) {
    sumInsured = { ...sumInsured, assetBreakup };
  }

  const rates = isPlainObject(root.rates)
    ? root.rates
    : (isPlainObject(calculation.rates)
      ? calculation.rates
      : (isPlainObject(fromJson.rates) ? fromJson.rates : {}));

  // Discounts: legacy financial.discounts OR pct fields on rates
  let discounts = isPlainObject(financial.discounts)
    ? financial.discounts
    : (isPlainObject(root.discounts) ? root.discounts : {});
  if (!Object.keys(discounts).length && Object.keys(rates).length) {
    discounts = {
      iib: rates.discountOnIibPct ?? rates.iib ?? null,
      earthquake: rates.eqDiscountPct ?? rates.earthquake ?? null,
      stfi: rates.stfiDiscountPct ?? rates.stfi ?? null,
    };
  }

  const premium = isPlainObject(root.premium)
    ? root.premium
    : (isPlainObject(financial.premium)
      ? financial.premium
      : (isPlainObject(calculation.premium) ? calculation.premium : {}));

  const inputs = isPlainObject(calculation.inputs)
    ? calculation.inputs
    : (isPlainObject(calculation.customerDetails) ? calculation.customerDetails : {});

  const addons = Array.isArray(root.addons)
    ? root.addons
    : (Array.isArray(fromJson.addons) ? fromJson.addons : []);

  const wordings = toStringList(root.wordings ?? fromJson.wordings);
  const termsConditions = toStringList(root.termsConditions ?? fromJson.termsConditions);

  const totalFromCoverage = coverageSections.reduce((sum, section) => {
    const value = section?.total_sum_insured ?? section?.totalSumInsured;
    return value != null ? sum + Number(value || 0) : sum;
  }, 0);

  const totalSi =
    sumInsured.total
    ?? sumInsured.totalSumInsured
    ?? risk.sumInsured
    ?? root.sumInsured
    ?? (totalFromCoverage || null);

  return {
    quotation,
    customer,
    risk,
    policy,
    covers: policy.covers || {},
    sumInsured,
    assetBreakup,
    discounts,
    premium,
    rates,
    rateReference: root.rateReference ?? null,
    coverageSections,
    inputs,
    addons,
    wordings,
    termsConditions,
    remarks: root.remarks ?? null,
    exports: root.exports ?? null,
    totalSi,
  };
};

export default normalizeQuotationDetail;
