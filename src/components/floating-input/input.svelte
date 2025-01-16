<script lang="ts">
	import clsx from "clsx";
	import type { HTMLInputAttributes } from "svelte/elements";

	type Props = HTMLInputAttributes;

	let { class: className, placeholder = "input", value = $bindable(""), ...rest }: Props = $props();
</script>

<input class={clsx("form-control", className && className)} bind:value {placeholder} {...rest} />
