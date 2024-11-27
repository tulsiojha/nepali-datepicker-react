/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  prefix: 'zener-',
  theme: {
    colors: {
      'input-text': 'var(--zener-input-text)',
      'input-bg': 'var(--zener-input-bg)',
      'input-border': 'var(--zener-input-border)',
      'input-focus-ring': 'var(--zener-input-focus-ring)',
      'input-disabled-bg': 'var(--zener-input-disabled-bg)',
      'input-disabled-text': 'var(--zener-input-disabled-text)',
      'input-disabled-border': 'var(--zener-input-disabled-border)',
      'menu-container-bg': 'var(--zener-menu-container-bg)',
      'menu-container-text': 'var(--zener-menu-container-text)',
      'menu-container-text-border': 'var(--zener-menu-container-text-border)',
      'menu-container-text-selected':
        'var(--zener-menu-container-text-selected)',
      'menu-container-text-selected-disabled':
        'var(--zener-menu-container-text-selected-disabled)',
      'menu-container-text-selected-bg':
        'var(--zener-menu-container-text-selected-bg)',
      'menu-container-text-selected-disabled-bg':
        'var(--zener-menu-container-text-selected-disabled-bg)',
      'menu-container-item-hover': 'var(--zener-menu-container-item-hover)',
      'menu-container-text-disabled':
        'var(--zener-menu-container-text-disabled)',
      'menu-footer-today': 'var(--zener-menu-footer-today-text)',
      'menu-footer-today-hover': 'var(--zener-menu-footer-today-hover-text)',
      'menu-header-icon': 'var(--zener-menu-header-icon)',
      'menu-header-icon-hover': 'var(--zener-menu-header-icon-hover)',
      'menu-header-icon-disabled': 'var(--zener-menu-header-icon-disabled)',
      'menu-container-top-bottom-border':
        'var(--zener-menu-container-top-bottom-border)',
      transparent: 'rgba(255,255,255,0.0)',
      inherit: 'inherit',
    },
    extend: {
      boxShadow: {
        menu: [
          '0 6px 16px 0 rgba(0,0,0,0.08)',
          '0 3px 6px -4px rgba(0,0,0,0.12)',
          '0 9px 28px 8px rgba(0,0,0,0.05)',
        ],
        'menu-dark': [
          '0 6px 16px 0 rgba(41,41,41,0.08)',
          '0 3px 6px -4px rgba(41,41,41,0.12)',
          '0 9px 28px 8px rgba(41,41,41,0.05)',
        ],
      },
    },
  },

  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
