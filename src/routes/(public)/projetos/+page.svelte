<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import CaretUp from "phosphor-svelte/lib/CaretUp";
	import { fly } from "svelte/transition";
	import type { FetchProjectsData } from "./proxy+page.server.js";
	import type { ActionData } from "./$types";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import LinksPopover from "./linksPopover.svelte";
	import clsx from "clsx";
	import { enhance } from "$app/forms";
	import Title from "$crate/components/title.svelte";
	import { Select, type Selected } from "bits-ui";
	import { flyAndScale } from "$crate/utils.js";
	import type { Project } from "$crate/core/entities/project.js";

	export let data: FetchProjectsData;
	export let form: ActionData;

	let formIsLoading = false;
	$: formError = !form?.success;

	let projectsUnion: Project[] = [];

	$: projectsUnion = data.success ? data.data.projects : [];
	$: if (form?.success) projectsUnion = [...projectsUnion, ...form.data.projects];

	let queryFormTimeoutId: NodeJS.Timeout | undefined = undefined;
	let query: string = $page.url.searchParams.get("q") ?? "";

	const queryByOptions = [
		{ value: "title", label: "Buscar por título" },
		{ value: "tag", label: "Buscar por tag" },
	];

	let queryBy: Selected<string> =
		queryByOptions.find((opt) => opt.value === $page.url.searchParams.get("qb")) ??
		queryByOptions[0];

	function handleQueryProjects() {
		clearTimeout(queryFormTimeoutId);

		const timeout = setTimeout(() => {
			if (query.trim() === "") return goto($page.url.pathname);
			goto(`?q=${query}&qb=${queryBy!.value}`);
		}, 1500);

		queryFormTimeoutId = timeout;
	}
</script>

<svelte:head>
	<Title title="Projetos" />
</svelte:head>

<main
	class="flex-1 w-[calc(100%_-_24px)] max-w-screen-mainExpanded mx-auto flex flex-col items-center justify-center"
>
	<header
		class="
		w-full max-w-screen-mainExpanded px-[46px] pb-6 border-b border-gray-300 dark:border-d-gray-300
        flex items-center gap-4 justify-between
		max-md:flex-col max-md:gap-9 max-md:items-start max-md:px-0
        "
	>
		<h1 class="text-5xl font-bold">Projetos realizados</h1>

		<form
			on:submit|preventDefault={handleQueryProjects}
			class="flex flex-row gap-4 items-center justify-end max-sm:hidden"
		>
			<label class="flex gap-3 input">
				<span>
					<MagnifyingGlass size="32" weight="regular" />
				</span>
				<span class="sr-only">Filtro</span>
				<input
					name="query"
					placeholder="Filtro"
					class="input-inner"
					bind:value={query}
					on:input={handleQueryProjects}
				/>
			</label>

			<Select.Root
				bind:selected={queryBy}
				items={queryByOptions}
				onSelectedChange={handleQueryProjects}
			>
				<Select.Trigger class="flex items-center py-5 gap-3 input group">
					<Select.Value placeholder="Pesquisar por..." />
					<CaretUp
						size="24"
						weight="regular"
						class="group-aria-[expanded=true]:rotate-180 transition-all duration-300"
					/>
				</Select.Trigger>

				<Select.Content
					transition={flyAndScale}
					sideOffset={8}
					class="w-full rounded-xl border border-gray-200 dark:border-d-gray-200 bg-backgrond dark:bg-d-backgrond p-1 shadow-sm outline-none"
				>
					{#each queryByOptions as { value, label } (value)}
						<Select.Item
							{value}
							{label}
							class="
							cursor-default px-4 py-2 hover:bg-gray-200 dark:hover:bg-d-gray-200 rounded-lg
							data-[selected]:bg-gray-200 data-[selected]:dark:bg-d-gray-200 data-[selected]:my-0.5
							"
						>
							{label}
							<Select.ItemIndicator />
						</Select.Item>
					{/each}
					<Select.Arrow />
				</Select.Content>
				<Select.Input name="searchBy" />
			</Select.Root>
		</form>
	</header>

	{#if data.success}
		{#if projectsUnion.length > 0}
			<div
				class={clsx(
					"grid grid-flow-row grid-cols-3 gap-12 w-full max-w-screen-main mt-16",
					"max-lg:gap-6",
					"max-md:grid-cols-2",
					"max-sm:grid-cols-1",
				)}
			>
				{#each projectsUnion as project}
					<article
						class="
						group/parent transition-all will-change-[shadow]
						p-4 rounded-2xl bg-gray-100 dark:bg-d-gray-100 border border-gray-300 dark:border-none
						hover:shadow-lg duration-300
						flex flex-col gap-3
						"
					>
						<img
							src={project.topstory}
							class="h-[180px] rounded-lg object-cover object-center"
							alt=""
						/>

						<h2 class="font-medium text-base leading-4">
							<span class="sr-only">Projeto </span>{project.title}
						</h2>

						<footer class="flex items-start justify-between gap-2">
							<div class="flex flex-wrap gap-1.5">
								{#each project.tags as tag (`${project.id}_tag_${tag.id}`)}
									<a
										href="/blog?queryBy=tag&query={tag.value}"
										class="group chip c-yellow c-clickable"
									>
										{tag.value}
									</a>
								{/each}
							</div>

							<LinksPopover links={project.links} />
						</footer>
					</article>
				{/each}
			</div>
		{:else}
			<div class="max-w-screen-main my-12 w-full">
				<span class="mx-auto warning alert text-center w-full">Ainda não há nenhum projeto 🫶</span>
			</div>
		{/if}

		{#if projectsUnion.length < data.data.totalCount}
			<form
				action="?/fetchMore"
				method="post"
				use:enhance={() => {
					formIsLoading = true;

					return async ({ update }) => {
						formIsLoading = false;
						update();
					};
				}}
			>
				<button
					type="submit"
					class="btn default text-xl font-bold px-16 mx-auto mt-6 disabled:opacity-50"
					disabled={formIsLoading}
				>
					Carregar mais
				</button>
			</form>
		{/if}
	{:else}
		<div class="max-w-screen-main w-full my-12">
			<span class="w-full danger alert">{data.error}</span>
		</div>
	{/if}
</main>

{#if !form?.success && form?.error}
	<div
		class="p-4 rounded-xl absolute right-3 bottom-3 z-20 max-w-[calc(100%_-_24px)] bg-red-700/80"
		transition:fly
	>
		<div class="flex items-start gap-2">
			<WarningCircle size="20" weight="fill" class="mt-[1px]" />
			<span>
				{form?.error}
			</span>
		</div>

		<button on:click={() => (formError = false)} class="btn ghost-dark btn-sm block ml-auto mt-1">
			Fechar
		</button>
	</div>
{/if}
