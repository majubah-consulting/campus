/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        majubah: {
          blue: '#194759',
          orange: '#EB5436',
          ink: '#102A43',
          mist: '#F7F8FA',
          slate: '#416573',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
