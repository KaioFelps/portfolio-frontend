import type { Editor } from "@tiptap/core";

async function pasteClipboardImageAsNode() {
	try {
		const cbContents = await navigator.clipboard.read();
		const lastCbTypes = cbContents[0].types;

		if (!(lastCbTypes[0] === "text/html" && lastCbTypes[1].startsWith("image/"))) return;

		const blob = await cbContents[0].getType("text/html");
		const imgNode = await blob.text();
		return imgNode;
	} catch (error) {}
}

export async function handlePasteImageWithOrigin(editor?: Editor) {
	if (!editor) return;

	const imgElement = await pasteClipboardImageAsNode();

	if (!imgElement) return;

	const template = document.createElement("div");
	template.innerHTML = imgElement;

	let src = template.querySelector("img")!.src;

	editor.chain().focus().setImage({ src });
}
