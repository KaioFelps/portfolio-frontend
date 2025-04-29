<script lang="ts">
	import { Collapsible } from "bits-ui";
	import type { Snippet } from "svelte";
	import { slide } from "svelte/transition";

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

<Collapsible.Content class="flex flex-col items-stretch">
	{#snippet child({ open, props })}
		{#if open}
			<div {...props} transition:slide={{ duration: 200 }}>
				{@render children()}
			</div>
		{/if}
	{/snippet}
</Collapsible.Content>
