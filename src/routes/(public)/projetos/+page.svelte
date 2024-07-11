<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import { fly } from "svelte/transition";
	import type { FetchProjectsData } from "./proxy+page.server.js";
	import type { ActionData } from "./$types";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import LinksPopover from "./linksPopover.svelte";
	import clsx from "clsx";
	import { enhance } from "$app/forms";

	export let data: FetchProjectsData;
	export let form: ActionData;

	let loadError = data.error;
	let formError = false;
	let formIsLoading = false;

	let projectsUnion = data.success?.projects ?? [];

	$: if (!form?.error) projectsUnion = [...projectsUnion, ...(form?.success?.projects ?? [])];

	$: formError = form?.error ? true : false;

	let queryFormTimeoutId: NodeJS.Timeout | undefined = undefined;
	let query: string = $page.url.searchParams.get("query") ?? "";

	function handleQueryInput() {
		clearTimeout(queryFormTimeoutId);

		const timeout = setTimeout(() => {
			if (query.trim() === "") return goto($page.url.pathname);

			goto(`?query=${query}`);
		}, 1500);

		queryFormTimeoutId = timeout;
	}
</script>

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
			on:submit={handleQueryInput}
			class="flex-1 flex flex-row gap-4 items-center justify-end max-sm:hidden"
		>
			<label class="flex gap-3 input">
				<span>
					<MagnifyingGlass size="32" weight="regular" />
				</span>
				<span class="sr-only">Filtro</span>
				<input
					bind:value={query}
					on:input={handleQueryInput}
					name="query"
					placeholder="Pesquise por títulos"
					class="input-inner"
				/>
			</label>
		</form>
	</header>

	{#if !loadError && data.success}
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

						<h2 class="font-medium text-base leading-4"
							><span class="sr-only">Projeto </span>{project.title}</h2
						>

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

		{#if projectsUnion.length < data.success.totalCount}
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
		<div class="max-w-screen-main mx-auto my-12">
			<span class="mx-auto danger alert">{loadError}</span>
		</div>
	{/if}
</main>

{#if form?.error}
	<div
		class="p-4 rounded-xl absolute right-3 bottom-3 z-20 max-w-[calc(100%_-_24px)] bg-red-700/80"
		transition:fly
	>
		<div class="flex items-start gap-2">
			<WarningCircle size="20" weight="fill" class="mt-[1px]" />
			<span>
				{form.error}
			</span>
		</div>

		<button on:click={() => (formError = false)} class="btn ghost-dark btn-sm block ml-auto mt-1">
			Fechar
		</button>
	</div>
{/if}
