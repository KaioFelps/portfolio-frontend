<script lang="ts">
	import { AlertDialog } from "bits-ui";

	type $$Props = AlertDialog.TriggerProps;
</script>

<AlertDialog.Trigger {...$$restProps}>
	<slot />
</AlertDialog.Trigger>
