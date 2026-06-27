// src/lib/countryCodes.js
export const COUNTRY_CODES = [
  { code: '+91', name: 'India', iso: 'IN', lengths: [10] },
  { code: '+81', name: 'Japan', iso: 'JP', lengths: [10] },
  { code: '+44', name: 'United Kingdom', iso: 'GB', lengths: [10] },
  { code: '+1', name: 'USA/Canada', iso: 'US', lengths: [10] },
  { code: '+971', name: 'UAE', iso: 'AE', lengths: [9] },
  { code: '+61', name: 'Australia', iso: 'AU', lengths: [9] },
  { code: 'OTHER', name: 'Other (enter code)', iso: '??', lengths: null },
];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0];

export function findCountryByCode(code) {
  return COUNTRY_CODES.find((c) => c.code === code) || DEFAULT_COUNTRY;
}

export function validateMobileForCountry(mobile, countryCode) {
  const digitsOnly = mobile.replace(/\D/g, '');
  if (countryCode === 'OTHER') {
    return digitsOnly.length >= 6 && digitsOnly.length <= 15;
  }
  const country = findCountryByCode(countryCode);
  return country.lengths.includes(digitsOnly.length);
}

export function validateCustomCountryCode(code) {
  return /^\+\d{1,4}$/.test(code);
}

export function resolveCountryInfo(countryCode, customCountryCode) {
  if (countryCode === 'OTHER') {
    return {
      code: customCountryCode,
      name: `Other (${customCountryCode})`,
    };
  }
  const country = findCountryByCode(countryCode);
  return { code: country.code, name: country.name };
}
