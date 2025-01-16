<script lang="ts">
	import Header from "$crate/ui/header.svelte";
	import Footer from "$crate/ui/footer.svelte";
	import MobileHeader from "$crate/ui/mobileHeader.svelte";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import type { Snippet } from "svelte";

	let loading = $state(false);

	beforeNavigate(() => (loading = true));
	afterNavigate(() => (loading = false));

	const { children }: { children: Snippet } = $props();
</script>

<div class="h-full flex flex-col">
	{#if loading}
		<div role="progressbar" class="h-1 fixed top-0 inset-x-0 z-[99999]">
			<div class="h-full w-full bg-yellow-600 animate-indeterminate origin-[0_50%]"></div>
		</div>
	{/if}

	<Header />
	<MobileHeader />
	{@render children()}
	<Footer />
</div>
