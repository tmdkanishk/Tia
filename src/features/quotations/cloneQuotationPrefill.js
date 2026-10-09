import { normalizeQuotationDetail } from './normalizeQuotationDetail';

const toInput = (value) => {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
};

const parseMaybeJson = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const looksLikeCalculatorRequest = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  if (!obj.customerDetails || typeof obj.customerDetails !== 'object') return false;
  return !!(obj.sumInsured || obj.sections || obj.discounts || obj.riskCovers || obj.optionalCovers);
};

/** Original calculator body, if the detail payload still has it. */
export const findCalculatorRequest = (raw) => {
  const seen = new Set();
  const matches = [];

  const visit = (node, depth) => {
    if (!node || typeof node !== 'object' || seen.has(node) || depth > 5) return;
    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, depth + 1));
      return;
    }
    seen.add(node);
    if (looksLikeCalculatorRequest(node)) matches.push(node);

    const parsed = parseMaybeJson(node.quotationJson);
    if (parsed) visit(parsed, depth + 1);

    ['calculation', 'inputs', 'request', 'payload', 'data', 'quotation'].forEach((key) => {
      if (node[key]) visit(node[key], depth + 1);
    });
  };

  visit(raw, 0);
  if (!matches.length) return null;
  return matches.sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0];
};

const mapAddons = (list = []) =>
  (Array.isArray(list) ? list : []).map((item) => ({
    id: item.id,
    addonName: item.name || item.addonName || '',
    value: toInput(item.value),
  }));

const pickAmount = (source = {}, ...keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== null && value !== undefined && value !== '') return toInput(value);
  }
  return '';
};

const sumNumbers = (values) =>
  values.reduce((total, value) => total + (parseFloat(value) || 0), 0);

const flagToBool = (value) => {
  if (value === true || value === 'Yes' || value === 'yes' || value === 1 || value === '1') return true;
  if (value === false || value === 'No' || value === 'no' || value === 0 || value === '0') return false;
  return null;
};

const findSection = (sections = [], pattern) =>
  sections.find((section) => pattern.test(`${section?.section_name || ''} ${section?.section_key || ''}`));

const itemAmount = (section, pattern) => {
  const item = (section?.items || []).find((entry) => pattern.test(String(entry?.particular || '')));
  if (!item) return '';
  return toInput(item.sum_insured ?? item.sumInsured);
};

const FIRE_ASSET_FIELDS = [
  ['buildingSI', /^building$/i],
  ['plantAndMachinerySI', /plant/i],
  ['stockSI', /^stock$/i],
  ['furnitureFixturesFittingsSI', /furniture/i],
  ['otherContentsSI', /other\s*contents/i],
];

/** Line items from the fire section only. Burglary repeats the other four assets. */
const fireSectionAmounts = (sections = []) => {
  const fire = sections.find((section) =>
    /fire/i.test(`${section?.section_name || ''} ${section?.section_key || ''}`)
  );
  if (!fire?.items?.length) return null;

  const amounts = {};
  fire.items.forEach((item) => {
    const particular = String(item?.particular || '').trim();
    const match = FIRE_ASSET_FIELDS.find(([, pattern]) => pattern.test(particular));
    if (!match || amounts[match[0]]) return;
    const amount = toInput(item?.sum_insured ?? item?.sumInsured);
    if (amount === '') return;
    amounts[match[0]] = amount;
  });

  return Object.keys(amounts).length ? amounts : null;
};

const preferFireSectionAmounts = (amounts, raw) => {
  const fromFire = fireSectionAmounts(normalizeQuotationDetail(raw || {}).coverageSections);
  if (!fromFire) return amounts;
  return { ...amounts, ...fromFire };
};

