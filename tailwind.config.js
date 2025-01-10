/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this based on your project's structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        default_olive: "#63706b", // Your custom color
      },
    },
  },
  plugins: [],
};
