<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { fade, type TransitionConfig } from "svelte/transition";
	import { cn } from "$crate/utils.js";

	const {
		class: className,
		children,
		transition = (el) => fade(el, { duration: 150 }),
		...rest
	}: SheetPrimitive.OverlayProps & {
		transition?: (element: Element) => TransitionConfig;
	} = $props();
</script>

<SheetPrimitive.Overlay
	class={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ", className)}
	{...rest}
>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:transition></div>
		{/if}
	{/snippet}
</SheetPrimitive.Overlay>
