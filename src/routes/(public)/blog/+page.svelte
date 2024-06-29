<script lang="ts">
	import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
	import { Select } from "bits-ui";
	import CaretUp from "phosphor-svelte/lib/CaretUp";
	import LinkSimple from "phosphor-svelte/lib/LinkSimple";
	import { flyAndScale } from "$crate/utils";
	import type { FetchPostsResponse } from "./+page.server";
	import type { Post } from "$crate/core/entities/post";
	import { page } from "$app/stores";
	import { generateQueryString, getQueryParamsFromUrl } from "$crate/core/utils/queryParams";
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import { fly } from "svelte/transition";

	export let data: FetchPostsResponse;
	const { data: loadData, error } = data;

	let nextPageFetchError: string | null = null;
	let posts = loadData?.posts ?? [];
	$: currentPage = loadData?.page ?? 1;

	const postsPerMonth: Record<string, Post[]> = {};

	function segregatePostsByPublishmentDate(posts: Post[]) {
		posts.forEach((post: any) => {
			const date = new Date(post.createdAt);
			const key = date.toLocaleDateString("pt-Br", { year: "numeric", month: "long" });
			if (!postsPerMonth[key]) {
				postsPerMonth[key] = [];
			}
			postsPerMonth[key].push(post);
		});
	}

	segregatePostsByPublishmentDate(posts);

	async function handleFetchNextPage() {
		if (error) return;

		const searchArgs = getQueryParamsFromUrl($page.url);
		searchArgs.page = currentPage + 1;

		const query = generateQueryString(searchArgs);
		const response = await fetch(`/api/blog/nextpage${query}`);

		if (response.ok) {
			const { data }: FetchPostsResponse = await response.json();
			currentPage = data!.page;
			segregatePostsByPublishmentDate(data!.posts);
			posts = [...posts, ...data!.posts];
			return;
		}

		nextPageFetchError = "Algo deu errado enquanto buscávamos a próxima página!";

		setTimeout(() => {
			nextPageFetchError = null;
		}, 5000);
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
		<h1 class="text-5xl font-bold">Blog</h1>

		<form action="" class="flex flex-row gap-4 items-center justify-end w-full max-sm:hidden">
			<label
				class="
				flex px-6 py-4 gap-3 rounded-full bg-gray-100 border border-gray-300 dark:bg-d-gray-100 dark:border-d-gray-300
				max-md:grow
				"
			>
				<span>
					<MagnifyingGlass size="32" weight="regular" />
				</span>
				<span class="sr-only">Filtro</span>
				<input
					name="query"
					placeholder="Filtro"
					class="placeholder:text-gray-600 dark:placeholder:text-d-gray-600 bg-transparent border-none focus:outline-none"
				/>
			</label>

			<Select.Root>
				<Select.Trigger
					class="
                    text-gray-600 dark:text-d-gray-600 flex items-center px-6 py-5 gap-3 rounded-full bg-gray-100 border border-gray-300 dark:bg-d-gray-100 dark:border-d-gray-300
                    group
                    "
				>
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
					<Select.Item
						value="title"
						label="Buscar por título"
						class="
						cursor-default px-4 py-2 hover:bg-gray-200 dark:hover:bg-d-gray-200 rounded-lg
						data-[selected]:bg-gray-200 data-[selected]:dark:bg-d-gray-200 data-[selected]:my-0.5
						"
					>
						Buscar por título
						<Select.ItemIndicator />
					</Select.Item>
					<Select.Item
						value="tag"
						label="Buscar por tag"
						class="
						cursor-default px-4 py-2 hover:bg-gray-200 dark:hover:bg-d-gray-200 rounded-lg
						data-[selected]:bg-gray-200 data-[selected]:dark:bg-d-gray-200 data-[selected]:my-0.5
						"
					>
						Buscar por tag
						<Select.ItemIndicator />
					</Select.Item>
					<Select.Arrow />
				</Select.Content>
				<Select.Input name="searchBy" />
			</Select.Root>
		</form>
	</header>

	<div class="flex flex-col w-full max-w-screen-main mt-16">
		{#if !error && !!loadData}
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

			<button
				on:click={handleFetchNextPage}
				class="btn default text-xl font-bold px-16 mx-auto mt-6 disabled:opacity-50"
				disabled={!!error || posts.length >= loadData.totalCount}
			>
				Carregar mais
			</button>
		{:else}
			<div class="max-w-screen-main mx-auto my-12">
				<span class="mx-auto warning alert">{data.error}</span>
			</div>
		{/if}
	</div>
</main>

{#if nextPageFetchError}
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

		<button
			on:click={() => (nextPageFetchError = null)}
			class="btn ghost-dark btn-sm block ml-auto mt-1"
		>
			Fechar
		</button>
	</div>
{/if}
