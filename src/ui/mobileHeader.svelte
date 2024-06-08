<script lang="ts">
	import LogoDark from "@/assets/logo-dark-mode.svg";
	import Logo from "@/assets/logo-white-mode.svg";
	import ThemeToggler from "@/ui/themeToggleButton.svelte";
	import { getDrawerStore } from "@skeletonlabs/skeleton";
	import Sidebar from "phosphor-svelte/lib/Sidebar";
	import type { DrawerSettings } from "@skeletonlabs/skeleton";

	const drawerStore = getDrawerStore();
	const settings: DrawerSettings = { id: "mobile-menu-drawer" };
</script>

<header class="h-[120px] flex gap-6 px-6 xs:hidden">
	<div class="flex-1 flex justify-start items-center max-sm:hidden">
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />
	</div>
	<div class="flex-1 flex items-center justify-end gap-2">
		<ThemeToggler />

		<button
			on:click={() => drawerStore.open(settings)}
			class="
        rounded-full border-gray-300 dark:border-d-gray-300 border
        w-[46px] h-[46px] hover:scale-105 transition-all ease-in cursor-default
        flex items-center justify-center
        "
		>
			<Sidebar size={24} weight="bold" />
		</button>
	</div>
</header>
