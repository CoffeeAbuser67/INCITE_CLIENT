// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}", // Adjust this based on your project's structure
//     "./public/index.html",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         default_olive: "#63706b", // Your custom color
//       },
//     },
//   },
//   plugins: [],
// };




// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default { // <<< MUDANÇA 1: trocado 'module.exports =' por 'export default'
  content: [
    "./index.html", // Adicionado index.html na raiz, que é o padrão do Vite
    "./src/**/*.{js,jsx,ts,tsx}",
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