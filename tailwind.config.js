/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#050505',
        'background': '#f9fcf8',
        'primary': '#82d133',
        'secondary': '#8bdada',
        'accent': '#69a6ce',
      },
      fontFamily: {
        Edu: ["'Edu AU VIC WA NT Hand'", 'sans-serif'],
      },
    },
  },
  
};
