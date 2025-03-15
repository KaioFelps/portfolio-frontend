<script lang="ts">
	import { Switch, type SwitchRootProps } from "bits-ui";
	import clsx from "clsx";

	type Props = SwitchRootProps & {
		forceDarkMode: boolean;
	};

	let { forceDarkMode, ...props }: Props = $props();
</script>

<Switch.Root
	{...props}
	class={clsx(
		forceDarkMode && "dark",
		"outline-none focus-visible:outline-none rounded-full p-[3px]",
		"ring-0 focus-visible:ring-4 focus-visible:ring-yellow-600/40",
		"bg-gray-100 dark:bg-d-gray-100 border border-gray-300 dark:border-d-gray-300",
		"shrink-0 cursor-default hover:brightness-95 active:scale-95 transition-all",
		"inline-flex w-[35px] items-center disabled:cursor-not-allowed disabled:opacity-50",
	)}
>
	<Switch.Thumb
		class={clsx(
			"size-[15px] rounded-full pointer-events-none block shrink-0 transition-transform",
			"data-[state=unchecked]:translate-x-3 data-[state=checked]:translate-x-0",
			"data-[state=unchecked]:bg-d-gray-600 data-[state=unchecked]:dark:bg-gray-600",
			"data-[state=checked]:bg-yellow-500",
		)}
	/>
</Switch.Root>
