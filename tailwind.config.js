/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FEF7ED',
        'warm-white': '#FFFBF7',
        'warm-gray': {
          50: '#FAF9F7',
          100: '#F5F3F0',
          200: '#E8E4DF',
          300: '#D4CFC7',
          400: '#B3AA9F',
          500: '#8B8176',
          600: '#6B6157',
          700: '#4A433B',
          800: '#2F2A24',
          900: '#1A1815',
        },
        'primary': '#065F46',
        'primary-light': '#D1FAE5',
        'secondary': '#1E40AF',
        'secondary-light': '#DBEAFE',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'lg': '0 8px 25px rgba(0, 0, 0, 0.08)',
        'xl': '0 16px 40px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}