const assetAmounts = (model) => {
  const assets = model.assetBreakup || {};
  const requestSi = model.sumInsured || {};
  return {
    buildingSI: pickAmount(assets, 'building') || pickAmount(requestSi, 'building', 'buildingSI'),
    plantAndMachinerySI: pickAmount(assets, 'plantAndMachinery') || pickAmount(requestSi, 'plantAndMachinery', 'plantAndMachinerySI'),
    stockSI: pickAmount(assets, 'stock') || pickAmount(requestSi, 'stock', 'stockSI'),
    furnitureFixturesFittingsSI: pickAmount(assets, 'furnitureFixturesFittings') || pickAmount(requestSi, 'furnitureFixturesFittings', 'furnitureFixturesFittingsSI'),
    otherContentsSI: pickAmount(assets, 'otherContents') || pickAmount(requestSi, 'otherContents', 'otherContentsSI'),
  };
};

const customerFromModel = (model) => ({
  clientName: model.customer?.clientName || model.customer?.customerName || '',
  address: model.risk?.location || model.risk?.riskLocation || '',
  pinCode: toInput(model.risk?.pinCode),
  riskCode: toInput(model.risk?.riskCode ?? model.inputs?.riskCode),
  occupancy: model.risk?.occupancy || model.risk?.riskDescription || model.inputs?.occupancy || '',
  description: model.risk?.riskDescription || model.risk?.occupancy || '',
});

const discountsFromModel = (model) => ({
  iibDiscountPercent: toInput(model.discounts?.iib ?? model.discounts?.iibDiscountPercent),
  eqDiscountPercent: toInput(model.discounts?.earthquake ?? model.discounts?.eqDiscountPercent),
  stfiDiscountPercent: toInput(model.discounts?.stfi ?? model.discounts?.stfiDiscountPercent),
});

export const buildFireClonePrefill = (raw) => {
  const request = findCalculatorRequest(raw);
  const model = normalizeQuotationDetail(raw || {});

  if (request?.customerDetails) {
    const si = request.sumInsured || {};
    const amounts = preferFireSectionAmounts({
      buildingSI: pickAmount(si, 'buildingSI', 'building'),
      plantAndMachinerySI: pickAmount(si, 'plantAndMachinerySI', 'plantAndMachinery'),
      stockSI: pickAmount(si, 'stockSI', 'stock'),
      furnitureFixturesFittingsSI: pickAmount(si, 'furnitureFixturesFittingsSI', 'furnitureFixturesFittings'),
      otherContentsSI: pickAmount(si, 'otherContentsSI', 'otherContents'),
    }, raw);
    const terrorism = request.riskCovers?.terrorism !== false;
    const burglary = request.riskCovers?.burglary !== false;
    return {
      customerDetails: {
        clientName: request.customerDetails.clientName || '',
        address: request.customerDetails.address || '',
        pinCode: toInput(request.customerDetails.pinCode),
        riskCode: toInput(request.customerDetails.riskCode),
        occupancy: request.customerDetails.occupancy || '',
      },
      terrorism,
      burglary,
      discounts: {
        iibDiscountPercent: toInput(request.discounts?.iibDiscountPercent),
        eqDiscountPercent: toInput(request.discounts?.eqDiscountPercent),
        stfiDiscountPercent: toInput(request.discounts?.stfiDiscountPercent),
      },
      sumInsured: amounts,
      totalSumInsured: sumNumbers(Object.values(amounts)),
      addons: mapAddons(request.addons),
    };
  }

  const amounts = preferFireSectionAmounts(assetAmounts(model), raw);
  const terrorismFlag = flagToBool(model.covers?.terrorism);
  const burglaryFlag = flagToBool(model.covers?.burglaryRsmdTheft ?? model.covers?.burglary);
  return {
    customerDetails: {
      clientName: customerFromModel(model).clientName,
      address: customerFromModel(model).address,
      pinCode: customerFromModel(model).pinCode,
      riskCode: customerFromModel(model).riskCode,
      occupancy: customerFromModel(model).occupancy,
    },
    terrorism: terrorismFlag !== false,
    burglary: burglaryFlag !== false,
    discounts: discountsFromModel(model),
    sumInsured: amounts,
    totalSumInsured: sumNumbers(Object.values(amounts)),
    addons: mapAddons(model.addons),
  };
};

