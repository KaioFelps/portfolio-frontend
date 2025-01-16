<script lang="ts">
	import { flyAndScale } from "$crate/utils";
	import { Select } from "bits-ui";

	type Props = Omit<Select.ContentProps, "class">;

	const { children, sideOffset = 8, ...rest }: Props = $props();
</script>

<Select.Content
	{...rest}
	{sideOffset}
	class="w-full rounded-xl border border-gray-200 dark:border-d-gray-200 bg-backgrond dark:bg-d-backgrond p-1 shadow-sm outline-none"
	forceMount
>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:flyAndScale>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</Select.Content>
