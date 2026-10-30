// Helpers for question text that may be a plain English string or an { en, hi } object.
// Answers are always stored as the English key, so scoring compares keys, not display text.

export function tx(value, language) {
  if (value == null || typeof value === 'string') return value;
  return value[language] ?? value.en ?? '';
}

// The English key an option is scored by.
export function optKey(option) {
  if (typeof option === 'string') return option;
  return option.en ?? option.label;
}

// The option text shown to the learner in the chosen language.
export function optLabel(option, language) {
  if (typeof option === 'string') return option;
  if (language === 'hi' && option.hi) return option.hi;
  return option.en ?? option.label;
}
