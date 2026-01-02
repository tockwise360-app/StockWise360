/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          teal: '#06B6D4',
          purple: '#8B5CF6',
          lime: '#BFFF00',
        },
        // Dark Mode Palette
        dark: {
          base: '#020617',
          surface: '#0F172A',
          elevated: '#1E293B',
          hover: '#334155',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        // Light Mode Palette (Updated for better contrast)
        light: {
          base: '#F3F4F6',
          surface: '#FFFFFF',
          elevated: '#FFFFFF',
          hover: '#F9FAFB',
          border: '#D1D5DB', // Darker for better definition
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Typography Scale
        'page-title': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],      // 28px
        'section-title': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],   // 20px
        'card-title': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],          // 16px
        'body': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],           // 14px
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],            // 12px
      },
      boxShadow: {
        // Enhanced shadows for light mode
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
