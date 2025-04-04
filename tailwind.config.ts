import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      corePlugins: {
        preflight: false,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      important: '#__next',
      fontFamily: {
        mitr: ['var(--font-mitr)'],
        rubik: ['var(--font-rubik)'],
        'bai-jamjuree': ['var(--font-bai-jamjuree)'],
      },
      colors: {
        primary: {
          100: '#FEF5E6',
          200: '#F29B6D',
          300: '#EB6D2A',
          400: '#E35205',
          500: '#BB4100',
        },
        gray: {
          100: '#F2F2F2',
          200: '#EAEAEA',
          300: '#CFCFCF',
          400: '#BFBFBF',
          500: '#A6A6A6',
          600: '#666666',
          700: '#404040',
          800: '#2A2A2A',
        },
        error: {
          100: '#FCE8E8',
          200: '#F18383',
          300: '#EB5757',
          400: '#E84040',
          500: '#C51717',
        },
        success: {
          100: '#E5FFE8',
          200: '#A8FFB2',
          300: '#00C558',
          400: '#00B250',
          500: '#00612C',
        },
        info: {
          100: '#E6EDFF',
          200: '#5D8AFE',
          300: '#2A65FE',
          400: '#1053FE',
          500: '#0137C1',
        },
        warning: {
          100: '#FEF7E6',
          200: '#FBD87E',
          300: '#FAC94D',
          400: '#F9C234',
          500: '#DA9F06',
        },
        white: '#FFFFFF',
        black: '#000000',
        monday: '#FFFAB0',
        tuesday: '#FFC7F2',
        wednesday: '#A4DCA9',
        thursday: '#FFB388',
        friday: '#88D9FF',
        saturday: '#D9C6FF',
        sunday: '#FFA8AA',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      mobile: '480px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
  },
  plugins: [],
};
export default config;
