<script lang="ts">
	import { AlertDialog } from "bits-ui";
	import { fade, type TransitionConfig } from "svelte/transition";
	import { flyAndScale } from "$crate/utils";
	import clsx from "clsx";
	import type { Snippet } from "svelte";

	type Props = AlertDialog.ContentProps & {
		children: Snippet;
		class?: string;
		transition?: (...args: any) => TransitionConfig;
	};

	const {
		children,
		class: className,
		transition: choosenTransition = flyAndScale,
		...rest
	}: Props = $props();
</script>

<AlertDialog.Portal>
	<AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
		{#snippet child({ open, props })}
			{#if open}
				<div {...props} transition:fade={{ duration: 150 }}></div>
			{/if}
		{/snippet}
	</AlertDialog.Overlay>
	<AlertDialog.Content
		class={clsx(
			"fixed left-[50%] top-[50%] z-50 -translate-x-1/2 -translate-y-1/2",
			"shadow-popover outline-none border border-white/5 rounded-2xl p-6 bg-d-backgrond/80 backdrop-blur-md",
			"w-full max-w-[94%] sm:max-w-lg md:w-full",
			className && className,
		)}
		{...rest}
	>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:choosenTransition>
					{@render children()}
				</div>
			{/if}
		{/snippet}
	</AlertDialog.Content>
</AlertDialog.Portal>
