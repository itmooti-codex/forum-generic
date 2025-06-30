export function isFeaturePostEnabled() {
  if (typeof document === 'undefined') return false;
  const el = document.getElementById('featurePostToggler');
  return !!(el && el.checked);
}
