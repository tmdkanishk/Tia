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


// export const formatIndianCurrency = (value) => {
//   if (!value) return '';
//   const num = value.toString().replace(/,/g, '');
//   if (isNaN(num)) return '';
//   return Number(num).toLocaleString('en-IN');
// };


export const formatIndianCurrency = (value) => {
  if (!value) return '';
  const num = value.toString().replace(/,/g, '');
  if (isNaN(num)) return '';
  return Number(num).toLocaleString('en-US');
};

export const getRawValue = (value) => {
  return String(value).replace(/,/g, '');
};

