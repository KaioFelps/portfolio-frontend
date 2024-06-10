<script lang="ts">
	import LogoDark from "$crate/assets/logo-dark-mode.svg";
	import Logo from "$crate/assets/logo-white-mode.svg";
	import { page } from "$app/stores";
	import ThemeToggler from "$crate/ui/themeToggleButton.svelte";

	let currentPath: string | null = null;
	page.subscribe((value) => (currentPath = value.url.pathname));
</script>

<header class="h-[120px] flex gap-6 px-6 max-xs:hidden">
	<div class="flex-1 flex justify-start items-center max-sm:hidden">
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />
	</div>

	<nav
		class="
        flex-1 flex flex-row gap-[10px] self-center justify-center items-center
        prose-a:transition-all prose-a:leading-none
        prose-a:text-black dark:data-[active=false]:prose-a:text-white prose-a:font-medium prose-a:p-[10px] prose-a:border-[transparent] hover:prose-a:border-yellow-500 prose-a:border-b data-[active=true]:prose-a:rounded-full data-[active=true]:prose-a:bg-yellow-500
        "
	>
		<a data-active={currentPath === "/"} href="/">Home</a>
		<a data-active={currentPath === "/sobre"} href="/sobre">Sobre</a>
		<a data-active={currentPath === "/sobre"} href="/sobre">Blog</a>
		<a data-active={currentPath === "/projetos"} href="/projetos">Projetos</a>
	</nav>

	<div class="flex-1 flex items-center justify-end">
		<ThemeToggler />
	</div>
</header>
