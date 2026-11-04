const mobileQuery = '(max-width: 48rem)';

export function subscribeToMobile(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(mobileQuery);
  mediaQuery.addEventListener('change', callback);

  return () => mediaQuery.removeEventListener('change', callback);
}

export function getIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia(mobileQuery).matches
    : false;
}
