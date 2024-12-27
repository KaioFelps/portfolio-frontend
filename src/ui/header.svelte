<script lang="ts">
	import LogoDark from "$crate/assets/logo-dark-mode.svg";
	import Logo from "$crate/assets/logo-white-mode.svg";
	import { page } from "$app/stores";
	import ThemeToggler from "$crate/ui/themeToggleButton.svelte";

	let currentPath: string | null = null;
	page.subscribe((value) => (currentPath = value.url.pathname));
</script>

<header class="h-[120px] flex gap-6 px-6 max-xs:hidden mb-20 shrink-0">
	<a
		href="/"
		class="flex-1 flex justify-start items-center max-sm:hidden hover:bg-transparent active:bg-transparent"
	>
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />
	</a>

	<nav
		class="
        flex-1 flex flex-row gap-1 self-center justify-center items-center
        prose-a:transition-all prose-a:leading-none prose-a:duration-75
        prose-a:text-black dark:data-[active=false]:prose-a:text-white prose-a:font-medium
		prose-a:px-4 prose-a:pt-2 prose-a:pb-1.5 prose-a:border-[transparent] prose-a:border-b
		hover:prose-a:border-yellow-500 hover:prose-a:bg-yellow-500/5
		data-[active=true]:prose-a:rounded-lg data-[active=true]:prose-a:bg-yellow-500/25
		data-[active=true]:prose-a:text-yellow-900 data-[active=true]:prose-a:font-bold
		data-[active=true]:prose-a:border-yellow-500
		data-[active=true]:prose-a:border-t data-[active=true]:prose-a:border-b-0
		dark:data-[active=true]:prose-a:border-yellow-900
		dark:data-[active=true]:prose-a:bg-yellow-900/20
		dark:data-[active=true]:prose-a:text-yellow-600
        "
	>
		<a data-active={currentPath === "/"} href="/">Home</a>
		<a data-active={currentPath === "/sobre"} href="/sobre">Sobre mim</a>
		<a data-active={currentPath?.startsWith("/blog")} href="/blog">Blog</a>
		<a data-active={currentPath === "/projetos"} href="/projetos">Projetos</a>
	</nav>

	<div class="flex-1 flex items-center justify-end">
		<ThemeToggler />
	</div>
</header>
