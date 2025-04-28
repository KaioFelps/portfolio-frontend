<script lang="ts">
	import { env } from "$env/dynamic/public";
	import type { Snippet } from "svelte";
	import { resolveCanonicalUrl } from ".";

	type Props = {
		children?: Snippet;
		location?: string;
		isAdmin?: boolean;
	};

	let { children, location, isAdmin = false }: Props = $props();
	const canonicalUrl = resolveCanonicalUrl(env.PUBLIC_APP_URL, location);
</script>

<svelte:head>
	<!-- base metatags -->
	<meta property="og:locale" content="pt_BR" />
	<meta property="og:type" content="website" />
	<meta property="theme-color" content="#FFC700" />

	<meta property="og:site_name" content={env.PUBLIC_APP_NAME} />
	<meta name="application-name" content={env.PUBLIC_APP_NAME} />

	{#if !isAdmin}
		<link rel="canonical" href={canonicalUrl} />
		<meta name="og:url" content={canonicalUrl} />
	{/if}

	{@render children?.()}
</svelte:head>
