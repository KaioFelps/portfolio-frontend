<script lang="ts">
	import Sun from "phosphor-svelte/lib/Sun";
	import MoonStars from "phosphor-svelte/lib/MoonStars";
	import Spinner from "phosphor-svelte/lib/Spinner";
	import { scale } from "svelte/transition";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { getThemeCookie } from "$crate/utils";
	import { PUBLIC_THEME_COOKIE_KEY } from "$env/static/public";
	import clsx from "clsx";

	let theme = "";

	onMount(() => {
		theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
	});

	async function toggleTheme() {
		if (!browser) return;

		const currentTheme = getThemeCookie(document.cookie);
		console.log(currentTheme);
		let newTheme = currentTheme === "dark" ? "light" : "dark";

		document.cookie = `${PUBLIC_THEME_COOKIE_KEY}=${newTheme}; path=/; SameSite=lax`;
		theme = newTheme;

		if (newTheme === "dark") {
			document.documentElement.setAttribute("class", "dark");
		} else {
			document.documentElement.removeAttribute("class");
		}
	}
</script>

<button
	on:click={toggleTheme}
	class={clsx(
		"rounded-full border-gray-300 dark:border-d-gray-300 border w-[46px] h-[46px] relative hover:scale-105 transition-all ease-in cursor-default",
		"outline-none ring-0 dark:ring-white/15 ring-black/15 focus-within:ring-4",
	)}
>
	{#if theme === "dark"}
		<div transition:scale class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<MoonStars size={24} weight="bold" />
		</div>
	{:else if theme === "light"}
		<div transition:scale class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Sun size={24} weight="bold" />
		</div>
	{:else}
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<Spinner size={24} weight="bold" class="animate-spin" />
		</div>
	{/if}
</button>
