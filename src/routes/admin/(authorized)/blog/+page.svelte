<script lang="ts">
	import Title from "$crate/components/title.svelte";
	import PencilSimple from "phosphor-svelte/lib/PencilSimple";
	import ArrowSquareOut from "phosphor-svelte/lib/ArrowSquareOut";
	import type { BlogPostsPageLoadData } from "./handlers";
	import TogglePostVisibility from "./toggle-post-visibility.svelte";

	const {
		data,
	}: {
		data: BlogPostsPageLoadData;
	} = $props();
</script>

<Title title="Blog Posts" adminRoute />

<header class="mb-12 flex items-center justify-between">
	<h1>Blog Posts</h1>
	<a href="/admin/blog/novo" class="btn default">Novo post</a>
</header>

{#if data.posts.success}
	{#if data.posts.data.posts.length > 0}
		<div class="flex flex-col gap-1">
			<header class="grid grid-cols-10 gap-4 p-4">
				<span class="col-span-6 font-medium">Artigo</span>
				<span class="col-span-3 font-medium">Publicada</span>
				<span class="col-span-1 font-medium justify-self-end">Ações</span>
			</header>

			{#each data.posts.data.posts as post (post.id)}
				<div class="grid grid-cols-10 px-4 py-2.5 gap-4 rounded-2xl bg-white/5">
					<span class="col-span-6 font-medium line-clamp-1 self-center" title={post.title}>
						{post.title}
					</span>

					<div class="col-span-3 flex items-center gap-3">
						<TogglePostVisibility
							postId={post.id}
							publishedAt={!post.publishedAt ? null : new Date(post.publishedAt)}
						/>
					</div>

					<div class="col-span-1 flex items-center justify-end gap-1">
						<a
							class="text-blue-500 p-1.5 rounded-lg"
							href="/blog/{post.slug}"
							title="Visualizar post {post.title}"
							target="_blank"
						>
							<ArrowSquareOut size="20" weight="bold" />
						</a>
						<a class="p-1.5 rounded-lg" href="/admin/projetos/editar/{post.id}">
							<PencilSimple size="20" weight="fill" />
						</a>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<span class="mx-auto warning alert text-center w-full mb-12 inline-block">
			Não há nenhum blogpost. Experimente <a class="font-bold" href="/admin/blog/novo">
				criar um
			</a>!
		</span>
	{/if}
{:else}
	<span class="mx-auto danger alert text-center w-full">
		Não foi possível carregar os blogposts existentes.
	</span>
{/if}
