<script lang="ts">
	import { AlertDialog } from "bits-ui";
	import type { Snippet } from "svelte";

	type Props = AlertDialog.Props & {
		children: Snippet;
	};

	let { open = $bindable(false), children, ...rest }: Props = $props();
</script>

<AlertDialog.Root bind:open {...rest}>{@render children()}</AlertDialog.Root>
