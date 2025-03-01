<script lang="ts">
	import type { Link } from "$crate/core/entities/link";
	import LinkSimple from "phosphor-svelte/lib/LinkSimple";
	import { Popover } from "bits-ui";
	import clsx from "clsx";
	import { flyAndScale } from "$crate/utils";

	const { links }: { links: Link[] } = $props();
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
			forceMount
			class={clsx(
				"z-30 w-full flex flex-col gap-1 max-w-48 rounded-xl ring-1 ring-gray-300",
				"dark:ring-black bg-gray-100 dark:bg-d-gray-100 p-2",
			)}
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:flyAndScale>
							{#each links as link}
								<a
									class={clsx(
										"cursor-default block p-2 rounded-lg text-center transition-all",
										"will-change-[background-color,_filter] font-bold text-sm text-blue-500",
										"dark:bg-d-gray-200 dark:hover:bg-white/5 dark:active:bg-white/10",
										"dark:active:brightness-100 bg-gray-200 hover:bg-gray-300 active:brightness-90",
									)}
									href={link.value}
									target="_blank"
								>
									{link.title}
								</a>
							{/each}

							<Popover.Arrow
								width={8}
								height={4}
								class={clsx(
									"text-gray-100 dark:text-d-gray-200 drop-shadow-[0px_-1px_0_var(--tw-shadow-color)]",
									"shadow-gray-300 dark:shadow-black",
								)}
							></Popover.Arrow>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Root>
{/if}
