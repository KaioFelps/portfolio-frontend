<script lang="ts">
	import { onMount } from "svelte";

	type $$props = {
		title?: string;
	};

	export let title: $$props["title"] = undefined;
	$: formattedTitle = title ? `Kaio Felps | ${title}` : "Kaio Felps";

	onMount(() => {
		return () => {
			document.head.querySelectorAll("title")?.forEach((title) => title.remove());
		};
	});
</script>

<title>{formattedTitle}</title>
