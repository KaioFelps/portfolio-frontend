<script lang="ts">
	import MobileMenu from "@/ui/mobileMenu.svelte";
	import "../app.css";
	import { Drawer, getDrawerStore, initializeStores } from "@skeletonlabs/skeleton";

	initializeStores();

	const drawerStore = getDrawerStore();
</script>

<slot />

<Drawer
	bgDrawer="fixed left-0 inset-y-0 w-full max-w-80 z-50 bg-backgrond dark:bg-d-backgrond"
	rounded="rounded-none"
>
	{#if $drawerStore.id === "mobile-menu-drawer"}
		<MobileMenu />
	{:else}
		<div>ups! wrong drawer.</div>
	{/if}
</Drawer>
