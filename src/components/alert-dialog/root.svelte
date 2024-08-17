<script lang="ts">
	import { AlertDialog } from "bits-ui";

	type $$Props = AlertDialog.Props;

	export let open = false;
</script>

<AlertDialog.Root bind:open {...$$restProps}><slot /></AlertDialog.Root>
