<script lang="ts">
	import type { Editor } from "@tiptap/core";
	import { flyAndScale } from "$crate/utils";
	import { Popover } from "bits-ui";
	import colors from "tailwindcss/colors";
	import { debounce } from "$crate/lib/debounce";
	import EditorButton from "./editorButton.svelte";
	import { PaintBrush } from "phosphor-svelte";

	type PressetColor = [string, string];
	let open = false;
	export let editor: Editor;

	const presetPallete: PressetColor[] = [
		["white", "#ffffff"],
		["black", "#000000"],
		["Purple", colors.purple["500"]],
		["Yellow", colors.yellow["500"]],
		["Blue", colors.blue["500"]],
		["Gray", colors.gray["600"]],
	] as const;

	let selectedColor: string | undefined = editor.getAttributes("textStyle").color;

	let debouncedHandler = debounce(() => {
		editor.chain().focus().setColor(selectedColor!).run();
	}, 200);

	$: if (selectedColor) debouncedHandler();

	const handleColorPickOpen = () =>
		(selectedColor = editor.getAttributes("textStyle").color ?? "#ffffff");
</script>

<Popover.Root bind:open onOpenChange={handleColorPickOpen}>
	<Popover.Trigger asChild let:builder>
		<EditorButton active={false} {builder}>
			<PaintBrush width="20" weight="bold" />
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
				on:click={() => editor.chain().focus().unsetColor().run()}
				title="Cor automática"
				type="button"
				class="text-opt bg-transparent ring-inset ring-2 ring-white"
			/>

			{#each presetPallete as [name, hex] (hex)}
				<button
					on:click={() => (selectedColor = hex)}
					type="button"
					title={`Selecionar ${name}`}
					style="background: {hex};"
					data-state={editor.isActive("textStyle", { color: hex }) ? "active" : "deactive"}
					class="text-opt"
				/>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>

<style lang="postcss">
	.text-opt {
		@apply aspect-square rounded-md transition-all data-[state=active]:scale-90 data-[state=active]:brightness-90;
	}
</style>
