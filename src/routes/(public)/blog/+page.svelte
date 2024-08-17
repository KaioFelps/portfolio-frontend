<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { Select, type Selected } from "bits-ui";
	import CaretUp from "phosphor-svelte/lib/CaretUp";
	import LinkSimple from "phosphor-svelte/lib/LinkSimple";
	import { flyAndScale } from "$crate/utils";
	import type { FetchPostsResponse } from "./+page.server";
	import type { Post } from "$crate/core/entities/post";
	import { page } from "$app/stores";
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import { fly } from "svelte/transition";
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import { goto } from "$app/navigation";
	import Title from "$crate/components/title.svelte";
	import WarningAlert from "$crate/components/alerts/warning-alert.svelte";

	const queryByOptions = [
		{ value: "title", label: "Buscar por título" },
		{ value: "tag", label: "Buscar por tag" },
	];

	export let data: FetchPostsResponse;
	export let form: ActionData;

	$: formError = form?.error ? true : false;

	let formIsLoading = false;

	let nextPageFetchError: string | null = null;
	$: currentPage = data.success ? data.data.page : 1;

	let postsPerMonth: Record<string, Post[]> = {};

	$: segregatePostsByPublishmentDate(data.success ? data.data.posts : []);
	$: if (form?.success) {
		segregatePostsByPublishmentDate(form.data.posts);
		currentPage = form.data.page;
	}

	let queryFormTimeoutId: NodeJS.Timeout | undefined = undefined;
	let query: string = $page.url.searchParams.get("q") ?? "";

	let queryBy: Selected<string> | undefined =
		queryByOptions.find((option) => option.value === $page.url.searchParams.get("qb")) ??
		queryByOptions[0];

	function handleQueryInput() {
		clearTimeout(queryFormTimeoutId);

		const timeout = setTimeout(async () => {
			postsPerMonth = {};
			if (query.trim() === "") return goto($page.url.pathname);
			goto(`?q=${query}&qb=${queryBy!.value}`);
		}, 1500);

		queryFormTimeoutId = timeout;
	}

	function segregatePostsByPublishmentDate(posts: Post[]) {
		posts.forEach((post) => {
			const date = new Date(post.createdAt);
			const key = date.toLocaleDateString("pt-Br", { year: "numeric", month: "long" });

			if (!postsPerMonth[key]) {
				postsPerMonth[key] = [post];
				return;
			}

			postsPerMonth[key].push(post);
		});

		postsPerMonth = postsPerMonth;
	}
</script>

<svelte:head>
	<Title title="Blog" />
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
		<h1 class="text-5xl font-bold">Blog</h1>

		<form
			on:submit={handleQueryInput}
			class="flex flex-row gap-4 items-center justify-end w-full max-sm:hidden"
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
					on:input={handleQueryInput}
				/>
			</label>

			<Select.Root
				bind:selected={queryBy}
				items={queryByOptions}
				onSelectedChange={handleQueryInput}
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
		{#if data.data.posts.length > 0}
			<div class="flex flex-col w-full max-w-screen-main mt-16">
				{#each Object.entries(postsPerMonth) as [month, posts] (month)}
					<div class="mb-16 last-of-type:mb-0">
						<h2 class="capitalize text-2xl font-bold mb-6">
							<span class="sr-only">Publicações de </span>{month}
						</h2>

						{#each posts as post}
							<a
								href="/blog/{post.slug}"
								class="
								group/parent transition-all
								cursor-default p-6 rounded-lg bg-gray-100 dark:bg-d-gray-100 border border-gray-300 dark:border-none flex gap-6 mb-2 last:mb-0 w-full
								hover:-translate-y-1 hover:z-10 hover:scale-[1.005] hover:shadow-lg
								"
							>
								<img
									src={post.topstory}
									class="min-w-[264px] h-32 object-cover rounded-lg max-md:hidden"
									alt=""
								/>

								<div class="w-full">
									<div class="flex items-start justify-between gap-4">
										<h3
											class="
											text-[20px] font-bold relative
											group-hover/parent:text-blue-500 transition-all
											after:absolute after:-translate-x-1/2 after:left-1/2 after:bottom-0.5 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all
											hover:after:w-full
											"
										>
											{post.title}
										</h3>
										<button class="text-blue-500 p-0" title="Copiar link do post">
											<LinkSimple size="24" weight="bold" />
										</button>
									</div>

									<p class="text-gray-600 dark:text-d-gray-600 font-medium mb-6 mt-1"
										>{post.preview}</p
									>

									<div class="flex gap-2 flex-wrap">
										<span
											class="text-gray-600 dark:text-d-gray-600 px-2 py-[6px] rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 leading-none text-sm"
											>{new Date(post.publishedAt).toLocaleString("pt-Br", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}</span
										>

										{#each post.tags as tag}
											<span
												class="px-2 py-[6px] rounded-full bg-yellow-500/10 border border-yellow-500 leading-none text-sm text-yellow-700"
												>{tag.value}</span
											>
										{/each}
									</div>
								</div>
							</a>
						{/each}
					</div>
				{/each}

				{#if data.data.posts.length < data.data.totalCount}
					<form
						action="?/fetchMore"
						use:enhance={() => {
							formIsLoading = true;

							return async ({ update }) => {
								formIsLoading = false;
								update();
							};
						}}
						method="POST"
					>
						<input type="hidden" name="page" value={currentPage + 1} />
						<button
							type="submit"
							class="btn default text-xl font-bold px-16 mx-auto mt-6 disabled:opacity-50"
							disabled={formIsLoading}
						>
							{formIsLoading ? "Carregando" : "Carregar mais"}
						</button>
					</form>
				{/if}
			</div>
		{:else}
			<WarningAlert>Ainda não há nenhum post 😒</WarningAlert>
		{/if}
	{:else}
		<div class="max-w-screen-main mx-auto my-12">
			<span class="mx-auto danger alert">{data.error}</span>
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
				{nextPageFetchError}
			</span>
		</div>

		<button on:click={() => (formError = false)} class="btn ghost-dark btn-sm block ml-auto mt-1">
			Fechar
		</button>
	</div>
{/if}
