/** @type {import('tailwindcss').Config} */
export default {
  content: ["public/**/*.{html,js}"],
  theme: {
    extend: {
      maxWidth: {
        screen: ["100vw"],
      },
    },
  },
  plugins: [],
};
