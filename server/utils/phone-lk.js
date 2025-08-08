export function isValidLKNumber(number) {
  // matches "+94"/"94" and 9 nums
  return /^(\+?94)\d{9}$/.test(String(number).trim());
}

export function toE164LK(number) {
  const raw = String(number).trim();
  if (!isValidLKNumber(raw)) {
    throw new Error(
      "Invalid Sri Lankan phone number. Expect 94XXXXXXXXX or +94XXXXXXXXX"
    );
  }
  return raw.startsWith("+") ? raw : `+${raw}`;
}

export function wa(number) {
  return `whatsapp:${toE164LK(number)}`;
}
