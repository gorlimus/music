/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffd166",
        secondary: "#ef476f",
        greAcc: "#06d6a0",
        pale: "#073b4c",
        bluAcc: "#118ab2",
        vimeo: "#1ab7ea",
      },
    },
  },
  plugins: [],
};
