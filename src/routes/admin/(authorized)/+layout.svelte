<script lang="ts">
	import logo from "$crate/assets/logo-dark-mode.svg";
	import House from "phosphor-svelte/lib/House";
	import SideBarDynamicMenu from "./sideBarDynamicMenu.svelte";
	import type { AuthUser } from "$crate/core/entities/authUser";
	import ArrowSquareOut from "phosphor-svelte/lib/ArrowSquareOut";

	export let data: { user: AuthUser };
</script>

<div
	id="background-blobs"
	class="fixed inset-0 -z-10 bg-d-backgrond from-yellow-700/50 to-d-backgrond pointer-events-none"
>
	<div class="bg-blob absolute pointer-events-none -left-[40%] -top-[60%]" />
	<div class="bg-blob absolute pointer-events-none -right-[40%] -bottom-[60%]" />
	<div class="pointer-events-none fixed inset-0 bg-blobs-overlay"></div>
</div>

<aside
	class="from-d-backgrond absolute inset-y-0 left-0 w-[304px] border-r border-white/5 backdrop-blur-3xl"
>
	<header>
		<h1 class="px-6 py-4 border-b border-b-white/10">
			<span class="sr-only">Kaio Felipe Website Housekeeping</span>
			<img src={logo} alt="Kaio Felps" class="w-[170px]" />
		</h1>
	</header>
	<nav>
		<a
			href="/admin"
			class="px-6 py-4 border-b border-white/10 flex items-center gap-3 font-bold text-base text-white hover:bg-black/10 hover:text-white/80 cursor-default active:text-white/70 transition-all duration-100"
		>
			<span class="text-yellow-500"><House size="20" weight="bold" /></span> Home
		</a>
		<SideBarDynamicMenu user={data.user} />
		<a
			href="/admin/logout"
			class="px-6 py-4 border-b border-white/10 flex items-center gap-3 font-bold text-base text-white hover:bg-black/10 hover:text-white/80 cursor-default active:text-white/70 transition-all duration-100"
		>
			<span class="text-yellow-500"><ArrowSquareOut size="20" weight="bold" /></span> Deslogar
		</a>
	</nav>
</aside>

<div class="fixed right-0 inset-y-0 max-w-[calc(100%_-_300px)] w-full text-white">
	<main
		class="absolute overflow-y-auto my-12 max-h-[calc(100%_-_96px)] left-1/2 -translate-x-1/2 w-[calc(100%_-_160px)] max-w-screen-main rounded-3xl px-[42px] py-12 bg-d-gray-100/50 border border-white/10 backdrop-blur-3xl shadow-black/25 shadow-[0_4px_25px_0_var(--tw-shadow-color)]"
	>
		<slot />
	</main>
</div>

<style>
	aside {
		background:
			linear-gradient(rgba(16, 15, 19, 0.75), rgba(16, 15, 19, 0.75)),
			linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
			linear-gradient(rgba(62, 64, 79, 0.4), rgba(62, 64, 79, 0.4)),
			url("/src/assets/noise-pattern.svg") repeat center center;
	}

	.bg-blob {
		width: 1200px;
		height: 1200px;
		background: radial-gradient(circle at center, #ff9e28 0, transparent 60%);
		filter: contrast(120%) brightness(100%);
		filter: blur(150px);
	}

	.bg-blobs-overlay {
		background: url("/src/assets/noise-pattern.svg") repeat center center;
		mix-blend-mode: overlay;
	}
</style>
