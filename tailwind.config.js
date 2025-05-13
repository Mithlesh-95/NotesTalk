/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-background', 'bg-accent',
    'text-primary', 'text-secondary', 'text-tertiary', 'text-background', 'text-accent',
    'border-primary', 'border-secondary', 'border-tertiary', 'border-background', 'border-accent'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#27187e', // dark blue
        secondary: '#758bfd', // light blue
        tertiary: '#aeb8fe', // pale blue
        background: '#f1f2f6', // light gray
        accent: '#ff8600', // orange
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
} 