const BUSINESS_SECTION_MATCHERS = [
  ['section1', /fire/i],
  ['section2', /burglary/i],
  ['section3A', /machinery/i],
  ['section3B', /boiler|pressure plant/i],
  ['section4', /electronic/i],
  ['section5', /portable/i],
  ['section6', /money/i],
  ['section7', /fidelity/i],
  ['section8', /personal accident/i],
  ['section9', /business interruption/i],
  ['section10', /public liability/i],
  ['section11', /plate glass/i],
];

const BUSINESS_ITEM_FIELDS = [
  ['tableA_DeathBenefitOnlySI', /table a/i],
  ['tableB_DeathPlusPTDSI', /table b/i],
  ['tableC_DeathPTDPPDSI', /table c/i],
  ['tableD_DeathPTDPPDTTDSI', /table d/i],
  ['ownersSurroundingPropertySI', /surrounding|owner/i],
  ['thirdPartyLiabilitySI', /third party/i],
  ['moneyInTransitSI', /transit/i],
  ['moneyInCounterSI', /counter/i],
  ['moneyInSafeSI', /safe/i],
  ['numberOfEmployees', /no\.? of employees|number of employees/i],
  ['perEmployeeSI', /per employee/i],
  ['totalEmployees', /total employee/i],
  ['businessInterruptionTerrorismSI', /terrorism/i],
  ['businessInterruptionSI', /business interruption|indemnity|flop/i],
  ['machineryBreakdownSI', /machinery/i],
  ['boilerPressurePlantSI', /boiler|bpp/i],
  ['electronicEquipmentSI', /electronic|eei/i],
  ['portableEquipmentSI', /portable/i],
  ['publicLiabilitySI', /public liability/i],
  ['plateGlassSI', /plate glass/i],
  ['furnitureFixturesFittingsSI', /furniture/i],
  ['plantAndMachinerySI', /plant/i],
  ['otherContentsSI', /other contents/i],
  ['buildingSI', /building/i],
  ['stockSI', /\bstock\b/i],
  ['earthquakeSI', /earthquake/i],
  ['stfiSI', /stfi/i],
  ['terrorismSI', /terrorism/i],
  ['totalBurglarySI', /burglary/i],
];

const RATE_KEYS = {
  section3A: 'machineryBreakdown',
  section3B: 'boilerPressurePlant',
  section4: 'electronicEquipment',
  section5: 'portableEquipment',
  section6: 'moneyInsurance',
  section7: 'fidelityGuarantee',
  section8: 'personalAccident',
  section10: 'publicLiability',
  section11: 'plateGlass',
};

const COVER_BY_SECTION = {
  section2: 'burglary',
  section3A: 'machineryBreakdown',
  section3B: 'boilerPressurePlant',
  section4: 'electronicEquipment',
  section5: 'portableEquipment',
  section6: 'moneyInsurance',
  section7: 'fidelityGuarantee',
  section8: 'personalAccident',
  section9: 'businessInterruption',
  section10: 'publicLiability',
  section11: 'plateGlass',
};

const sectionHasAmount = (fields = {}) =>
  Object.entries(fields).some(([key, value]) => key !== 'sectionName' && key !== 'remarks' && (parseFloat(value) || 0) > 0);

