<script lang="ts">
	import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
	import { enhance } from "$app/forms";
	import { FloatingGroup, FloatingInput, FloatingLabel } from "$crate/components/floating-input";
	import FloatingSelect from "$crate/components/floating-select";
	import Trash from "phosphor-svelte/lib/Trash";
	import { goto } from "$app/navigation";
	import Title from "$crate/components/title.svelte";
	import type { EditProjectResponse, AdminEditProjectPageData } from "./+page.server";
	import type { SelectOption } from "$crate/components/floating-select/group.svelte";
	const {
		data,
		form,
	}: {
		data: AdminEditProjectPageData;
		form: EditProjectResponse | undefined;
	} = $props();

	let initialInputValues = $state({
		title: "",
		topstory: "",
	});

	// this prevents sveltekit to reset these inputs values
	// back to the default values (project current values)
	// on the page rerender after form action dispatch
	$effect(() => {
		if (
			data.project.success &&
			data.project.data &&
			!initialInputValues.title &&
			!initialInputValues.topstory
		) {
			initialInputValues = {
				title: data.project.data.title,
				topstory: data.project.data.topstory,
			};
		}
	});

	$effect(() => {
		if (form?.success)
			setTimeout(() => {
				goto("/admin/projetos");
			}, 1000);
	});

	let formIsLoading = $state(false);
	let subFormElement: HTMLFormElement | undefined = $state();
	let selectedTagIds: string[] = $state([]);
	let availableTags: SelectOption[] = $state([]);
	let links: Array<{ title: string; value: string }> = $state([]);

	$effect(() => {
		if (data.tags.success)
			availableTags = data.tags.data.tags.map((tag) => ({ label: tag.value, value: tag.id }));

		if (data.project.success && data.project.data) {
			selectedTagIds = data.project.data.tags.map((tag) => tag.id);
			links = data.project.data.links;
		}
	});

	function handleAddLink(link: { title: string; value: string }) {
		links = [...links, link];
	}

	function handleRemoveLink(link: { title: string; value: string }) {
		links = links.filter((item) => item.value !== link.value);
	}

	function handleAddLinkFormSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		},
	) {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget)) as {
			title: string;
			value: string;
		};

		if (!data.title || !data.value) return;

		const link = {
			title: data.title.trim(),
			value: data.value.trim(),
		};

		handleAddLink(link);

		e.currentTarget.reset();
	}
</script>

