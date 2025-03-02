<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$crate/utils.js";

	const { children, ...rest }: SheetPrimitive.PortalProps = $props();
</script>

<SheetPrimitive.Portal {...rest}>
	{@render children?.()}
</SheetPrimitive.Portal>
