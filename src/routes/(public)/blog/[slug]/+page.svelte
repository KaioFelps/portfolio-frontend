<script lang="ts">
	import { page } from "$app/stores";
	import type { GetPostResponse } from "./+page.server";
	import ArrowRight from "phosphor-svelte/lib/ArrowRight";
	import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
	import Title from "$crate/components/title.svelte";

	export let data: GetPostResponse;
</script>

<svelte:head>
	<Title title={data.post ? data.post.title : "Não encontrado"} />
</svelte:head>

<main class="flex-1 w-[calc(100%_-_48px)] max-w-screen-mainExpanded mx-auto">
	<a
		href="/blog"
		class="
        cursor-default mb-2 w-fit self-start flex items-center gap-3 px-4 py-2 rounded-full border border-gray-300 dark:border-d-gray-300 leading-none text-sm
        transition-all max-sm:mb-8
		hover:bg-gray-100 active:bg-gray-200
		dark:hover:bg-d-gray-100 dark:active:bg-d-gray-200
        "
	>
		<ArrowLeft size="16" weight="bold" />
		Voltar
	</a>

	{#if data.post}
		<header>
			<h1
				class="
                px-12 text-center pb-4 border-b mb-6
                font-bold text-5xl text-gray-800 border-gray-300
                dark:text-d-gray-800 dark:border-d-gray-300
                "
			>
				{data.post.title}
			</h1>

			<div class="flex flex-col gap-2 w-full items-center mb-16">
				<span class="text-sm text-center mb-1 text-gray-600 dark:text-d-gray-600">
					{#if data.post.publishedAt}
						Publicado em {data.post.publishedAt.toLocaleDateString("pt-Br", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}.
					{:else}
						Post ainda não publicado.
					{/if}

					{#if data.post.updatedAt}
						<br />Última edição em {data.post.updatedAt.toLocaleDateString("pt-Br")}.
					{/if}
				</span>

				<div class="flex flex-wrap justify-center gap-1">
					{#each data.post.tags as tag (tag.id)}
						<a
							href="/blog?queryBy=tag&query={tag.value}"
							class="
							flex
                            group cursor-default text-black rounded-full px-2 py-1 bg-yellow-500 text-sm leading-tight transition-all
                            hover:bg-yellow-600
							dark:bg-yellow-600 dark:hover:bg-yellow-500
                            "
						>
							{tag.value}
							<div
								class="w-[0] group-hover:w-[calc(16px+4px)] transition-all duration-100 ease-in-out overflow-hidden"
							>
								<ArrowRight size="16" weight="bold" class="ml-1" />
							</div>
						</a>
					{/each}
				</div>
			</div>
		</header>

		<div
			id="article-body"
			class="
            max-w-[792px] gap-4 mx-auto
            text-lg
            dark:text-d-gray-800
            [&_:is(p,div,hr,table)]:mb-4
            prose-table:max-w-full prose-table:overflow-x-scroll
            prose-img:max-w-full
            "
		>
			{@html data.post.content}</div
		>
	{:else if !data.error}
		<div class="flex justify-center text-red-700 my-12">
			<span>Post não encontrado =(</span>
		</div>
	{:else}
		<div class="max-w-screen-main mx-auto my-12">
			<span class="mx-auto danger alert">Parece que o servidor está fora do ar =(</span>
		</div>
	{/if}
</main>
