<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$crate/utils.js";

	type Props = SheetPrimitive.DescriptionProps;

	const { class: className, children, ...rest }: Props = $props();
</script>

<SheetPrimitive.Description class={cn("text-sm text-muted-foreground", className)} {...rest}>
	{@render children?.()}
</SheetPrimitive.Description>
