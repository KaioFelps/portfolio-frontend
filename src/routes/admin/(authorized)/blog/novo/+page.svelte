<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import FloatingSelect from "$crate/components/floating-select/index.js";
	import Editor from "$crate/ui/tiptap/editor.svelte";
	import type { Selected } from "bits-ui";
	import type { PageLoadData } from "../handlers.js";
	import Title from "$crate/components/title.svelte";

	export let form;
	export let data: PageLoadData;

	$: tagsData = data.tags;

	let selectedTags: Array<Selected<string>> = [];
	let formIsLoading = false;
</script>

<Title title="Novo post" />

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
		<FloatingLabel>Linha fina</FloatingLabel>
	</FloatingGroup>

	{#if tagsData.success && tagsData.data.tags.length > 0}
		<FloatingSelect
			bind:values={selectedTags}
			multiple
			options={tagsData.data.tags.map(({ id, value }) => ({ value: id, label: value }))}
			placeholder="Tags"
		/>
	{:else if !tagsData.success}
		<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
			{tagsData.internalError ? "Não foi possível carregar as tags existentes." : tagsData.error}
		</span>
	{:else}
		<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
			Ainda não há tags registradas. Você precisará <a class="font-bold" href="/admin/tags/novo">
				criar uma tag
			</a> antes!
		</span>
	{/if}

	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="topstory" placeholder="i.imgur.com/..." type="text" />
		<FloatingLabel>Imagem de capa</FloatingLabel>
	</FloatingGroup>
</form>

<h3 class="text-xl font-bold mb-3">Editor</h3>

<Editor />

<div class="flex gap-2 mt-4">
	<a href="/admin/blog" class="btn ghost">Cancelar</a>
	<button type="submit" disabled={formIsLoading} class="btn default">
		{formIsLoading ? "Postando" : "Postar"} publicação
	</button>
</div>
