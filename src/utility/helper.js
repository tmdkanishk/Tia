import { icons } from "../components/IconComponent";


export const riskCovers = [
  {
    key: "terrorism",
    label: "Terrorism",
    selected: true,
    icon: icons.threat
  },
  {
    key: "burglary",
    label: "Burglary",
    selected: true,
    icon: icons.thief
  },
  {
    key: "machinery_breakdown",
    label: "Machinery Breakdown",
    selected: true,
    icon: icons.process
  },
  {
    key: "boiler_pressure_plant",
    label: "Boiler Pressure Plant",
    selected: true,
    icon: icons.boiler
  },
  {
    key: "electronic_equipment",
    label: "Electronic Equipment",
    selected: true,
    icon: icons.electrical
  },
  {
    key: "portable_equipment",
    label: "Portable Equipment",
    selected: true,
    icon: icons.devices
  },
  {
    key: "money_insurance",
    label: "Money Insurance",
    selected: true,
    icon: icons.money
  },
  {
    key: "fidelity_guarantee",
    label: "Fidelity Guarantee",
    selected: true,
    icon: icons.industry
  },
  {
    key: "personal_accident",
    label: "Personal Accident",
    selected: true,
    icon: icons.car

  },
  {
    key: "business_interruption",
    label: "Business Interruption",
    selected: true,
    icon: icons.businessins
  },
  {
    key: "public_liability",
    label: "Public Liability",
    selected: true,
    icon: icons.mansafe
  },
  {
    key: "plate_glass",
    label: "Plate Glass",
    selected: true,
    icon: icons.protection
  },
];


export const riskIARCovers = [
  {
    key: "terrorism",
    label: "Terrorism",
    selected: true,
    icon: icons.threat
  },
  // {
  //   key: "burglary",
  //   label: "Burglary",
  //   selected: true,
  //   icon: icons.thief
  // },
  // {
  //   key: "machinery_breakdown",
  //   label: "Machinery Breakdown",
  //   selected: true,
  //   icon: icons.process
  // },

  // {
  //   key: "business_interruption",
  //   label: "Business Interruption",
  //   selected: true,
  //   icon: icons.businessins
  // },
  {
    key: "mlop",
    label: "Mlop",
    selected: true,
    icon: icons.growth
  },

];

export const riskFireCovers = [
  {
    key: "terrorism",
    label: "Terrorism",
    selected: true,
    icon: icons.threat
  },
  {
    key: "burglary",
    label: "Burglary",
    selected: true,
    icon: icons.thief
  },
]



export const formattedDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const getExtention = filename => {
  // To get the file extension
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
};


export const getRawValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/,/g, '');
};

export const formatIndianCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '';

  const raw = getRawValue(value);
  if (raw === '') return '';
  if (raw === '.') return '0.';
  if (!/^\d*\.?\d*$/.test(raw)) return '';

  const hasDecimal = raw.includes('.');
  const [intPartRaw, decPart = ''] = raw.split('.');
  const intPart = intPartRaw === '' ? '0' : intPartRaw;

  let formattedInt = intPart;
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    formattedInt = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  return hasDecimal ? `${formattedInt}.${decPart}` : formattedInt;
};

export const formatUSCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '';

  const raw = getRawValue(value);
  if (raw === '') return '';
  if (raw === '.') return '0.';
  if (!/^\d*\.?\d*$/.test(raw)) return '';

  const hasDecimal = raw.includes('.');
  const [intPartRaw, decPart = ''] = raw.split('.');
  const intPart = intPartRaw === '' ? '0' : intPartRaw;
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return hasDecimal ? `${formattedInt}.${decPart}` : formattedInt;
};

export const toNumber = (value) => {
  const raw = getRawValue(value);
  if (raw === '' || raw === '.') return 0;
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
};

