<script lang="ts">
	import { Select } from "bits-ui";
	import { FloatingLabel } from "$crate/components/floating-input";
	import clsx from "clsx";
	import { fly } from "svelte/transition";
	import { flyAndScale } from "$crate/utils";

	export let options: { value: string; label: string }[];
	export let placeholder: string;
	export let multiple: boolean = false;
	export let values: string[];
</script>

<Select.Root {multiple}>
	<Select.Trigger bind:value={values} class="mb-4 form-select-floating w-full flex">
		<Select.Value class="data-[placeholder]:opacity-0 form-select-control" {placeholder} />
		<FloatingLabel>{placeholder}</FloatingLabel>
	</Select.Trigger>

	<Select.Content
		sideOffset={10}
		transition={flyAndScale}
		class="bg-d-backgrond/50 p-1.5 backdrop-blur-3xl rounded-xl border border-white/5 shadow-black/50 shadow-2xl"
	>
		{#each options as option (`floating-select-input-option${option.label}-${option.value}`)}
			<Select.Item
				value={option.value}
				class={clsx(
					"p-1.5 rounded-lg hover:bg-white/5 cursor-default data-[selected]:bg-white/5 mb-1 last:mb-0",
					"ring-yellow-500/25 ring-0 outline-none transition-all duration-100 will-change-[shadow]",
					"focus:ring-4 data-[highlighted]:ring-4",
				)}
			>
				{option.label}
				<Select.ItemIndicator />
			</Select.Item>
		{/each}

		<Select.Arrow />
	</Select.Content>
</Select.Root>
