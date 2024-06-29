<script lang="ts">
	import Header from "$crate/ui/header.svelte";
	import Footer from "$crate/ui/footer.svelte";
	import MobileHeader from "$crate/ui/mobileHeader.svelte";
	import { afterNavigate, beforeNavigate } from "$app/navigation";

	let loading = false;

	beforeNavigate(() => (loading = true));
	afterNavigate(() => (loading = false));
</script>

<div class="h-full flex flex-col">
	{#if loading}
		<div role="progressbar" class="h-1 fixed top-0 inset-x-0">
			<div class="h-full w-full bg-yellow-600 animate-indeterminate origin-[0_50%]" />
		</div>
	{/if}

	<Header />
	<MobileHeader />
	<slot />
	<Footer />
</div>
