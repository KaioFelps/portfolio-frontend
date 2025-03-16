<script>
	import "$crate/style/starry-night.css";
	import { StarryNightSingletone } from "$crate/lib/starry-night";
	import { onMount } from "svelte";

	onMount(async () => {
		const codeBlocks = Array.from(document.querySelectorAll("pre code"));
		await StarryNightSingletone.clientSideHighlight(codeBlocks);
	});
</script>
