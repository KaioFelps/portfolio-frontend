<script lang="ts">
	import "katex/dist/katex.min.css";

	import { onMount, onDestroy } from "svelte";
	import clsx from "clsx";
	import EditorButton from "./editor-button.svelte";
	import EditorSet from "./editor-set.svelte";
	import ColorPicker from "./color-picker.svelte";

	import { handlePasteImageWithOrigin } from "$crate/lib/tiptap/paste-img";
	import { Editor } from "@tiptap/core";

	import Link from "@tiptap/extension-link";
	import Image from "$crate/lib/tiptap/image";
	import Color from "@tiptap/extension-color";
	import Indent from "$crate/lib/tiptap/indent";
	import FontSize from "$lib/tiptap/font-size";
	import Subscript from "@tiptap/extension-subscript";
	import Underline from "@tiptap/extension-underline";
	import TextStyle from "@tiptap/extension-text-style";
	import TextAlign from "$lib/tiptap/text-align";
	import StarterKit from "@tiptap/starter-kit";
	import Superscript from "@tiptap/extension-superscript";
	import Mathematics from "@aarkue/tiptap-math-extension";
	import CodeBlockIndent from "$crate/lib/tiptap/indent-code-block";

	import Code from "phosphor-svelte/lib/Code";
	import Minus from "phosphor-svelte/lib/Minus";
	import Broom from "phosphor-svelte/lib/Broom";
	import Quotes from "phosphor-svelte/lib/Quotes";
	import TextBold from "phosphor-svelte/lib/TextB";
	import TextStrike from "phosphor-svelte/lib/TextStrikethrough";
	import TextItalic from "phosphor-svelte/lib/TextItalic";
	import ListBullets from "phosphor-svelte/lib/ListBullets";
	import ListNumbers from "phosphor-svelte/lib/ListNumbers";
	import TextUnderline from "phosphor-svelte/lib/TextUnderline";
	import TextAlignLeft from "phosphor-svelte/lib/TextAlignLeft";
	import TextSubscript from "phosphor-svelte/lib/TextSubscript";
	import TextAlignRight from "phosphor-svelte/lib/TextAlignRight";
	import TextSuperscript from "phosphor-svelte/lib/TextSuperscript";
	import TextAlignCenter from "phosphor-svelte/lib/TextAlignCenter";
	import TextAlignJustify from "phosphor-svelte/lib/TextAlignJustify";
	import HyperlinkDialog from "./hyperlink-dialog.svelte";
	import HardBreak from "@tiptap/extension-hard-break";

	let element: Element;
	let editor: Editor;
	let isDisplayingSourceCode = false;

	export let htmlContent: string;
	const updateHtmlContent = (content: string) => (htmlContent = content);

	// FALTAM:
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
				StarterKit.configure({ hardBreak: false }),
				HardBreak.extend({
					renderText() {
						return "\n";
					},
				}),
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
				Mathematics,
				Link.configure({
					defaultProtocol: "https",
					protocols: ["http", "https"],
				}),
			],
			content: "<p>Olá, plantas! 🪴</p>",
			onTransaction: () => {
				editor = editor; // force re-render so `editor.isActive` works as expected
			},
			async onPaste(_event) {
				await handlePasteImageWithOrigin(editor);
			},

			onCreate({ editor }) {
				updateHtmlContent(editor.getHTML());
			},

			onUpdate({ editor }) {
				updateHtmlContent(editor.getHTML());
			},
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});

	function handleToggleSourceCode() {
		if (!isDisplayingSourceCode) {
			const htmlContent = editor
				.getHTML()
				.replaceAll("\n", "<br>")
				.replaceAll("&", "&amp;")
				.replaceAll("\t", "\\t");
			editor.commands.setContent(`<textarea>${htmlContent}</textarea>`, true, {
				preserveWhitespace: true,
			});
		} else {
			editor.commands.setContent(editor.getText().replaceAll("\\t", "\t"));
		}

		isDisplayingSourceCode = !isDisplayingSourceCode;
		updateHtmlContent(editor.getHTML());
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
				onclick={() => editor.chain().focus().toggleBold().run()}
			>
				<TextBold weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Itálico"
				active={editor.isActive("italic")}
				onclick={() => editor.chain().focus().toggleItalic().run()}
			>
				<TextItalic weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Underline"
				active={editor.isActive("underline")}
				onclick={() => editor.chain().focus().toggleUnderline().run()}
			>
				<TextUnderline weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Riscar"
				active={editor.isActive("strike")}
				onclick={() => editor.chain().focus().toggleStrike().run()}
			>
				<TextStrike weight="bold" size="20" />
			</EditorButton>

			<ColorPicker {editor} />
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
				onclick={() => editor.chain().focus().toggleTextAlign("left").run()}
			>
				<TextAlignLeft weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Alinhar ao centro"
				active={editor.isActive({ textAlign: "center" })}
				onclick={() => editor.chain().focus().toggleTextAlign("center").run()}
			>
				<TextAlignCenter weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Alinhar à direita"
				active={editor.isActive({ textAlign: "right" })}
				onclick={() => editor.chain().focus().toggleTextAlign("right").run()}
			>
				<TextAlignRight weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Justificar"
				active={editor.isActive({ textAlign: "justify" })}
				onclick={() => editor.chain().focus().toggleTextAlign("justify").run()}
			>
				<TextAlignJustify weight="bold" size="20" />
			</EditorButton>
		</div>

		<div class="group-set">
			<EditorButton
				title="Linha Horizontal"
				active={editor.isActive("horizontalRule")}
				onclick={() => editor.chain().focus().setHorizontalRule().run()}
			>
				<Minus weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Quote"
				active={editor.isActive("blockquote")}
				onclick={() => editor.chain().focus().toggleBlockquote().run()}
			>
				<Quotes weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Super-escrita"
				active={editor.isActive("superscript")}
				onclick={() => editor.chain().focus().toggleSuperscript().run()}
			>
				<TextSuperscript weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				title="Sub-escrita"
				active={editor.isActive("subscript")}
				onclick={() => editor.chain().focus().toggleSubscript().run()}
			>
				<TextSubscript weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				active={editor.isActive("bulletList")}
				title="Lista"
				onclick={() => {
					editor.chain().focus().toggleBulletList().run();
				}}
			>
				<ListBullets weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				active={editor.isActive("orderedList")}
				title="Lista Enumerada"
				onclick={() => {
					editor.chain().focus().toggleOrderedList().run();
				}}
			>
				<ListNumbers weight="bold" size="20" />
			</EditorButton>

			<HyperlinkDialog {editor} />
		</div>

		<div class="group-set">
			<EditorButton
				active={isDisplayingSourceCode}
				title="Código Fonte"
				onclick={handleToggleSourceCode}
			>
				<Code weight="bold" size="20" />
			</EditorButton>

			<EditorButton
				active={false}
				title="Limpar Formatação"
				onclick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
			>
				<Broom weight="bold" size="20" />
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
></div>

<style lang="postcss">
	.group-set {
		@apply flex flex-row items-center gap-1;
	}
</style>
