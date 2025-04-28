<script lang="ts">
	type Props = {
		description?: string;
		adminRoute?: boolean;
	};

	const {
		description = "Programador; Desenvolvedor, Analista ou Engenheiro de software; Cientista da Computação. Alguma coisa do gênero.",
		adminRoute = false,
	}: Props = $props();
</script>

{#if !adminRoute}
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />
{/if}
