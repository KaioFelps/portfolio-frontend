<script lang="ts">
	import { Select } from "bits-ui";
	import clsx from "clsx";

	type Props = Select.ItemProps;

	const { class: className, label, value }: Props = $props();
</script>

<Select.Item
	{value}
	{label}
	class={clsx(
		"cursor-default px-4 py-2 hover:bg-gray-200 dark:hover:bg-d-gray-200 rounded-lg",
		"data-[selected]:bg-gray-200 data-[selected]:dark:bg-d-gray-200 [&:not(:last-child)]:data-[selected]:my-0.5",
		className && className,
	)}
>
	{#snippet children(_: { selected: boolean })}
		{label}
	{/snippet}
</Select.Item>
