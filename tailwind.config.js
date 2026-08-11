/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}" ],
  theme: {
    extend: {
      'phone': '450px',
      'tablet': '768px',
      'desktop': '1200px',
    },
  },
  plugins: [],
}