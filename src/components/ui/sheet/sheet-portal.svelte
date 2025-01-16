<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$crate/utils.js";

	const { class: className, children, ...rest }: SheetPrimitive.PortalProps = $props();
</script>

<SheetPrimitive.Portal class={cn(className)} {...rest}>
	{@render children?.()}
</SheetPrimitive.Portal>
