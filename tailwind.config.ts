import typography from "@tailwindcss/typography";
import { Config } from "tailwindcss";
import { KeyValuePair } from "tailwindcss/types/config";

const { keyframes: sheetKeyframes, animations: sheetAnimations } = generateSheetSwipeAnimations();

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			screens: {
				mainExpanded: "1244px",
				main: "1152px",
				xs: "480px",
				"2xs": "380px",
			},

			width: {
				mainExpanded: "1244px",
				main: "1152px",
				md: "1048px",
				sm: "748px",
				xs: "480px",
				"2xs": "380px",
			},

			keyframes: {
				...sheetKeyframes,
				indeterminate: {
					"0%": { transform: "translateX(0) scaleX(0)" },
					"40%": { transform: "translateX(0) scaleX(0.4)" },
					"100%": { transform: "translateX(100%) scaleX(0.5)" },
				},
			},
			animation: {
				...sheetAnimations,
				indeterminate: "indeterminate 1s infinite ease-in",
			},
		},
		fontFamily: {
			sans: ["Roboto", "sans-serif"],
		},
		colors: {
			white: "#ffffff",
			black: "#000000",
			transparent: "transparent",

			backgrond: "#F8F8F8",
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
		function ({ addVariant }) {
			addVariant(
				"prose-inline-code",
				'& :is(:where(:not(pre)>code):not(:where([class~="not-prose"] *)))',
			);
		},
	],
} as Config;

function generateSheetSwipeAnimations() {
	const sides = [
		{ axis: "Y", side: "Top" },
		{ axis: "Y", side: "Bottom" },
		{ axis: "X", side: "Left" },
		{ axis: "X", side: "Right" },
	];

	const keyframes: KeyValuePair<
		string,
		KeyValuePair<string, KeyValuePair<string, string>>
	> = sides.reduce((acc, { side, axis }) => {
		return {
			...acc,
			[`sheetSwipeInFrom${side}`]: {
				from: {
					transform: `translate${axis}(-100%)`,
				},
				to: {
					transform: `translate${axis}(0)`,
				},
			},
			[`sheetSwipeInTo${side}`]: {
				from: {
					transform: `translate${axis}(0)`,
				},
				to: {
					transform: `translate${axis}(-100%)`,
				},
			},
		};
	}, {});

	const animations: KeyValuePair<string, string> = Object.keys(keyframes).reduce(
		(acc, key: string) => {
			const inOrOut = key.includes("From") ? "out" : "in";
			return {
				...acc,
				[key]: `${key} 150ms ease-${inOrOut}`,
			};
		},
		{},
	);

	return { keyframes, animations };
}
