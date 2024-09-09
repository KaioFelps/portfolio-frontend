<script lang="ts">
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import type { AdminTagPageLoadData } from "./+page.server";
	import { page } from "$app/stores";
	import { PaginationHelper } from "$crate/core/helpers/pagination";
	import Pencil from "phosphor-svelte/lib/Pencil";
	import { UserRoleEnum } from "$crate/core/entities/userRoleEnum";
	import type { AuthUser } from "$crate/core/entities/authUser";

	export let data: AdminTagPageLoadData & { user: AuthUser };

	let url = $page.url;
	let currentPage = data?.success ? data.data.page : 1;
	let lastPage = 1;

	$: if (data.success) {
		lastPage = data.data.totalCount <= 0 ? 1 : Math.ceil(data.data.totalCount / data.data.perPage);
	}

	let paginationButtons = (() => {
		if (!data.success) return [];

		let { maxLeft, maxRight } = PaginationHelper.getVisibleButtons(5, currentPage, lastPage);

		let calculatedPages: number[] = [];

		for (let page = maxLeft; page <= maxRight; ++page) {
			calculatedPages.push(page);
		}

		return calculatedPages;
	})();
</script>

<header class="mb-12 flex items-center justify-between">
	<h1>Tags</h1>

	{#if data.user.role === UserRoleEnum.admin}
		<a href="/admin/tags/novo" class="btn default">Adicionar tag</a>
	{/if}
</header>

{#if data.success}
	{#if data.data.tags.length > 0}
		<div class="flex flex-col gap-1 mb-12">
			{#each data.data.tags as tag}
				<div class="flex justify-between gap-3 items-center p-4 rounded-2xl bg-white/5">
					<span class="font-medium">{tag.value}</span>
					<a href="/admin/tags/editar/{tag.id}"><Pencil size="20" weight="bold" /></a>
				</div>
			{/each}
		</div>
	{:else}
		<span class="mx-auto warning alert text-center w-full mb-12 inline-block">
			Não há nenhuma tag registrada. Experimente <a class="font-bold" href="/admin/tags/novo"
				>criar uma</a
			>!
		</span>
	{/if}

	<div class="flex justify-center gap-2.5">
		<a
			href={`${url.pathname}${PaginationHelper.getQueryStringFromUrl(url.toString(), { page: 1 })}`}
			class="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 transition-all duration-100 will-change-[color]"
		>
			<CaretLeft size="20" weight="bold" />
		</a>

		<div class="flex gap-[5px]">
			{#each paginationButtons as page (`tag_listing_pagination_to_${page}`)}
				<a
					data-state={currentPage === page ? "active" : "deactive"}
					href={`${url.pathname}${PaginationHelper.getQueryStringFromUrl(url.toString(), { page })}`}
					class="py-3.5 px-[17.5px] leading-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 data-[state=active]:bg-d-backgrond/50 data-[state=active]:cursor-default transition-all duration-100 will-change-[color]"
				>
					{page}
				</a>
			{/each}
		</div>

		<a
			href={`${url.pathname}${PaginationHelper.getQueryStringFromUrl(url.toString(), { page: lastPage })}`}
			class="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 transition-all duration-100 will-change-[color]"
		>
			<CaretRight size="20" weight="bold" />
		</a>
	</div>
{:else}
	<span class="mx-auto danger alert text-center w-full">{data.error}</span>
{/if}
