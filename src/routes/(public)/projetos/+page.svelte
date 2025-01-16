<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import CaretUp from "phosphor-svelte/lib/CaretUp";
	import { fly } from "svelte/transition";
	import type { FetchProjectsData } from "./proxy+page.server.js";
	import { goto, afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import LinksPopover from "./linksPopover.svelte";
	import clsx from "clsx";
	import { enhance } from "$app/forms";
	import Title from "$crate/components/title.svelte";
	import type { Selected } from "bits-ui";
	import { flyAndScale } from "$crate/utils.js";
	import type { Project } from "$crate/core/entities/project.js";
	import WarningAlert from "$crate/components/alerts/warning-alert.svelte";
	import Select from "$crate/components/select";

	const {
		data,
		form,
	}: {
		data: FetchProjectsData;
		form: FetchProjectsData | null;
	} = $props();

	let currentPage = $state(data.success ? data.data.page : 1);

	let formIsLoading = $state(false);
	let formError = $state(false);

	let projectsUnion: Project[] = $state([]);

	$effect(() => {
		if (data.success) projectsUnion = data.data.projects;
	});

	$effect(() => {
		if (form?.success) {
			projectsUnion = [...projectsUnion, ...form.data.projects];
			currentPage = form.data.page;
		} else {
			formError = true;
		}
	});

	const queryByOptions = [
		{ value: "title", label: "Buscar por título" },
		{ value: "tag", label: "Buscar por tag" },
	];

	let queryFormTimeoutId: NodeJS.Timeout | undefined = undefined;
	let query = $state(page.url.searchParams.get("q") ?? "");

	let queryByValue = $state("");
	let queryBy: Selected<string> | undefined = $state(
		getQueryByValue(page.url.searchParams.get("qb")),
	);

	$effect(() => {
		queryBy = getQueryByValue(queryByValue);
	});

	afterNavigate((navigation) => {
		if (!navigation.to) return;

		const newQuery = navigation.to.url.searchParams.get("q");
		const newQueryBy = navigation.to.url.searchParams.get("qb");
		if (newQuery !== null) query = newQuery;

		if (newQueryBy !== null) {
			queryBy = getQueryByValue(newQueryBy);
		}
	});

	function getQueryByValue(qb: string | null) {
		return queryByOptions.find((opt) => opt.value === qb);
	}

	function handleQueryProjects() {
		clearTimeout(queryFormTimeoutId);

		const timeout = setTimeout(() => {
			if (query.trim() === "") return goto(page.url.pathname);
			if (!queryBy) return;

			goto(`?q=${query}&qb=${queryBy.value}`);
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
			onsubmit={(e) => {
				e.preventDefault();
				handleQueryProjects();
			}}
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
					oninput={handleQueryProjects}
				/>
			</label>

			<Select.Root
				name="queryBy"
				bind:value={queryByValue}
				type="single"
				items={queryByOptions}
				onValueChange={handleQueryProjects}
			>
				<Select.Trigger label={queryBy?.label ?? "Selecione um filtro"} />

				<Select.Content>
					{#each queryByOptions as { value, label } (value)}
						<Select.Item {value} {label} />
					{/each}
				</Select.Content>
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
									<a href="/projetos?q={tag.value}&qb=tag" class="group chip c-yellow c-clickable">
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
			<WarningAlert>Ainda não há nenhum projeto 🫶</WarningAlert>
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
				<input type="hidden" name="page" value={currentPage + 1} />
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

		<button onclick={() => (formError = false)} class="btn ghost-dark btn-sm block ml-auto mt-1">
			Fechar
		</button>
	</div>
{/if}
