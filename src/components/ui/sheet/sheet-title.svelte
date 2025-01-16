<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$crate/utils.js";

	const { children, class: className, ...rest }: SheetPrimitive.TitleProps = $props();
</script>

<SheetPrimitive.Title class={cn("text-lg font-semibold text-foreground", className)} {...rest}>
	{@render children?.()}
</SheetPrimitive.Title>
