<script lang="ts">
	import Header from "$crate/ui/header.svelte";
	import Footer from "$crate/ui/footer.svelte";
	import MobileHeader from "$crate/ui/mobile-header.svelte";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import type { Snippet } from "svelte";
	import { env } from "$env/dynamic/public";

	let loading = $state(false);

	beforeNavigate(() => (loading = true));
	afterNavigate(() => (loading = false));

	const { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<!-- base metatags -->
	<meta property="og:locale" content="pt_BR" />
	<meta property="og:type" content="website" />
	<meta property="theme-color" content="#FFC700" />

	<meta property="og:site_name" content={env.PUBLIC_APP_NAME} />
	<meta name="application-name" content={env.PUBLIC_APP_NAME} />

	<link rel="canonical" href={env.PUBLIC_APP_URL} />
	<meta name="og:url" content={env.PUBLIC_APP_URL} />

	<!-- overridable -->
	<title>{env.PUBLIC_APP_NAME}</title>
	<meta
		name="description"
		content="Programador; Desenvolvedor, Analista ou Engenheiro de software; Cientista da Computação. Alguma coisa do gênero."
	/>
</svelte:head>

<div class="flex-1 flex flex-col">
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
