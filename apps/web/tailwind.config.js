/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sw: {
          // Forest Greens
          'forest-900': '#0B3D2E',
          'forest-800': '#0F5A43',
          forest900: '#0B3D2E',
          forest800: '#0F5A43',

          // Primary Greens
          'green-700': '#256618',
          'green-600': '#2E7D1F',
          'green-500': '#38A127',
          'green-100': '#D9F5D0',
          'green-50': '#EFFAEB',
          green700: '#256618',
          green600: '#2E7D1F',
          green100: '#D9F5D0',
          green50: '#EFFAEB',

          // Neutrals / Inks
          'ink-900': '#14181A',
          'ink-800': '#262B29',
          'ink-700': '#3D4441',
          'ink-600': '#5B636B',
          'ink-400': '#9AA1A9',
          'ink-200': '#D1D5DB',
          ink900: '#14181A',
          ink800: '#262B29',
          ink600: '#5B636B',
          ink400: '#9AA1A9',

          // Base
          line: '#E6E9E6',
          bg: '#F6F8F6',
          card: '#FFFFFF',

          // Semantics
          'info-700': '#0B4F9C',
          'info-50': '#E6F0FB',
          info700: '#0B4F9C',
          info50: '#E6F0FB',

          'amber-500': '#F5B301',
          'amber-50': '#FFF4DC',
          amber500: '#F5B301',
          amber50: '#FFF4DC',

          'red-600': '#C62828',
          'red-50': '#FDE8E8',
          red600: '#C62828',
          red50: '#FDE8E8',
        },
        cat: {
          crt: '#DDE8FF',
          lcd: '#D8F6FB',
          pcb: '#E0F5DA',
          cable: '#FFE8D6',
          battery: '#FFF9D6',
          motor: '#FFE0E3',
          plastic: '#EADFFB',
        }
      },
      borderRadius: {
        card: '16px',
        tile: '20px',
        input: '14px',
        sheet: '24px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Outfit"', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        float: '0 10px 30px -4px rgba(15,90,67,0.18), 0 4px 12px -2px rgba(0,0,0,0.06)',
        sheet: '0 -8px 32px rgba(0,0,0,0.12)',
        fab: '0 8px 24px -2px rgba(15, 90, 67, 0.45)',
      },
    },
  },
  plugins: [],
};