{#if data.project.success && data.project.data}
	<Title title={`Editando Projeto ${data.project.data.title}`} adminRoute />
	<h1 class="mb-6">Editar projeto: {data.project.data.title}</h1>

	{#if form?.success}
		<span class="alert success py-2 mb-6">Projeto atualizado com sucesso!</span>
	{/if}
	<form
		id="main-form"
		method="post"
		action="?/save"
		use:enhance={({ formData }) => {
			if (!data.project.success || !data.project.data) return;

			const oldProject = data.project.data;
			const selectedTagsValues = availableTags
				.filter((tag) => selectedTagIds.includes(tag.value))
				.map((tag) => tag.label);

			const areSameTags = oldProject.tags.every((tag) => selectedTagsValues.includes(tag.value));
			if (!areSameTags) formData.set("tags", JSON.stringify(selectedTagsValues));

			// comparison is made with json stringify to allow recreating links in order
			// to reorder them
			const areSameLinks = JSON.stringify(links) === JSON.stringify(oldProject.links);
			if (!areSameLinks) formData.set("links", JSON.stringify(links));

			if (formData.get("title") === data.project.data.title) formData.delete("title");
			if (formData.get("topstory") === data.project.data.topstory) formData.delete("topstory");

			formIsLoading = true;

			return async ({ update }) => {
				formIsLoading = false;
				await update({ reset: false });
			};
		}}
	></form>

	<form id="links-form" bind:this={subFormElement} onsubmit={handleAddLinkFormSubmit}></form>
	<div>
		{#if !form?.success && form?.isValidationError}
			{#each form.zod?.fieldErrors.title ?? [] as error}
				<span class="alert danger mb-2 mt-4 sm">{error}</span>
			{/each}
		{/if}

		<input hidden type="hidden" name="_id" value={data.project.data.id} />

		<FloatingGroup class="mb-3">
			<FloatingInput
				form="main-form"
				class="w-full"
				name="title"
				placeholder="Nome do projeto"
				type="text"
				value={initialInputValues.title}
			/>
			<FloatingLabel>Nome do projeto</FloatingLabel>
		</FloatingGroup>
		{#if !form?.success && form?.isValidationError}
			{#each form.zod?.fieldErrors.topstory ?? [] as error}
				<span class="alert danger mb-2 mt-4 sm">{error}</span>
			{/each}
		{/if}
		<FloatingGroup class="mb-3">
			<FloatingInput
				form="main-form"
				class="w-full"
				name="topstory"
				placeholder="i.imgur.com"
				type="text"
				value={initialInputValues.topstory}
			/>
			<FloatingLabel>Imagem de capa</FloatingLabel>
		</FloatingGroup>

		{#if !data.tags.success}
			<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
				{data.tags.internalError ? "Erro interno" : data.tags.error}
			</span>
		{:else if data.tags.data.tags.length > 0}
			{#if !form?.success && form?.isValidationError}
				{#each form.zod?.fieldErrors.tags ?? [] as error}
					<span class="alert danger mb-2 mt-4 sm">{error}</span>
				{/each}
			{/if}
			<FloatingSelect
				bind:value={selectedTagIds}
				multiple
				options={availableTags}
				placeholder="Tags"
			/>
		{:else}
			<span class="mx-auto warning alert text-center w-full mb-3 inline-block">
				Ainda não há tags registradas. Você precisará <a class="font-bold" href="/admin/tags/novo">
					criar uma tag
				</a> antes!
			</span>
		{/if}
		<div class="p-6 rounded-xl bg-d-backgrond/25">
			<h3 class="text-xl font-bold mb-6">Links referente ao projeto</h3>

			{#if !form?.success && form?.isValidationError}
				{#each form.zod?.fieldErrors.links ?? [] as error}
					<span class="alert danger mb-2 mt-4 sm">{error}</span>
				{/each}
			{/if}

			<FloatingGroup class="mb-3">
				<FloatingInput
					form="links-form"
					class="w-full"
					placeholder="https://www.kaiofelps.dev, ..."
					type="text"
					name="title"
				/>
				<FloatingLabel>Título do link</FloatingLabel>
			</FloatingGroup>

			<FloatingGroup class="mb-3">
				<FloatingInput
					form="links-form"
					class="w-full"
					name="value"
					placeholder="https://www.kaiofelps.dev, ..."
				/>
				<FloatingLabel>URL do link</FloatingLabel>
			</FloatingGroup>

			<button form="links-form" class="btn ghost mb-3">Adicionar</button>

			{#if links.length > 0}
				<div class="flex flex-col gap-0.5">
					{#each links as link (link.value)}
						<div
							class="flex gap-3 justify-between w-full p-1.5 pl-3 rounded-xl bg-d-gray-300/10 hover:bg-d-gray-300/15"
						>
							<span class="font-medium">
								{link.title}: <a class="text-blue-500" href={link.value}>{link.value}</a>
							</span>
							<button
								type="button"
								onclick={() => handleRemoveLink(link)}
								class="text-white p-1 rounded-md cursor-default bg-white/5 hover:bg-white/10 active:bg-white/15"
							>
								<Trash size="16" weight="bold" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex gap-2 mt-4">
			<a href="/admin/projetos" class="btn ghost">Cancelar</a>
			<button
				form="main-form"
				type="submit"
				disabled={formIsLoading || !data.tags.success || !(data.tags.data.tags.length > 0)}
				class="btn default"
			>
				{formIsLoading ? "Salvando" : "Salvar"} projeto
			</button>
		</div>
	</div>
{:else if data.project.success}
	<Title title="Projeto Não Encontrado" adminRoute />

	<h1>Projeto não encontrado</h1>
	<a href="/admin/projetos" class="btn ghost mt-3"><ArrowLeft size="20" weight="bold" /> Voltar</a>
{:else}
	<span class="danger alert mb-3 py-2 flex w-full justify-between">
		Não foi possível carregar o post.
	</span>
	<a href="/admin/projetos" class="btn ghost"> <ArrowLeft size="20" weight="bold" /> Voltar</a>
{/if}
