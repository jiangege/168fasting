/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ios: {
          blue: "#007aff",
          green: "#34c759",
          red: "#ff3b30",
          gray: {
            50: "#f9f9fb",
            100: "#f2f2f7",
            200: "#e5e5ea",
            300: "#d1d1d6",
            400: "#c7c7cc",
            500: "#aeaeb2",
            600: "#8e8e93",
            700: "#636366",
            800: "#48484a",
            900: "#3a3a3c",
          },
        },
      },
      fontFamily: {
        ios: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
