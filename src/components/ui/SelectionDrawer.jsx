import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

/**
 * Mobile-friendly replacement for <select>.
 * On all screen sizes, tapping opens a bottom-sheet drawer with pill options.
 *
 * Props:
 *   value        – current value (string)
 *   onChange     – (value: string) => void
 *   options      – string[]
 *   placeholder  – string (shown when nothing selected)
 *   label        – string (drawer title)
 *   dark         – bool  (dark-theme trigger button for onboarding screens)
 */
export default function SelectionDrawer({ value, onChange, options, placeholder = 'Select...', label, dark = false }) {
  const [open, setOpen] = useState(false);

  const triggerStyle = dark ? {
    width: '100%',
    minHeight: 44,
    background: 'rgba(255,255,255,0.1)',
    border: '1.5px solid rgba(255,255,255,0.2)',
    borderRadius: 10,
    color: value ? 'white' : 'rgba(255,255,255,0.4)',
    padding: '10px 14px',
    fontSize: 16,
    fontFamily: 'var(--font-body)',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } : {
    width: '100%',
    minHeight: 44,
    background: 'white',
    border: '1.5px solid rgba(30,64,175,0.15)',
    borderRadius: 10,
    color: value ? '#0A1628' : '#9CA3AF',
    padding: '10px 14px',
    fontSize: 16,
    fontFamily: 'var(--font-body)',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  };

  return (
    <>
      <button type="button" style={triggerStyle} onClick={() => setOpen(true)}>
        <span>{value || placeholder}</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>▼</span>
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#0A1628' }}>
              {label || placeholder}
            </DrawerTitle>
          </DrawerHeader>
          <div style={{
            padding: '0 16px 16px',
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            maxHeight: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {options.map(opt => {
              const selected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  style={{
                    width: '100%',
                    minHeight: 48,
                    background: selected ? '#0A1628' : '#F0F4FF',
                    color: selected ? 'white' : '#0A1628',
                    border: 'none',
                    borderRadius: 12,
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    fontWeight: selected ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{opt}</span>
                  {selected && <span>✓</span>}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}