const sectionsFromCoverage = (model, amounts) => {
  const sections = {};
  const customRates = {};
  const riskCovers = {};
  const total = sumNumbers(Object.values(amounts));
  const totalText = total ? String(total) : '';

  sections.section1 = {
    ...amounts,
    earthquakeSI: totalText,
    stfiSI: totalText,
    terrorismSI: totalText,
  };

  const burglaryTotal =
    (parseFloat(amounts.plantAndMachinerySI) || 0) +
    (parseFloat(amounts.stockSI) || 0) +
    (parseFloat(amounts.furnitureFixturesFittingsSI) || 0) +
    (parseFloat(amounts.otherContentsSI) || 0);
  sections.section2 = {
    plantAndMachinerySI: amounts.plantAndMachinerySI,
    stockSI: amounts.stockSI,
    furnitureFixturesFittingsSI: amounts.furnitureFixturesFittingsSI,
    otherContentsSI: amounts.otherContentsSI,
    totalBurglarySI: burglaryTotal ? String(burglaryTotal) : '',
  };

  (model.coverageSections || []).forEach((section) => {
    const match = BUSINESS_SECTION_MATCHERS.find(([, pattern]) =>
      pattern.test(`${section?.section_name || ''} ${section?.section_key || ''}`)
    );
    if (!match) return;
    const [sectionKey] = match;
    const fields = {};
    (section.items || []).forEach((item) => {
      const particular = String(item?.particular || '');
      const field = BUSINESS_ITEM_FIELDS.find(([, pattern]) => pattern.test(particular));
      if (!field) return;
      const amount = toInput(item?.sum_insured ?? item?.sumInsured);
      if (amount !== '') fields[field[0]] = amount;
    });
    if (Object.keys(fields).length) {
      sections[sectionKey] = { ...(sections[sectionKey] || {}), ...fields };
    }
    if (section?.rate != null && section.rate !== '' && RATE_KEYS[sectionKey]) {
      customRates[RATE_KEYS[sectionKey]] = section.rate;
    }
    if (COVER_BY_SECTION[sectionKey]) {
      riskCovers[COVER_BY_SECTION[sectionKey]] = sectionHasAmount(sections[sectionKey] || fields);
    }
  });

  const terrorism = flagToBool(model.covers?.terrorism);
  const burglary = flagToBool(model.covers?.burglaryRsmdTheft ?? model.covers?.burglary);
  if (terrorism !== null) riskCovers.terrorism = terrorism;
  if (burglary !== null) riskCovers.burglary = burglary;
  else if (sectionHasAmount(sections.section2)) riskCovers.burglary = true;

  return { sections, customRates, riskCovers, totalSI: totalText };
};

export const buildBusinessClonePrefill = (raw) => {
  const request = findCalculatorRequest(raw);
  if (request?.customerDetails && (request.sections || request.sumInsured)) {
    const sumInsured = preferFireSectionAmounts(request.sumInsured || {}, raw);
    const sections = request.sections?.section1
      ? {
          ...request.sections,
          section1: {
            ...request.sections.section1,
            buildingSI: sumInsured.buildingSI ?? request.sections.section1.buildingSI,
            plantAndMachinerySI: sumInsured.plantAndMachinerySI ?? request.sections.section1.plantAndMachinerySI,
            stockSI: sumInsured.stockSI ?? request.sections.section1.stockSI,
            furnitureFixturesFittingsSI: sumInsured.furnitureFixturesFittingsSI ?? request.sections.section1.furnitureFixturesFittingsSI,
            otherContentsSI: sumInsured.otherContentsSI ?? request.sections.section1.otherContentsSI,
          },
        }
      : request.sections || {};
    return {
      fromRequest: true,
      customerDetails: request.customerDetails,
      riskCovers: request.riskCovers || {},
      discounts: request.discounts || {},
      sumInsured,
      customRates: request.customRates || {},
      sections,
      addons: mapAddons(request.addons),
    };
  }

  const model = normalizeQuotationDetail(raw || {});
  const customer = customerFromModel(model);
  const amounts = preferFireSectionAmounts(assetAmounts(model), raw);
  const derived = sectionsFromCoverage(model, amounts);
  return {
    fromRequest: false,
    customerDetails: customer,
    riskCovers: {
      terrorism: true,
      burglary: true,
      ...derived.riskCovers,
    },
    discounts: discountsFromModel(model),
    sumInsured: { ...amounts, totalSI: derived.totalSI },
    customRates: derived.customRates,
    sections: derived.sections,
    addons: mapAddons(model.addons),
  };
};

