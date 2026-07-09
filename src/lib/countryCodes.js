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
  if (!country.lengths.includes(digitsOnly.length)) return false;
  // India: real mobile numbers always start with 6, 7, 8, or 9 — never 0-5.
  // Catches accidental short/misdialled entries that could otherwise slip
  // through on length alone (e.g. a landline-style number starting with 0).
  if (countryCode === '+91' && !/^[6-9]/.test(digitsOnly)) return false;
  return true;
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
