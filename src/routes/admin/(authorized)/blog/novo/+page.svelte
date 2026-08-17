<script lang="ts">
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import FloatingSelect from "$crate/components/floating-select/index.js";
	import Editor from "$crate/ui/tiptap/editor.svelte";
	import type { NewBlogPostPageLoadData, PublishPostResponse } from "../handlers.js";
	import PreviewDialog from "./preview-dialog.svelte";
	import type { SelectOption } from "$crate/components/floating-select/group.svelte";
	import meta from "$crate/components/meta/index.js";

	type Props = {
		data: NewBlogPostPageLoadData;
		form: PublishPostResponse;
	};

	const { data, form }: Props = $props();

	const availableTags: SelectOption[] = $derived.by(() => {
		if (!data.tags.success) return [];
		return data.tags.data.tags.map((tag) => ({ value: tag.id, label: tag.value }));
	});

	let selectedTagsIds: string[] = $state([]);

	let formIsLoading = $state(false);
	let htmlContent: string = $state("");
</script>

<meta.Root>
	<meta.Title title="Novo post" adminRoute />
</meta.Root>

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
		formData.set("content", htmlContent);
		formData.set("tags", JSON.stringify(selectedTagsIds));

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
		{#each form.error.data.fieldErrors.description ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
	<FloatingGroup class="mb-3">
		<FloatingInput class="w-full" name="description" placeholder="Preview/Descrição" type="text" />
		<FloatingLabel>Preview/Descrição</FloatingLabel>
	</FloatingGroup>

	{#if form && !form.success && !form.internalError && form.error.validation}
		{#each form.error.data.fieldErrors.tags ?? [] as error}
			<span class="alert danger mb-2 mt-4 sm">{error}</span>
		{/each}
	{/if}
	{#if data.tags.success && availableTags.length > 0}
		<FloatingSelect name="tags" multiple bind:value={selectedTagsIds} options={availableTags} placeholder="Tags" />
	{:else if !data.tags.success}
		<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
			{data.tags.internalError ? "Não foi possível carregar as tags existentes." : data.tags.error}
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
