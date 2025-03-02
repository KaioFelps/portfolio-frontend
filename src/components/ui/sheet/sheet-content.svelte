<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";
	import { cn } from "$crate/utils.js";
	import { sheetVariants, type Side } from ".";
	import { Portal, Overlay } from ".";

	type ContentPropsWithoutChildOrChildren = Omit<SheetPrimitive.ContentProps, "child" | "children">;

	let {
		class: className,
		side = "right",
		children,
		...restProps
	}: ContentPropsWithoutChildOrChildren & {
		side?: Side;
		children: Snippet;
	} = $props();
</script>

<Portal>
	<Overlay />
	<SheetPrimitive.Content class={cn(sheetVariants({ side }), className)} {...restProps}>
		{@render children?.()}
	</SheetPrimitive.Content>
</Portal>
