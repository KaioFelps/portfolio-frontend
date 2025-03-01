<script lang="ts">
	import type { Project } from "$crate/core/entities/project";
	import clsx from "clsx";
	import LinksPopover from "./linksPopover.svelte";

	const { topstory, title, createdAt, id, links, tags }: Project = $props();
</script>

<article
	class={clsx(
		"group/parent transition-all will-change-[shadow] p-4 rounded-2xl",
		"bg-gray-100 dark:bg-d-gray-100 border border-gray-300 dark:border-none",
		"hover:shadow-lg duration-300 flex flex-col gap-3",
	)}
>
	<img src={topstory} class="h-[180px] rounded-lg object-cover object-center" alt="" />

	<h2 class="font-medium text-base leading-4">
		<span class="sr-only">Projeto </span>{title}
	</h2>

	<footer class="flex items-start justify-between gap-2">
		<div class="flex flex-wrap gap-1.5">
			{#each tags as tag (`${id}_tag_${tag.id}`)}
				<a href="/projetos?q={tag.value}&qb=tag" class="group chip c-yellow c-clickable">
					{tag.value}
				</a>
			{/each}
		</div>

		<LinksPopover {links} />
	</footer>
</article>
