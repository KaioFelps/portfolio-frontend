<script lang="ts">
	import { AlertDialog } from "bits-ui";

	type Props = AlertDialog.TriggerProps;

	const { children, ...rest }: Props = $props();
</script>

<AlertDialog.Trigger {...rest}>
	{@render children?.()}
</AlertDialog.Trigger>
