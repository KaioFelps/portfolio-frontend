<script lang="ts">
	import PenNib from "phosphor-svelte/lib/PenNib";
	import RocketLaunch from "phosphor-svelte/lib/RocketLaunch";
	import type { PageLoadData } from "./handlers";
	import { formatLogString } from "$crate/utils";

	export let data: PageLoadData;
</script>

<section class="mb-12">
	<h2 class="mb-6">Status</h2>

	{#if data.statistics.success}
		<div class="flex gap-3">
			<div class="flex-1 status-card">
				<span class="block w-fit p-2 rounded-2xl bg-yellow-500 text-d-backgrond">
					<RocketLaunch size="32" weight="bold" />
				</span>
				<span class="flex items-center gap-2">
					<span class="text-3xl font-bold">{data.statistics.data.totalProjects}</span> projetos novos
				</span>
			</div>

			<div class="flex-1 status-card">
				<span class="block w-fit p-2 rounded-2xl bg-yellow-500 text-d-backgrond">
					<PenNib size="32" weight="bold" />
				</span>
				<span class="flex items-center gap-2">
					<span class="text-3xl font-bold">{data.statistics.data.totalPosts}</span> artigos publicados
				</span>
			</div>

			<div class="flex-1 rounded-2xl bg-white/5"> </div>
		</div>
	{:else}
		<span class="mx-auto danger alert text-center w-full">
			{data.statistics.internalError
				? "Não foi possível carregar as estatísticas do site."
				: data.statistics.error}
		</span>
	{/if}
</section>

<section>
	<h2 class="mb-6">Últimos registros</h2>

	{#if data.logs.success}
		<div class="flex flex-col gap-1">
			{#each data.logs.data.logs as log}
				<p class="rounded-2xl bg-white/5 font-medium p-4">{formatLogString(log)}</p>
			{/each}
		</div>
	{:else}
		<span class="mx-auto danger alert text-center w-full">
			{data.logs.internalError ? "Não foi possível carregar os logs." : data.logs.error}
		</span>
	{/if}
</section>

<style lang="postcss">
	.status-card {
		background: conic-gradient(#e85300 0deg, #ff8a00 68% 172deg, #e85300 362deg);
		@apply relative rounded-3xl p-8 flex flex-col gap-4 overflow-hidden;
		@apply before:absolute before:inset-0 before:opacity-50;
	}
	.status-card::before {
		background: url("/src/assets/noise-pattern.svg") repeat center center;
		mix-blend-mode: overlay;
	}
</style>
