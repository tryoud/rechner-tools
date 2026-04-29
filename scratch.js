const SOCIAL_CONFIG_2026 = {
  tax: {
    basicAllowance: 12348,
    thresholds: { progressionStart: 17800, progressionEnd: 69879, richTaxStart: 277826 },
  },
};
function floorEuro(value) {
  return Math.floor(Math.max(value, 0));
}
function incomeTax2026Basic(zve) {
  const x = floorEuro(zve);
  const { basicAllowance, thresholds } = SOCIAL_CONFIG_2026.tax;
  if (x <= basicAllowance) return 0;
  if (x < thresholds.progressionStart) {
    const y = (x - basicAllowance) / 10000;
    return floorEuro((914.51 * y + 1400) * y);
  }
  if (x < thresholds.progressionEnd) {
    const y = (x - thresholds.progressionStart) / 10000;
    return floorEuro((173.1 * y + 2397) * y + 1034.87);
  }
  if (x < thresholds.richTaxStart) {
    return floorEuro(x * 0.42 - 11135.63);
  }
  return floorEuro(x * 0.45 - 19470.38);
}
console.log('Class 1', incomeTax2026Basic(36000));
console.log('Class 6 approx', incomeTax2026Basic(36000 + 12348));
