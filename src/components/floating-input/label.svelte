<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";

	type $$Props = HTMLLabelAttributes;
</script>

<label {...$$restProps}><slot /></label>
