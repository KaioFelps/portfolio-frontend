<script lang="ts">
	import { flyAndScale } from "$crate/utils";
	import { DropdownMenu } from "bits-ui";
	import clsx from "clsx";
	import CaretUp from "phosphor-svelte/lib/CaretUp";
	import type { Option } from "./types";

	const {
		options = [],
		title,
	}: {
		options: Array<Option>;
		title: string;
	} = $props();

	const selected = $derived(options.find((item) => item.active));
	const triggerTitle = $derived(selected?.title ?? title);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={clsx(
			"w-32 group flex items-center justify-between px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 active:bg-white/20 gap-3",
		)}
	>
		<span
			class="inline-block text-start w-full line-clamp-1 text-ellipsis whitespace-nowrap overflow-hidden"
		>
			{triggerTitle}
		</span>
		<CaretUp
			size="20"
			weight="regular"
			class="group-aria-[expanded='true']:rotate-180 transition-all duration-300"
		/>
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			side="bottom"
			align="start"
			sideOffset={8}
			alignOffset={0}
			class="max-w-[calc(100%-_48px)] min-w-[144px] dropdown"
		>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:flyAndScale>
						{#each options as { title, handler, active } (title)}
							<DropdownMenu.Item class="group" data-selected={active || null}>
								<button
									class={clsx(
										"cursor-default w-full text-start px-2 py-1",
										"group-data-[selected]:bg-d-gray-200 group-data-[selected]:my-1 group-last:!mb-0 group-first:!mt-0",
										"hover:bg-d-gray-200 rounded-lg ",
									)}
									onclick={handler}
								>
									{title}
								</button>
							</DropdownMenu.Item>
						{/each}
					</div>
				{/if}
			{/snippet}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
