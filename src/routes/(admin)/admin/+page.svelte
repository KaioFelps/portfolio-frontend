<script lang="ts">
	import { LogTargetType, LogAction, type Log } from "$crate/core/entities/log.js";
	import PenNib from "phosphor-svelte/lib/PenNib";
	import RocketLaunch from "phosphor-svelte/lib/RocketLaunch";

	export let data;

	function formatLogString(log: Log) {
		let message;
		if (log.action === LogAction.created) {
			if (log.targetType === LogTargetType.post) message = "Novo post";
			if (log.targetType === LogTargetType.project) message = "Projeto criado";
			if (log.targetType === LogTargetType.user) message = "Novo usuário registrado";
		}

		if (log.action === LogAction.deleted) {
			if (log.targetType === LogTargetType.post) message = "Post deletado";
			if (log.targetType === LogTargetType.project) message = "Projeto removido";
			if (log.targetType === LogTargetType.user) message = "Usuário removido";
		}

		if (log.action === LogAction.updated) {
			if (log.targetType === LogTargetType.post) message = "Post editado";
			if (log.targetType === LogTargetType.project) message = "Projeto editado";
			if (log.targetType === LogTargetType.user) message = "Alterações no usuário";
		}

		message = message?.concat(': "', log.target, '"');

		return message;
	}
	console.log(data);
</script>

<section class="mb-12">
	<h2 class="mb-6">Status</h2>

	<div class="flex gap-3">
		<div class="flex-1 status-card">
			<span class="block w-fit p-2 rounded-2xl bg-yellow-500 text-d-backgrond">
				<RocketLaunch size="32" weight="bold" />
			</span>
			<span class="font-bold"><span class="text-3xl">13</span> projetos novos</span>
		</div>

		<div class="flex-1 status-card">
			<span class="block w-fit p-2 rounded-2xl bg-yellow-500 text-d-backgrond">
				<PenNib size="32" weight="bold" />
			</span>
			<span class="font-bold"><span class="text-3xl">32</span> artigos publicados</span>
		</div>

		<div class="flex-1 rounded-2xl bg-white/5"> </div>
	</div>
</section>

<section>
	<h2 class="mb-6">Últimos registros</h2>

	{#if data.success}
		<div class="flex flex-col gap-1">
			{#each data.success?.logs as log}
				<p class="rounded-2xl bg-white/5 font-medium p-4">{formatLogString(log)}</p>
			{/each}
		</div>
	{:else if data.error}
		<span class="mx-auto danger alert text-center w-full">{data.error}</span>
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
