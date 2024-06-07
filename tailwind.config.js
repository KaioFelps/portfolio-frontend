/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "backgrond": "#F8F8F8",
        "d-backgrond": "#18171D",

        "yellow-700": "#C57C10",
        "yellow-600": "#FF7A00",
        "yellow-500": "#FFC700",
        
        "blue-500": "#0066FF",
        
        "gray-800": "#242E3C",
        "gray-600": "#4C4E59",
        "gray-300": "#D7D9E1",
        "gray-200": "#E9EBF1",
        "gray-100": "#F3F5F8",
        
        "d-gray-800": "#DBE3ED",
        "d-gray-600": "#A9ADB4",
        "d-gray-300": "#3E404F",
        "d-gray-200": "#252628",
        "d-gray-100": "#1D1F22",

        "violet-500": "#8F00FF",

        "green-500": "#1BB82B",
      },
    },
  },
  darkMode: "selector",
  plugins: [],
}

