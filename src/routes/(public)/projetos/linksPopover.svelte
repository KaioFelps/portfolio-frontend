<script lang="ts">
	import type { Link } from "$crate/core/entities/link";
	import LinkSimple from "phosphor-svelte/lib/LinkSimple";
	import { Popover } from "bits-ui";
	import clsx from "clsx";
	import { flyAndScale } from "$crate/utils";

	export let links: Link[];
</script>

{#if links.length > 0}
	<Popover.Root>
		<Popover.Trigger
			title="Links relacionados"
			class={clsx(
				"text-gray-800 p-1 rounded-md bg-gray-200 dark:text-d-gray-800 dark:bg-d-gray-200 transition-all will-change-[filter,_background-color]",
				"hover:brightness-95 active:brightness-90",
				"dark:hover:bg-white/10 dark:active:bg-white/15",
			)}
		>
			<LinkSimple size="24" weight="bold" />
		</Popover.Trigger>
		<Popover.Content
			sideOffset={8}
			transition={flyAndScale}
			class="z-30 w-full flex flex-col gap-1 max-w-48 rounded-xl border border-gray-300 dark:border-black bg-gray-100 dark:bg-d-gray-100 p-2"
		>
			{#each links as link}
				<a
					class={clsx(
						"cursor-default block p-2 rounded-lg text-center transition-all will-change-[background-color,_filter] font-bold text-sm text-blue-500",
						"dark:bg-d-gray-200 dark:hover:bg-white/5 dark:active:bg-white/10 dark:active:brightness-100",
						"bg-gray-200 hover:bg-gray-300 active:brightness-90",
					)}
					href={link.value}
					target="_blank"
				>
					{link.title}
				</a>
			{/each}

			<Popover.Arrow
				class="drop-shadow-[-1px_-1px_0_var(--tw-shadow-color)] shadow-gray-300 dark:shadow-black"
			/>
		</Popover.Content>
	</Popover.Root>
{/if}
