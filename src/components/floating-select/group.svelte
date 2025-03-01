<script lang="ts">
	import { Select } from "bits-ui";
	import { FloatingLabel } from "$crate/components/floating-input";
	import clsx from "clsx";
	import { flyAndScale } from "$crate/utils";
	import CaretDown from "phosphor-svelte/lib/CaretDown";

	export type SelectOption = {
		value: string;
		label: string;
	};

	type Props = {
		options: SelectOption[];
		placeholder: string;
		name?: string;
	} & ({ multiple: true; value?: string[] } | { multiple: false; value?: string });

	let { name, multiple = false, options, placeholder, value = $bindable([]) }: Props = $props();
</script>

<Select.Root {name} type={multiple ? "multiple" : "single"} bind:value required>
	<Select.Trigger class="group mb-4 form-select-floating w-full flex justify-between items-center">
		<span class="data-[placeholder]:opacity-0 form-select-control">
			{#if value.length == 0}
				{placeholder}
			{:else}
				{!Array.isArray(value)
					? value
					: value
							.map((v) => options.find((option) => option.value === v)?.label)
							.filter(Boolean)
							.join(", ")}
			{/if}
		</span>
		<FloatingLabel>{placeholder}</FloatingLabel>
		<CaretDown
			size={16}
			weight="bold"
			class="group-data-[state=open]:rotate-180 transition-all duration-300 will-change-transform"
		/>
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			sideOffset={10}
			class={clsx(
				"bg-d-backgrond/50 p-1.5 backdrop-blur-3xl rounded-xl border border-white/5",
				"shadow-black/50 shadow-2xl w-[var(--bits-select-anchor-width)]",
			)}
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:flyAndScale>
							{#each options as option (`floating-select-input-option${option.label}-${option.value}`)}
								<Select.Item
									value={option.value}
									class={clsx(
										"p-1.5 rounded-lg hover:bg-white/5 cursor-default data-[selected]:bg-white/5 mb-1 last:mb-0",
										"ring-yellow-500/25 ring-0 outline-none transition-all duration-100 will-change-[shadow]",
										"focus:ring-4 data-[highlighted]:ring-4",
									)}
								>
									{#snippet children(_)}
										{option.label}
									{/snippet}
								</Select.Item>
							{/each}
						</div>
					</div>
				{/if}
			{/snippet}
		</Select.Content>
	</Select.Portal>
</Select.Root>
