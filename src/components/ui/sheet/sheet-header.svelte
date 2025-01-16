<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$crate/utils.js";

	type Props = HTMLAttributes<HTMLDivElement>;

	const { class: className, children, ...rest }: Props = $props();
</script>

<div class={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...rest}>
	{@render children?.()}
</div>
