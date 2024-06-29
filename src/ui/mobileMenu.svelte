<script lang="ts">
	import LogoDark from "$crate/assets/logo-dark-mode.svg";
	import Logo from "$crate/assets/logo-white-mode.svg";
	import { page } from "$app/stores";
	import X from "phosphor-svelte/lib/X";
	import { Dialog } from "bits-ui";

	export let close: () => void;

	$: currentPath = $page.url.pathname;
</script>

<div>
	<header
		class="flex flex-row justify-between items-center gap-4 p-6 h-[120px] border-b border-gray-300 dark:border-gray-800"
	>
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />

		<Dialog.Close
			class="
                    cursor-default p-2 rounded-xl bg-transparent dark:bg-white/10 border border-black/10 dark:border-white/10
                    hover:bg-black/5 outline-gray-600/30
                    dark:hover:bg-white/15 dark:outline-d-gray-600/30
                    active:brightness-95 ring-0 focus:ring-0 outline-0 focus:outline-4 transition-all
                    "
		>
			<X size="20" weight="bold" />
		</Dialog.Close>
	</header>

	<div
		class="
                flex flex-col p-6 gap-1
                prose-a:text-xl prose-a:font-medium prose-a:p-3 prose-a:px-6 prose-a:w-full prose-a:rounded-xl prose-a:bg-gray-200 dark:prose-a:bg-d-gray-100
                hover:prose-a:bg-gray-300 dark:hover:prose-a:bg-d-gray-200 duration-500 hover:prose-a:pl-7
                prose-a:transition-all prose-a:cursor-default
                "
	>
		<a data-active={currentPath === "/"} href="/" on:click={close}>Home</a>
		<a data-active={currentPath === "/sobre"} href="/sobre" on:click={close}>Sobre</a>
		<a data-active={currentPath === "/blog"} href="/blog" on:click={close}>Blog</a>
		<a data-active={currentPath === "/projetos"} href="/projetos" on:click={close}>Projetos</a>
	</div>
</div>
