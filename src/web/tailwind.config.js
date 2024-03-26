/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    backgroundColor:{
      'black':'#16141D',
      'white':'#ffffff',
      'box-background':'#0F172A',
      'input-background':'#26242D',
    },
    backdropFilter: {
      'blur': 'blur(6px)'
    },
    backgroundImage: theme => ({
      'gradient-radial': 'radial-gradient(ellipse at center, #1B2B34 0%, #1B2B34 100%)',
      'gradient-linear': 'linear-gradient(88.33deg, #E1458C 1.42%, #A750DF 93.96%, #A151E8 104.35%, #FF328F 104.36%);',
      'gradient-conic': 'conic-gradient(#1B2B34, #1B2B34 25%, #1B2B34 50%, #1B2B34 75%, #1B2B34)',
      'hover-gradient':"linear-gradient(248.97deg, #E1458C 30.28%, #A750DF 87.86%, #A151E8 105.15%, #FF328F 105.16%);"
    }),
    colors:{
      't-black':'#16141D',
      't-white':'#ffffff'
    },
    width:{
      'page-width':'70%',
      'info-box':'45%',
      'input-width':'50%',
      'mobile-input-width':'70%',
      'smaller-mobile-input':'95%',
      'mint-after-width':"60%"
    },
    maxWidth:{
      //for containing the elements at larger devices
      'center-width':'1170px'
    },
    fontSize:{
      'xxl':"35px",
      'xl':"32px",
      'md':'22px',
      'sm':'14px'
    },
    borderColor:{
      'border-button':'#ffffff40',
      'border-boxes':'#ffffff80',
      'white-mode':"#000000"
    },
    variants: {
      extend: {
        backgroundColor: ['dark'], // Add this line
        textColor: ['dark'], // Add this line
      }
    },
    screens: {
      '2xl': '1800px',

      'xl': '1280px',

      'lg': '1023px',

      'md': '767px',
      
      'xm':'450px',

      'sm': '0px',
    },
  },
  plugins: [],
};