export const buildIarClonePrefill = (raw) => {
  const request = findCalculatorRequest(raw);
  const model = normalizeQuotationDetail(raw || {});

  if (request?.customerDetails) {
    const si = request.sumInsured || {};
    const amounts = preferFireSectionAmounts({
      buildingSI: pickAmount(si, 'buildingSI', 'building'),
      plantAndMachinerySI: pickAmount(si, 'plantAndMachinerySI', 'plantAndMachinery'),
      stockSI: pickAmount(si, 'stockSI', 'stock'),
      furnitureFixturesFittingsSI: pickAmount(si, 'furnitureFixturesFittingsSI', 'furnitureFixturesFittings'),
      otherContentsSI: pickAmount(si, 'otherContentsSI', 'otherContents'),
    }, raw);
    const section1 = request.sections?.section1 || {};
    const section2 = request.sections?.section2 || {};
    const section3A = request.sections?.section3A || {};
    const section3B = request.sections?.section3B || {};
    return {
      customerDetails: {
        clientName: request.customerDetails.clientName || '',
        address: request.customerDetails.address || '',
        pinCode: toInput(request.customerDetails.pinCode),
        riskCode: toInput(request.customerDetails.riskCode),
        occupancy: request.customerDetails.occupancy || '',
        description: request.customerDetails.description || '',
      },
      discounts: {
        iibDiscountPercent: toInput(request.discounts?.iibDiscountPercent),
        eqDiscountPercent: toInput(request.discounts?.eqDiscountPercent),
        stfiDiscountPercent: toInput(request.discounts?.stfiDiscountPercent),
      },
      terrorism: request.optionalCovers?.terrorism === true,
      mlop: request.optionalCovers?.mlop === true,
      sumInsured: amounts,
      totalSumInsured: String(sumNumbers(Object.values(amounts)) || ''),
      fireAllied: {
        buildingSI: amounts.buildingSI || pickAmount(section1, 'buildingSI'),
        plantAndMachinerySI: amounts.plantAndMachinerySI || pickAmount(section1, 'plantAndMachinerySI'),
        stockSI: amounts.stockSI || pickAmount(section1, 'stockSI'),
        furnitureFixturesFittingsSI: amounts.furnitureFixturesFittingsSI || pickAmount(section1, 'furnitureFixturesFittingsSI'),
        otherContentsSI: amounts.otherContentsSI || pickAmount(section1, 'otherContentsSI'),
      },
      businessInterruptionSI: pickAmount(section2, 'businessInterruptionSI'),
      terrorismSI: pickAmount(section2, 'terrorismSI'),
      machineryBreakdownSI: amounts.plantAndMachinerySI || pickAmount(section3A, 'machineryBreakdownSI'),
      mlopSI: pickAmount(section3B, 'mlopSI'),
      addons: mapAddons(request.addons),
    };
  }

  const customer = customerFromModel(model);
  const amounts = preferFireSectionAmounts(assetAmounts(model), raw);
  const sections = model.coverageSections || [];
  const bi = findSection(sections, /business interruption/i);
  const mlop = findSection(sections, /mlop/i);
  const biAmount = itemAmount(bi, /business interruption|indemnity|flop/i) || itemAmount(bi, /sum insured/i);
  const mlopAmount = itemAmount(mlop, /mlop/i) || toInput(mlop?.total_sum_insured ?? mlop?.totalSumInsured);
  const terrorism = flagToBool(model.covers?.terrorism);
  const mlopOn = mlopAmount !== '' && parseFloat(mlopAmount) > 0;

  return {
    customerDetails: customer,
    discounts: discountsFromModel(model),
    terrorism: terrorism !== false,
    mlop: mlopOn || flagToBool(model.covers?.mlop) !== false,
    sumInsured: amounts,
    totalSumInsured: String(sumNumbers(Object.values(amounts)) || ''),
    fireAllied: { ...amounts },
    businessInterruptionSI: biAmount,
    terrorismSI: biAmount,
    machineryBreakdownSI: amounts.plantAndMachinerySI,
    mlopSI: mlopAmount,
    addons: mapAddons(model.addons),
  };
};
