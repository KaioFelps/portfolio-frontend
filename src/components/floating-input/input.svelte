<script lang="ts">
	import clsx from "clsx";
	import type { HTMLInputAttributes } from "svelte/elements";

	type $$Props = HTMLInputAttributes;

	let className: $$Props["class"] = undefined;
	let placeholder: $$Props["placeholder"] = "input";
	let value: $$Props["value"] = "";

	export { className as class, placeholder, value };
</script>

<input
	class={clsx("form-control", className && className)}
	bind:value
	{placeholder}
	{...$$restProps}
/>
