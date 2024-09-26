<script lang="ts">
	import clsx from "clsx";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLButtonElement> & {
		active: boolean;
		builder?: any;
	};

	let className: $$Props["class"] = undefined;
	export let active: $$Props["active"] = true;
	export let builder: $$Props["builder"] = undefined;
</script>

{#if builder}
	<button
		{...$$restProps}
		class={clsx(
			"p-2 rounded-md bg-white/10 leading-none cursor-default transition-all",
			!active && "hover:bg-white/15 active:bg-white/20",
			active && "bg-white/[1%] text-white/60 ring-1 ring-white/10",
			className && className,
		)}
		{...builder}
		use:builder.action
	>
		<slot weight="bold" size="20" />
	</button>
{:else}
	<button
		{...$$restProps}
		class={clsx(
			"p-2 rounded-md bg-white/10 leading-none cursor-default transition-all",
			!active && "hover:bg-white/15 active:bg-white/20",
			active && "bg-white/[1%] text-white/60 ring-1 ring-white/10",
			className && className,
		)}
		on:click
		on:change
		on:keydown
		on:keyup
		on:mouseenter
		on:mouseleave
		on:mousedown
		on:pointerdown
		on:mouseup
		on:pointerup
	>
		<slot weight="bold" size="20" />
	</button>
{/if}
