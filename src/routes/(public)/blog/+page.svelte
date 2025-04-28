<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import type { Selected } from "bits-ui";
	import Select from "$crate/components/select";
	import type { LoadPaginatedPosts } from "$crate/handlers/blog";
	import type { Post } from "$crate/core/entities/post";
	import { page } from "$app/state";
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import { fly } from "svelte/transition";
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import { goto } from "$app/navigation";
	import WarningAlert from "$crate/components/alerts/warning-alert.svelte";
	import Meta from "$crate/components/meta";
	import ArticleCard from "./article-card.svelte";

	const queryByOptions = [
		{ value: "title", label: "Buscar por título" },
		{ value: "tag", label: "Buscar por tag" },
	];

	const { data, form }: { data: LoadPaginatedPosts; form: ActionData } = $props();

	let formError = $state(false);
	let formIsLoading = $state(false);
	let currentPage = $state(data.success ? data.data.page : 1);

	let postsPerMonth: Record<string, Post[]> = $derived.by(() => {
		if (form?.success) {
			return segregatePostsByPublishmentDate(postsPerMonth, form.data.posts);
		}

		if (data.success) {
			return segregatePostsByPublishmentDate({}, data.data.posts);
		}

		return {};
	});

	$effect(() => {
		if (!form?.success) {
			formError = true;
			return;
		}

		currentPage = form.data.page;
	});

	let queryFormTimeoutId: NodeJS.Timeout | undefined = undefined;
	let query: string = $state(page.url.searchParams.get("q") ?? "");
	let queryByValue = $state<string>();

	let queryBy: Selected<string> | undefined = $state(
		queryByOptions.find((option) => option.value === page.url.searchParams.get("qb")),
	);

	$effect(() => {
		queryBy = queryByOptions.find((option) => option.value === queryByValue);
	});

	function handleQueryInput() {
		clearTimeout(queryFormTimeoutId);

		const timeout = setTimeout(async () => {
			if (query.trim() === "") return goto(page.url.pathname);
			goto(`?q=${query}&qb=${queryBy!.value}`);
		}, 1500);

		queryFormTimeoutId = timeout;
	}

	function segregatePostsByPublishmentDate(posts: Record<string, Post[]>, newPosts: Post[]) {
		newPosts.forEach((post) => {
			const date = new Date(post.createdAt);
			const key = date.toLocaleDateString("pt-Br", { year: "numeric", month: "long" });

			if (!posts[key]) {
				posts[key] = [post];
				return;
			}

			posts[key].push(post);
		});

		return posts;
	}
</script>

<Meta.Root location="/blog">
	<Meta.Title title="Blog" />
	<Meta.Description
		description="Artigos sobre o que eu venho aprontando ou sobre coisas que, aparentemente, todo mundo sabia mas eu acabei de descobrir!"
	/>
</Meta.Root>

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
			onsubmit={handleQueryInput}
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
					oninput={handleQueryInput}
				/>
			</label>

			<Select.Root
				name="searchBy"
				bind:value={queryByValue}
				type="single"
				items={queryByOptions}
				onValueChange={handleQueryInput}
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

	{#if !data.success}
		<div class="max-w-screen-main mx-auto my-12">
			<span class="mx-auto danger alert">
				{data.internalError ? "Não foi possível carregar os posts." : data.error}
			</span>
		</div>
	{:else if data.data.posts.length > 0}
		<div class="flex flex-col w-full max-w-screen-main mt-16">
			{#each Object.entries(postsPerMonth) as [month, posts] (month)}
				<div class="mb-16 last-of-type:mb-0">
					<h2 class="capitalize text-2xl font-bold mb-6">
						<span class="sr-only">Publicações de </span>{month}
					</h2>

					{#each posts as post (post.id)}
						<ArticleCard {...post} />
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
</main>

{#if form?.error}
	<div
		class="p-4 rounded-xl absolute right-3 bottom-3 z-20 max-w-[calc(100%_-_24px)] bg-red-700/80"
		transition:fly
	>
		<div class="flex items-start gap-2">
			<WarningCircle size="20" weight="fill" class="mt-[1px]" />
			<span>Houve um erro enquanto tentávamos buscar os artigos.</span>
		</div>

		<button onclick={() => (formError = false)} class="btn ghost-dark btn-sm block ml-auto mt-1">
			Fechar
		</button>
	</div>
{/if}
