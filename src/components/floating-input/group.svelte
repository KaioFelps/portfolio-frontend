<script lang="ts">
	import clsx from "clsx";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLDivElement>;

	const { class: className, children, ...rest }: Props = $props();
</script>

<div class={clsx("form-floating", className && className)} {...rest}>
	{@render children?.()}
</div>
