/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  prefix: 'zener-',
  theme: {
    extend: {
      boxShadow: {
        menu: [
          '0 6px 16px 0 rgba(0,0,0,0.08)',
          '0 3px 6px -4px rgba(0,0,0,0.12)',
          '0 9px 28px 8px rgba(0,0,0,0.05)',
        ],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
