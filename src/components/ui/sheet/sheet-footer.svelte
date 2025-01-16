<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$crate/utils.js";

	type Props = HTMLAttributes<HTMLDivElement>;

	const { class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
	{...rest}
>
	{@render children?.()}
</div>
