<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import Editor from "$crate/ui/tiptap/editor.svelte";

	export let form;

	let formIsLoading = false;
</script>

<h1 class="mb-12">Nova publicação</h1>

<h3 class="text-xl font-bold mb-3">Detalhes</h3>
<form
	class="mb-12"
	method="post"
	action="?/publish"
	use:enhance={({ formData }) => {
		formIsLoading = true;

		return async ({ update }) => {
			formIsLoading = false;
			await update();
		};
	}}
>
	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="title" placeholder="Título do post" type="text" />
		<FloatingLabel>Título</FloatingLabel>
	</FloatingGroup>

	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="description" placeholder="Descrição do post" type="text" />
		<FloatingLabel>Descrição</FloatingLabel>
	</FloatingGroup>

	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="topstory" placeholder="i.imgur.com/..." type="text" />
		<FloatingLabel>Imagem de capa</FloatingLabel>
	</FloatingGroup>
</form>

<h3 class="text-xl font-bold mb-3">Editor</h3>

<Editor />

<div class="flex gap-2 mt-4">
	<a href="/admin/projetos" class="btn ghost">Cancelar</a>
	<button type="submit" disabled={formIsLoading} class="btn default">
		{formIsLoading ? "Publicando" : "Publicar"} projeto
	</button>
</div>
