function toHexChannel(value) {
  return Math.min(Math.max(value, 0), 255).toString(16).padStart(2, '0').toUpperCase();
}

/** Creates API-compatible color values from named RGB channels without scattering hex literals. */
export function rgbToHex(red, green, blue) {
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`;
}
