<script lang="ts">
	import WarningCircle from "phosphor-svelte/lib/WarningCircle";
	import { fly } from "svelte/transition";

	export let message: string;
	export let close: () => void;
</script>

<div
	class="p-4 rounded-xl absolute right-3 bottom-3 z-20 max-w-[calc(100%_-_24px)] bg-red-700/80"
	transition:fly
>
	<div class="flex items-start gap-2">
		<WarningCircle size="20" weight="fill" class="mt-[1px]" />
		<span>
			{message}
		</span>
	</div>

	<button on:click={close} class="btn ghost-dark btn-sm block ml-auto mt-1"> Fechar </button>
</div>
