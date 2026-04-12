/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./lib/**/*"
  ],
  theme: {
    extend: {
      fontFamily: { 
        rubik: ["Rubik","sans-serif"], 
      },
      colors: {
        brand: {
          primary: '#0082D8',
          secondary: '#ffffff',
          accent: '#0082D8',
          dark: '#0a0a0a',
          light: '#ffffff',
        }
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      dropShadow: {
        'outline': ['2px 0 rgba(0,0,0,.5)', '0 2px rgba(0,0,0,.5)', '-2px 0 rgba(0,0,0,.5)', '0 -2px rgba(0,0,0,.5)'],
      },
      touchAction: {
        'manipulation': 'manipulation',
      },
      animation: {
        'tap': 'tap 0.2s ease-out',
      },
      keyframes: {
        tap: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    daisyui,    
  ],
  daisyui: {
    themes: false,
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
    themeRoot: ":root",
  },
}