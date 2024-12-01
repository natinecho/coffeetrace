/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "loop-scroll": "loop-scroll 50s linear infinite",
      },
      keyframes: {
        // Add your keyframes here
      },
      colors: {
        palette: {
          primary: {
            // main: "#5D87FF",
            main: "#982B1C",
            light: "#ECF2FF",
            dark: " #A67B5B",
          },
          secondary: {
            // main: "#49BEFF",
            main: "#A67B5B",
            light: "#ECF2FF",
            dark: "#5D87FF",
          },
          success: {
            main: "#13DEB9",
            light: "#E6FFFA",
            dark: "#02b3a9",
            contrastText: "#ffffff",
          },
          info: {
            main: "#539BFF",
            light: "#EBF3FE",
            dark: "#1682d4",
            contrastText: "#ffffff",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
