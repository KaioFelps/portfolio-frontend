<script lang="ts">
	export let full: boolean = true;
</script>

{#if full}
	<div class="max-w-screen-main my-12 w-full">
		<span class="mx-auto warning alert text-center w-full"><slot /></span>
	</div>
{:else}
	<span class="mx-auto warning alert text-center w-full"><slot /></span>
{/if}
