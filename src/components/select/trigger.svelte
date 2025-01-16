<script lang="ts">
	import { Select } from "bits-ui";
	import CaretUp from "phosphor-svelte/lib/CaretUp";

	type Props = {
		label: string;
	};

	const { label }: Props = $props();
</script>

<Select.Trigger class="flex items-center justify-between py-5 gap-3 input group min-w-56">
	{label}
	<CaretUp
		size="24"
		weight="regular"
		class="group-aria-[expanded=true]:rotate-180 transition-all duration-300"
	/>
</Select.Trigger>
