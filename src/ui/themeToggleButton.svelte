<script lang="ts">
	import Sun from "phosphor-svelte/lib/Sun";
	import MoonStars from "phosphor-svelte/lib/MoonStars";
	import Spinner from "phosphor-svelte/lib/Spinner";
	import { scale } from "svelte/transition";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";

	let theme = "";

	onMount(() => {
		theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
	});

	async function toggleMode() {
		if (!browser) return;

		const response = await fetch(`/api/theme`);
		const { theme: newTheme }: { theme: string } = await response.json();

		theme = newTheme;

		if (newTheme === "dark") {
			document.documentElement.setAttribute("class", "dark");
		} else {
			document.documentElement.removeAttribute("class");
		}
	}
</script>

<button
	on:click={toggleMode}
	class="rounded-full border-gray-300 dark:border-d-gray-300 border w-[46px] h-[46px] relative hover:scale-105 transition-all ease-in cursor-default
	"
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
