<script lang="ts">
	import type { GetPostBySlugResponse } from "$crate/handlers/blog";
	import ArrowRight from "phosphor-svelte/lib/ArrowRight";
	import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
	import Title from "$crate/components/title.svelte";
	import clsx from "clsx";
	import StarryHighlighter from "$crate/components/starry-highlighter.svelte";

	type Props = { data: GetPostBySlugResponse };
	const { data }: Props = $props();
</script>

<svelte:head>
	<Title title={data.success && data.data ? data.data.title : "Post não encontrado"} />
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

	{#if data.success && data.data}
		<header>
			<h1
				class={clsx(
					"px-12 max-sm:px-4 text-center pb-8 border-b mb-6",
					"font-bold text-5xl max-sm:text-3xl text-gray-800 border-gray-300",
					"dark:text-d-gray-800 dark:border-d-gray-300",
				)}
			>
				{data.data.title}
			</h1>

			<div class="flex flex-col gap-2 w-full items-center mb-16">
				<span class="text-sm text-center mb-1 text-gray-600 dark:text-d-gray-600">
					{#if data.data.publishedAt}
						Publicado em {data.data.publishedAt.toLocaleDateString("pt-Br", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}.
					{:else}
						Post ainda não publicado.
					{/if}

					{#if data.data.updatedAt}
						<br />Última edição em {data.data.updatedAt.toLocaleDateString("pt-Br")}.
					{/if}
				</span>

				<div class="flex flex-wrap justify-center gap-1">
					{#each data.data.tags as tag (tag.id)}
						<a
							href="/blog?queryBy=tag&query={tag.value}"
							class="
							flex
                            group cursor-default text-black rounded-full px-2.5 pt-1 pb-0.5 bg-yellow-500 text-sm leading-tight transition-all
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
			text-container
            max-w-[792px] gap-4 mx-auto
            text-lg
            dark:text-d-gray-800
            [&_:is(p,div,hr,table)]:mb-4
            prose-table:max-w-full prose-table:overflow-x-scroll
            prose-img:max-w-full
            "
		>
			{#await data.data.content}
				<div class="h-5 w-full rounded-full animate-pulse bg-gray-300 dark:bg-d-gray-300"></div>
				<div class="h-5 w-3/4 rounded-full animate-pulse bg-gray-300 dark:bg-d-gray-300"></div>
				<div class="h-5 w-1/4 rounded-full animate-pulse bg-gray-300 dark:bg-d-gray-300"></div>
				<div class="h-5 w-2/4 rounded-full animate-pulse bg-gray-300 dark:bg-d-gray-300"></div>
			{:then content}
				{@html content}
			{:catch err}
				<p>{err}</p>
			{/await}
		</div>
	{:else if data.success && !data.data}
		<div class="flex justify-center text-red-700 my-12">
			<span>Post não encontrado =(</span>
		</div>
	{:else}
		<div class="max-w-screen-main mx-auto my-12">
			<span class="mx-auto danger alert">
				Há algum problema com o servidor, tente mais tarde =(
			</span>
		</div>
	{/if}
</main>
