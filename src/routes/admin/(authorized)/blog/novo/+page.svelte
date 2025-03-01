<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import FloatingSelect from "$crate/components/floating-select/index.js";
	import Editor from "$crate/ui/tiptap/editor.svelte";
	import type { Selected } from "bits-ui";
	import type { PageLoadData, PublishPostResponse } from "../handlers.js";
	import Title from "$crate/components/title.svelte";
	import PreviewDialog from "./preview-dialog.svelte";

	export let form: PublishPostResponse;
	export let data: PageLoadData;

	$: tagsData = data.tags;

	let selectedTags: Array<Selected<string>> = [];
	let formIsLoading = false;
	let htmlContent: string;
</script>

<Title title="Novo post" />

<h1 class="mb-12">Nova publicação</h1>

<h3 class="text-xl font-bold mb-3">Detalhes</h3>

{#if form && form.success}
	<span class="success alert mb-3 py-2">Post publicado com sucesso! </span>
{:else if form && !form.success && !form.internalError && !form.error.validation && Array.isArray(form.error.data)}
	{#each form.error.data as error}
		<span class="danger alert mb-3 py-2">{error}</span>
	{/each}
{:else if form && !form.success && (form.internalError || !form.error.validation)}
	<span class="danger alert mb-3 py-2">
		{form.internalError ? "Algo deu errado enquanto enviávamos o formuláriro." : form.error.data}
	</span>
{/if}

<form
	id="publish"
	class="mb-12"
	method="post"
	action="?/publish"
	use:enhance={({ formData }) => {
		formData.set("tags", JSON.stringify(selectedTags.map((selected) => selected.value)));
		formData.set("content", htmlContent);

		formIsLoading = true;

		return async ({ update }) => {
			formIsLoading = false;
			await update();
		};
	}}
>
	{#if form && !form.success && !form.internalError && form.error.validation}
		{#each form.error.data.fieldErrors.title ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="title" placeholder="Título do post" type="text" />
		<FloatingLabel>Título</FloatingLabel>
	</FloatingGroup>

	{#if form && !form.success && !form.internalError && form.error.validation}
		{#each form.error.data.fieldErrors.tags ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
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

	{#if form && !form.success && !form.internalError && form.error.validation}
		{#each form.error.data.fieldErrors.topstory ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="topstory" placeholder="i.imgur.com/..." type="text" />
		<FloatingLabel>Imagem de capa</FloatingLabel>
	</FloatingGroup>
</form>

<h3 class="text-xl font-bold mb-3">Editor</h3>

{#if form && !form.success && !form.internalError && form.error.validation}
	{#each form.error.data.fieldErrors.content ?? [] as error}
		<span class="alert danger mb-2 mt-4 sm">{error}</span>
	{/each}
{/if}
<Editor bind:htmlContent />

<div class="flex gap-2 mt-4">
	<a href="/admin/blog" class="btn ghost">Cancelar</a>
	<PreviewDialog html={htmlContent} />
	<button form="publish" type="submit" disabled={formIsLoading} class="btn default">
		{formIsLoading ? "Postando" : "Postar"} publicação
	</button>
</div>
