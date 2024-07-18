<script lang="ts">
	import "$crate/admin.css";
	import { afterNavigate, beforeNavigate } from "$app/navigation";

	let loading = false;

	beforeNavigate(() => (loading = true));
	afterNavigate(() => (loading = false));
</script>

{#if loading}
	<div role="progressbar" class="h-1 fixed top-0 inset-x-0 z-[99999]">
		<div class="h-full w-full bg-yellow-600 animate-indeterminate origin-[0_50%]" />
	</div>
{/if}
<slot />
