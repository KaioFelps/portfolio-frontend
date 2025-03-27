<script lang="ts">
	type Props = {
		description: string;
		adminRoute?: boolean;
	};

	const { description, adminRoute = false }: Props = $props();
</script>

{#if !adminRoute}
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />
{/if}
