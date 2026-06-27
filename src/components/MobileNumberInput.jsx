import React from 'react';
import { COUNTRY_CODES } from '@/lib/countryCodes';

export default function MobileNumberInput({
  countryCode,
  onCountryCodeChange,
  customCountryCode,
  onCustomCountryCodeChange,
  mobile,
  onMobileChange,
  placeholder = 'Mobile number',
  hasError = false,
  hasCustomCodeError = false,
  maxDigits = 15,
}) {
  const isOther = countryCode === 'OTHER';

  return (
    <div>
      <div
        style={{
          display: 'flex',
          border: `1.5px solid ${hasError ? '#EF4444' : 'rgba(30,64,175,0.2)'}`,
          borderRadius: 12,
          overflow: 'hidden',
          height: 44,
          background: 'white',
        }}
      >
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          style={{
            border: 'none',
            borderRight: '1px solid rgba(30,64,175,0.15)',
            background: 'transparent',
            fontSize: 14,
            color: '#4B5563',
            padding: '0 8px',
            outline: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            maxWidth: 110,
          }}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code === 'OTHER' ? c.name : `${c.code} ${c.iso}`}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          value={mobile}
          onChange={(e) => onMobileChange(e.target.value.replace(/\D/g, '').slice(0, maxDigits))}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '0 12px',
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#0A1628',
            background: 'transparent',
          }}
        />
      </div>
      {isOther && (
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            value={customCountryCode}
            onChange={(e) => onCustomCountryCodeChange(e.target.value)}
            placeholder="Your country code, e.g. +33"
            style={{
              height: 38,
              width: '100%',
              padding: '0 12px',
              borderRadius: 10,
              border: `1.5px solid ${hasCustomCodeError ? '#EF4444' : 'rgba(30,64,175,0.2)'}`,
              fontSize: 14,
              outline: 'none',
              color: '#0A1628',
              background: 'white',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}
    </div>
  );
}
