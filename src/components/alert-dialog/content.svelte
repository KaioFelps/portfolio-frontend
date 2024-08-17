<script lang="ts">
	import { AlertDialog } from "bits-ui";
	import { fade } from "svelte/transition";
	import { flyAndScale } from "$crate/utils";
	import clsx from "clsx";

	type $$Props = AlertDialog.ContentProps;

	let className: $$Props["class"] = undefined;
	let transition: $$Props["transition"] = flyAndScale;
</script>

<AlertDialog.Portal class="absolute">
	<AlertDialog.Overlay
		transition={fade}
		transitionConfig={{ duration: 150 }}
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
	/>
	<AlertDialog.Content
		{transition}
		class={clsx(
			"fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
			"shadow-popover outline-none border border-white/5 rounded-2xl p-6 bg-d-backgrond/80 backdrop-blur-md",
			"w-full max-w-[94%] sm:max-w-lg md:w-full",
			className && className,
		)}
		{...$$restProps}
	>
		<slot />
	</AlertDialog.Content>
</AlertDialog.Portal>
