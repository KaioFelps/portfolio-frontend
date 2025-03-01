<script>
	import clsx from "clsx";
</script>

<div
	aria-busy="true"
	class={clsx(
		"bg-gray-100 dark:bg-d-gray-100 border border-gray-300 dark:border-none",
		" p-4 rounded-2xl flex-1 flex flex-col gap-3 animate-pulse",
	)}
>
	<div class="h-[180px] rounded-lg bg-yellow-500/20 animate-pulse"></div>

	<div
		class={clsx(
			"font-medium text-base leading-4 w-24 h-4 rounded-full bg-gray-300 dark:bg-d-gray-300",
			"animate-pulse",
		)}
	></div>

	<footer class="flex items-start justify-between gap-2">
		<div class="flex flex-wrap gap-1.5">
			<div class="chip c-yellow w-14 h-6"></div>
			<div class="chip c-yellow w-12 h-6"></div>
		</div>
	</footer>
</div>
