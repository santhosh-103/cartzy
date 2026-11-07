/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#131921',
          light: '#232f3e',
          subnav: '#232f3e',
          yellow: '#febd69',
          orange: '#f08804',
          gold: '#c45500',
          btn: '#ffd814',
          btnHover: '#f7ca00',
          btnOrange: '#ffa41c',
          btnOrangeHover: '#fa8900',
          link: '#007185',
          price: '#b12704',
          gray: '#eaeded',
          darkGray: '#565959'
        }
      }
    },
  },
  plugins: [],
};
