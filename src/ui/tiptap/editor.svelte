<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import clsx from "clsx";
	import EditorButton from "./editorButton.svelte";
	import EditorSet from "./editorSet.svelte";
	import ColorPicker from "./colorPicker.svelte";

	import { handlePasteImageWithOrigin } from "$crate/lib/tiptap/paste-img";
	import { Editor } from "@tiptap/core";
	import StarterKit from "@tiptap/starter-kit";
	import Underline from "@tiptap/extension-underline";
	import TextStyle from "@tiptap/extension-text-style";
	import TextAlign from "$lib/tiptap/text-align";
	import FontSize from "$lib/tiptap/font-size";
	import Image from "./image";
	import Color from "@tiptap/extension-color";
	import Indent from "./indent";
	import CodeBlockIndent from "./indentCodeBlock";
	import Subscript from "@tiptap/extension-subscript";
	import Superscript from "@tiptap/extension-superscript";

	import Code from "phosphor-svelte/lib/Code";
	import Minus from "phosphor-svelte/lib/Minus";
	import Quotes from "phosphor-svelte/lib/Quotes";
	import TextBold from "phosphor-svelte/lib/TextB";
	import TextStrike from "phosphor-svelte/lib/TextStrikethrough";
	import TextItalic from "phosphor-svelte/lib/TextItalic";
	import TextUnderline from "phosphor-svelte/lib/TextUnderline";
	import TextAlignLeft from "phosphor-svelte/lib/TextAlignLeft";
	import TextSubscript from "phosphor-svelte/lib/TextSubscript";
	import TextAlignRight from "phosphor-svelte/lib/TextAlignRight";
	import TextSuperscript from "phosphor-svelte/lib/TextSuperscript";
	import TextAlignCenter from "phosphor-svelte/lib/TextAlignCenter";
	import TextAlignJustify from "phosphor-svelte/lib/TextAlignJustify";

	let element: Element;
	let editor: Editor;
	let isDisplayingSourceCode = false;

	// FALTAM:
	// copiar formatação
	// apagar formatação
	// lista sem número
	// lista com número
	// inserir link
	// modal pra adicionar/modificar imagem
	// tabelas

	onMount(() => {
		editor = new Editor({
			element,
			editorProps: {
				attributes: {
					class: "text-container",
				},
			},
			extensions: [
				StarterKit,
				Underline,
				TextStyle,
				FontSize,
				Image,
				TextAlign,
				Color,
				CodeBlockIndent,
				Indent,
				Subscript,
				Superscript,
			],
			content: "<p>Olá, plantas! 🪴</p>",
			onTransaction: () => {
				editor = editor; // force re-render so `editor.isActive` works as expected
			},
			async onPaste(_event) {
				await handlePasteImageWithOrigin(editor);
			},
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});

	function handleToggleSourceCode() {
		console.log(editor.getText());

		if (!isDisplayingSourceCode) {
			editor.commands.setContent(`<textarea>${editor.getHTML()}</textarea>`);
		} else {
			editor.commands.setContent(editor.getText(), true);
		}

		isDisplayingSourceCode = !isDisplayingSourceCode;
	}
</script>

{#if editor}
	<div
		id="editor-bar"
		class={clsx(
			"p-2 bg-d-gray-200 border-y border-white/5 flex flex-row flex-wrap gap-2 rounded-lg mb-4 shadow-md shadow-black/30",
			"sticky top-0 z-10",
		)}
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
					active: editor.isActive("heading", { level: 5 }),
					handler: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
					title: "H5",
				},
				{
					active: editor.isActive("heading", { level: 6 }),
					handler: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
					title: "H6",
				},
				{
					active: editor.isActive("code"),
					handler: () => editor.chain().focus().toggleCode().run(),
					title: "Linha de código",
				},
				{
					active: editor.isActive("codeBlock"),
					handler: () => editor.chain().focus().toggleCodeBlock().run(),
					title: "Bloco de código",
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

		<div class="group-set">
			<EditorButton
				title="Linha Horizontal"
				active={editor.isActive("horizontalRule")}
				on:click={() => editor.chain().focus().setHorizontalRule().run()}
				class="text-white"
			>
				<Minus weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Quote"
				active={editor.isActive("blockquote")}
				on:click={() => editor.chain().focus().toggleBlockquote().run()}
				class="text-white"
			>
				<Quotes weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Super-escrita"
				active={editor.isActive("superscript")}
				on:click={() => editor.chain().focus().toggleSuperscript().run()}
			>
				<TextSubscript weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Sub-escrita"
				active={editor.isActive("subscript")}
				on:click={() => editor.chain().focus().toggleSubscript().run()}
			>
				<TextSubscript weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				active={isDisplayingSourceCode}
				title="Código Fonte"
				on:click={handleToggleSourceCode}
			>
				<Code weight="bold" size="20" />
			</EditorButton>
		</div>
	</div>
{/if}

<div
	class={clsx(
		"dark p-6 rounded-xl bg-d-backgrond/25 shadow-d-gray-300 shadow-[inset_0_0_0_1px_var(--tw-shadow)]",
		"overscroll-y-auto overflow-x-hidden resize-y",
		"[&>*]:focus-within:outline-none",
	)}
	bind:this={element}
/>

<style lang="postcss">
	.group-set {
		@apply flex flex-row items-center gap-1;
	}
</style>
