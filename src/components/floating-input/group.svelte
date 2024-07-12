<script lang="ts">
	import clsx from "clsx";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;

	export { className as class };
</script>

<div class={clsx("form-floating", className && className)} {...$$restProps}>
	<slot />
</div>
