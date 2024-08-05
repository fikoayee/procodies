/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        greenMid: '#006340',
        greenTxt: '#293632',
        grayLight: '#f5f5f5'
      },
    },
  },
  plugins: [],
}
