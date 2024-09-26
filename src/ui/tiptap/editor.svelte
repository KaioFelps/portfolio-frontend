<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import clsx from "clsx";
	import EditorButton from "./editorButton.svelte";
	import EditorSet from "./editorSet.svelte";

	import { handlePasteImageWithOrigin } from "$crate/lib/tiptap/paste-img";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Underline from "@tiptap/extension-underline";
	import TextStyle from "@tiptap/extension-text-style";
	import TextAlign from "$lib/tiptap/text-align";
	import FontSize from "$lib/tiptap/font-size";
	import Image from "@tiptap/extension-image";
	import Color from "@tiptap/extension-color";

	import TextBold from "phosphor-svelte/lib/TextB";
	import TextItalic from "phosphor-svelte/lib/TextItalic";
	import TextUnderline from "phosphor-svelte/lib/TextUnderline";
	import TextStrike from "phosphor-svelte/lib/TextStrikethrough";
	import TextAlignLeft from "phosphor-svelte/lib/TextAlignLeft";
	import TextAlignCenter from "phosphor-svelte/lib/TextAlignCenter";
	import TextAlignRight from "phosphor-svelte/lib/TextAlignRight";
	import TextAlignJustify from "phosphor-svelte/lib/TextAlignJustify";
	import ColorPicker from "./colorPicker.svelte";

	let element: Element;
	let editor: Editor;

	// FALTAM:
	// linha horizontal
	// quote
	// linha de código
	// bloco de código
	// código fonte
	// subscrito
	// sobrescrito
	// copiar formatação
	// apagar formatação
	// lista sem número
	// lista com número
	// diminuir/aumentar recuo
	// inserir link
	// modal pra adicionar/modificar imagem
	// tabelas

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [StarterKit, Underline, TextStyle, FontSize, Image, TextAlign, Color],
			content: "<p>Olá, plantas! 🪴</p>",
			onTransaction: () => {
				editor = editor; // force re-render so `editor.isActive` works as expected
			},
			async onPaste(event) {
				await handlePasteImageWithOrigin(editor);
			},
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});
</script>

{#if editor}
	<div
		id="editor-bar"
		class="p-2 bg-d-gray-200 border-y border-white/5 flex flex-row flex-wrap gap-2 rounded-lg mb-4 shadow-md shadow-black/30"
	>
		<EditorSet
			title="Formatar"
			options={[
				{
					active: editor.isActive("heading", { level: 1 }),
					handler: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
					title: "H1",
				},
				{
					active: editor.isActive("heading", { level: 2 }),
					handler: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
					title: "H2",
				},
				{
					active: editor.isActive("heading", { level: 3 }),
					handler: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
					title: "H3",
				},
				{
					active: editor.isActive("heading", { level: 4 }),
					handler: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
					title: "H4",
				},
				{
					active: editor.isActive("paragraph"),
					handler: () => editor.chain().focus().setParagraph().run(),
					title: "Parágrafo",
				},
			]}
		/>

		<div class="group-set">
			<EditorButton
				title="Negrito"
				active={editor.isActive("bold")}
				on:click={() => editor.chain().focus().toggleBold().run()}
				class="text-white"
			>
				<TextBold weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Itálico"
				active={editor.isActive("italic")}
				on:click={() => editor.chain().focus().toggleItalic().run()}
				class="text-white"
			>
				<TextItalic weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Underline"
				active={editor.isActive("underline")}
				on:click={() => editor.chain().focus().toggleUnderline().run()}
				class="text-white"
			>
				<TextUnderline weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Riscar"
				active={editor.isActive("strike")}
				on:click={() => editor.chain().focus().toggleStrike().run()}
				class="text-white"
			>
				<TextStrike weight="bold" size="20" />
			</EditorButton>
		</div>

		<EditorSet
			title="Tamanho"
			options={[false, 11, 12, 14, 16, 18, 20, 32, 40, 48, 56, 70].map((size) => {
				if (size === false)
					return {
						active: false,
						handler: () => editor.chain().focus().unsetFontSize().run(),
						title: "Restaurar",
					};

				const fontSize = size + "px";

				return {
					active: editor.isActive("textStyle", { fontSize }),
					handler: () => editor.chain().focus().setFontSize(fontSize).run(),
					title: fontSize,
				};
			})}
		/>

		<div class="group-set">
			<EditorButton
				title="Alinhar à esquerda"
				active={editor.isActive({ textAlign: "left" })}
				on:click={() => editor.chain().focus().toggleTextAlign("left").run()}
				class="text-white"
			>
				<TextAlignLeft weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Alinhar ao centro"
				active={editor.isActive({ textAlign: "center" })}
				on:click={() => editor.chain().focus().toggleTextAlign("center").run()}
				class="text-white"
			>
				<TextAlignCenter weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Alinhar à direita"
				active={editor.isActive({ textAlign: "right" })}
				on:click={() => editor.chain().focus().toggleTextAlign("right").run()}
				class="text-white"
			>
				<TextAlignRight weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Justificar"
				active={editor.isActive({ textAlign: "justify" })}
				on:click={() => editor.chain().focus().toggleTextAlign("justify").run()}
				class="text-white"
			>
				<TextAlignJustify weight="bold" size="20" />
			</EditorButton>
		</div>

		<ColorPicker {editor} />
	</div>
{/if}

<div
	class={clsx(
		"p-6 rounded-xl bg-d-backgrond/25 shadow-d-gray-300 shadow-[inset_0_0_0_1px_var(--tw-shadow)]",
		"[&>*]:focus-within:outline-none",
	)}
	bind:this={element}
/>

<style lang="postcss">
	.group-set {
		@apply flex flex-row items-center gap-1;
	}
</style>
