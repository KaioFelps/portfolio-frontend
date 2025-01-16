<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { fly } from "svelte/transition";
	import {
		SheetOverlay,
		SheetPortal,
		type Side,
		sheetTransitions,
		sheetVariants,
	} from "./index.js";
	import { cn } from "$crate/utils.js";

	type Props = SheetPrimitive.ContentProps & {
		side?: Side;
	};

	const {
		class: className,
		children,
		side,
		inTransition = fly,
		inTransitionConfig = sheetTransitions[side ?? "right"].in,
		outTransition = fly,
		outTransitionConfig = sheetTransitions[side ?? "right"].out,
		...rest
	}: Props = $props();
</script>

<SheetPortal>
	<SheetOverlay />
	<SheetPrimitive.Content
		{inTransition}
		{inTransitionConfig}
		{outTransition}
		{outTransitionConfig}
		class={cn(sheetVariants({ side }), className)}
		{...rest}
	>
		{@render children?.()}
	</SheetPrimitive.Content>
</SheetPortal>
