import { writable } from "svelte/store";

export const Themes = Object.freeze({
	dark: "dark",
	light: "light",
});

export type ThemesOptions = keyof typeof Themes;

export let theme = writable<ThemesOptions>();
