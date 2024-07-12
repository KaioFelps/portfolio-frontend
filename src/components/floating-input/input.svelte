<script lang="ts">
	import clsx from "clsx";
	import type { HTMLInputAttributes } from "svelte/elements";

	type $$Props = HTMLInputAttributes;

	let className: $$Props["class"] = undefined;
	let placeholder: $$Props["placeholder"] = "input";

	export { className as class, placeholder };
</script>

<input class={clsx("form-control", className && className)} {placeholder} {...$$restProps} />
