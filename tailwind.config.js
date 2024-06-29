import typography from "@tailwindcss/typography";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
      screens: {
        main: "1152px",
        mainExpanded: "1244px",
        xs: "480px",
        "2xs": "380px"
      },
      keyframes: {
        sheetSwipeInFromLeft: {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        sheetSwipeInToLeft: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
      },
      animation: {
        sheetSwipeInFromLeft: "sheetSwipeInFromLeft 150ms ease-out",
        sheetSwipeInToLeft: "sheetSwipeInToLeft 150ms ease-in",
      },
    },
    fontFamily: {
      "sans": ["Roboto", "sans-serif"]
    },
    colors: {
      "white": "#ffffff",
      "black": "#000000",
      "transparent": "transparent",

      "backgrond": "#F8F8F8",
      "d-backgrond": "#100f13",

      "yellow-900": "#C57C10",
      "yellow-700": "#f3a002",
      "yellow-600": "#ffb900",
      "yellow-500": "#FFC700",
      
      "tangerine-600": "#FF7A00",

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

      "red-700": "#b91c1c",
      "red-600": "#e02929",

      "green-500": "#1BB82B",
    },
  },
  darkMode: "selector",
  plugins: [
    typography,
  ],
}
