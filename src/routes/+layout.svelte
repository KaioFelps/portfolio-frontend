<script lang="ts">
	import type { Snippet } from "svelte";
	import "$crate/styles/app.css";

	const { children }: { children: Snippet } = $props();
</script>

{@render children()}
