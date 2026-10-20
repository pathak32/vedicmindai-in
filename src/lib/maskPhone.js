// Masks an Indian mobile for list views: "+91 98•••••911".
// Keeps the first 2 and last 3 digits so admins can tell rows apart without
// seeing the full number. Reveal the full value only on an explicit, logged action.
export function maskPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length < 6) return raw ? '•••' : '—';
  const last10 = digits.slice(-10);
  return `+91 ${last10.slice(0, 2)}${'•'.repeat(5)}${last10.slice(-3)}`;
}
