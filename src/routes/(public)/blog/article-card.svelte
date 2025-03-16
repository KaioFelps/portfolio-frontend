<script lang="ts">
	import LinkSimple from "phosphor-svelte/lib/LinkSimple";
	import type { Post } from "$crate/core/entities/post";
	import clsx from "clsx";

	const post: Post = $props();
</script>

<a
	href="/blog/{post.slug}"
	class={clsx(
		"group/parent transition-all",
		"cursor-default p-6 rounded-lg bg-gray-100 dark:bg-d-gray-100 border",
		"border-gray-300 dark:border-none flex gap-6 mb-2 last:mb-0 w-full",
		"hover:-translate-y-1 hover:z-10 hover:scale-[1.005] hover:shadow-lg",
	)}
>
	<img
		src={post.topstory}
		class="min-w-[264px] h-32 object-cover rounded-lg max-md:hidden"
		alt=""
	/>

	<div class="w-full">
		<div class="flex items-start justify-between gap-4">
			<h3
				class={clsx(
					"text-[20px] font-bold relative",
					"group-hover/parent:text-blue-500 transition-all",
					"after:absolute after:-translate-x-1/2 after:left-1/2 after:bottom-0.5",
					"after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all",
					"hover:after:w-full",
				)}
			>
				{post.title}
			</h3>
			<button class="text-blue-500 p-0" title="Copiar link do post">
				<LinkSimple size="24" weight="bold" />
			</button>
		</div>

		<p class="text-gray-600 dark:text-d-gray-600 font-medium mb-6 mt-1">{post.preview}</p>

		<div class="flex gap-2 flex-wrap">
			<span
				class="text-gray-600 dark:text-d-gray-600 px-2 py-[6px] rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 leading-none text-sm"
			>
				{new Date(post.publishedAt!).toLocaleString("pt-Br", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}
			</span>

			{#each post.tags as tag}
				<span
					class="px-2 py-[6px] rounded-full bg-yellow-500/10 border border-yellow-500 leading-none text-sm text-yellow-700"
					>{tag.value}</span
				>
			{/each}
		</div>
	</div>
</a>
