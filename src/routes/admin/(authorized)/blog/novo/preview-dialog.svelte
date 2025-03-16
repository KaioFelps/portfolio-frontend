<script lang="ts">
	import "$crate/styles/starry-night.css";
	import { StarryNightSingletone } from "$crate/lib/starry-night";
	import { flyAndScale } from "$crate/utils";
	import { Dialog } from "bits-ui";
	import clsx from "clsx";
	import X from "phosphor-svelte/lib/X";

	const { html }: { html: string } = $props();

	let open = $state(false);
	let textContainer: Element | undefined = $state();

	$effect(() => {
		if (open && textContainer) {
			StarryNightSingletone.clientSideHighlight(
				Array.from(textContainer.querySelectorAll("pre code")),
			);
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger onclick={() => (open = true)} class="btn ghost btn-sm">Preview</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm" />
		<Dialog.Content
			class={clsx(
				"dark fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
				"shadow-popover outline-none border border-white/5 rounded-2xl p-6 bg-d-backgrond/80 backdrop-blur-md",
				"w-main max-w-[calc(100%_-_48px)] max-h-[calc(100vh_-_72px)] overflow-y-scroll",
			)}
		>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:flyAndScale>
						<header
							class="pb-4 border-b mb-6 border-d-gray-300 text-d-gray-800 flex items-center justify-between"
						>
							<h1 class="font-bold text-5xl">Preview do post</h1>

							<Dialog.Close
								autofocus={false}
								class={clsx(
									"cursor-default p-3 rounded-full bg-transparent dark:bg-white/5 hover:bg-black/5",
									"dark:hover:bg-white/10 active:brightness-95 outline-none ring-0",
									"dark:ring-white/15 ring-black/15 focus:ring-4 transition-all",
								)}
							>
								<X size="20" weight="bold" />
							</Dialog.Close>
						</header>

						<div class="text-container" bind:this={textContainer}>
							{@html html}
						</div>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
