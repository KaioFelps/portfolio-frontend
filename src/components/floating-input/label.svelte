<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";

	type Props = HTMLLabelAttributes;

	const { class: className, children, ...rest }: Props = $props();
</script>

<label {...rest}>{@render children?.()}</label>
