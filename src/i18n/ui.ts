// Add zh labels and translated routes here when translations are ready.
export const defaultLocale = 'en';
export const ui = { en: { home: 'Home', research: 'Research', publications: 'Publications', projects: 'Projects', about: 'About / CV' } };
export const href = (path = '') => `${import.meta.env.BASE_URL}${path}`;
