<script lang="ts">
	import clsx from "clsx";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLButtonElement> & {
		active: boolean;
		builder?: any;
		children?: Snippet<[{ weight: string; size: string }]>;
	};

	const { children, class: className, active = true, builder, ...rest }: Props = $props();
</script>

{#if builder}
	<button
		{...rest}
		class={clsx(
			"p-2 rounded-md bg-white/10 leading-none cursor-default transition-all",
			!active && "hover:bg-white/15 active:bg-white/20",
			active && "bg-white/[1%] text-white/60 ring-1 ring-white/10",
			className && className,
		)}
		{...builder}
		use:builder.action
	>
		{@render children?.({ weight: "bold", size: "20" })}
	</button>
{:else}
	<button
		{...rest}
		class={clsx(
			"p-2 rounded-md bg-white/10 leading-none cursor-default transition-all",
			!active && "hover:bg-white/15 active:bg-white/20",
			active && "bg-white/[1%] text-white/60 ring-1 ring-white/10",
			className && className,
		)}
	>
		{@render children?.({ weight: "bold", size: "20" })}
	</button>
{/if}
