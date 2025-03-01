<script lang="ts">
	import Check from "phosphor-svelte/lib/CheckCircle";
	import { fly } from "svelte/transition";

	type Props = {
		message: string;
		close: () => void;
	};

	const { message, close }: Props = $props();
</script>

<div
	class="p-4 rounded-xl absolute right-3 bottom-3 z-20 max-w-[calc(100%_-_24px)] bg-green-500/80"
	transition:fly
>
	<div class="flex items-start gap-2">
		<Check size="20" weight="fill" class="mt-[1px]" />
		<span>
			{message}
		</span>
	</div>

	<button onclick={close} class="btn ghost-dark btn-sm block ml-auto mt-1 leading-none rounded-md">
		Fechar
	</button>
</div>
