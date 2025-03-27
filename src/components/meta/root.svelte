<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

<svelte:head>
	{@render children()}
</svelte:head>
