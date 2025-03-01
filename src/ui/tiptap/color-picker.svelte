<script lang="ts">
	import type { Editor } from "@tiptap/core";
	import { flyAndScale } from "$crate/utils";
	import { Popover } from "bits-ui";
	import colors from "tailwindcss/colors";
	import { debounce } from "$crate/lib/debounce";
	import EditorButton from "./editor-button.svelte";
	import PaintBrush from "phosphor-svelte/lib/PaintBrush";

	type PressetColor = [string, string];
	let open = $state(false);

	const { editor }: { editor: Editor } = $props();

	const presetPallete: PressetColor[] = [
		["white", "#ffffff"],
		["black", "#000000"],
		["Purple", colors.purple["500"]],
		["Yellow", colors.yellow["500"]],
		["Blue", colors.blue["500"]],
		["Gray", colors.gray["600"]],
	] as const;

	let selectedColor: string | undefined = $state(editor.getAttributes("textStyle").color);

	let debouncedHandler = debounce(() => {
		editor.chain().focus().setColor(selectedColor!).run();
	}, 200);

	$effect(() => {
		if (selectedColor) debouncedHandler();
	});

	const handleColorPickOpen = () =>
		(selectedColor = editor.getAttributes("textStyle").color ?? "#ffffff");
</script>

<Popover.Root bind:open onOpenChange={handleColorPickOpen}>
	<Popover.Trigger asChild let:builder>
		<EditorButton active={false} {builder}>
			<PaintBrush size="20" weight="bold" />
		</EditorButton>
	</Popover.Trigger>
	<Popover.Content
		transition={flyAndScale}
		align="start"
		sideOffset={8}
		alignOffset={0}
		sameWidth={false}
		class="max-w-[calc(100%-_48px)] min-w-[200px] dropdown p-3"
	>
		<span><strong>Alterar cor do texto</strong></span>

		<input bind:value={selectedColor} type="color" id="favcolor" />

		<hr class="bg-d-gray-300 h-[1px] border-none w-full my-3" />

		<div class="grid grid-cols-6 grid-flow-row gap-1 mb-3">
			<button
				onclick={() => editor.chain().focus().unsetColor().run()}
				title="Cor automática"
				aria-label="Cor automática"
				type="button"
				class="text-opt bg-transparent ring-inset ring-2 ring-white"
			></button>

			{#each presetPallete as [name, hex] (hex)}
				<button
					onclick={() => (selectedColor = hex)}
					type="button"
					title={`Selecionar ${name}`}
					aria-label={`Selecionar ${name}`}
					style="background: {hex};"
					data-state={editor.isActive("textStyle", { color: hex }) ? "active" : "deactive"}
					class="text-opt"
				></button>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>

<style lang="postcss">
	.text-opt {
		@apply aspect-square rounded-md transition-all data-[state=active]:scale-90 data-[state=active]:brightness-90;
	}
</style>
