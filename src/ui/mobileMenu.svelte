<script lang="ts">
	import LogoDark from "@/assets/logo-dark-mode.svg";
	import Logo from "@/assets/logo-white-mode.svg";
	import { page } from "$app/stores";
	import X from "phosphor-svelte/lib/X";
	import { getDrawerStore } from "@skeletonlabs/skeleton";

	const drawerStore = getDrawerStore();

	$: currentPath = $page.url.pathname;
</script>

<div>
	<header
		class="flex flex-row justify-between items-center gap-4 p-6 h-[120px] border-b border-gray-300 dark:border-gray-800"
	>
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />

		<button
			on:click={() => drawerStore.close()}
			class="
                    cursor-default p-2 rounded-xl bg-transparent dark:bg-white/10 border border-black/10 dark:border-white/10
                    hover:bg-black/5 outline-gray-600/30
                    dark:hover:bg-white/15 dark:outline-d-gray-600/30
                    active:brightness-95 ring-0 focus:ring-0 outline-0 focus:outline-4 transition-all
                    "
		>
			<X size="20" weight="bold" />
		</button>
	</header>

	<div
		class="
                flex flex-col p-6 gap-1
                prose-a:text-xl prose-a:font-medium prose-a:p-3 prose-a:px-6 prose-a:w-full prose-a:rounded-xl prose-a:bg-gray-200 dark:prose-a:bg-d-gray-100
                hover:prose-a:bg-gray-300 dark:hover:prose-a:bg-d-gray-200 duration-500 hover:prose-a:pl-7
                prose-a:transition-all prose-a:cursor-default
                "
	>
		<a data-active={currentPath === "/"} href="/">Home</a>
		<a data-active={currentPath === "/sobre"} href="/sobre">Sobre</a>
		<a data-active={currentPath === "/sobre"} href="/sobre">Blog</a>
		<a data-active={currentPath === "/projetos"} href="/projetos">Projetos</a>
	</div>
</div>

<!-- <Dialog.Root modal={true} bind:open={modalIsOpen}>
	<Dialog.Trigger
		class="
        rounded-full border-gray-300 dark:border-d-gray-300 border
        w-[46px] h-[46px] hover:scale-105 transition-all ease-in cursor-default
        flex items-center justify-center
        "
	>
		<Sidebar size={24} weight="bold" />
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
		<Dialog.Content
			class="
            fixed left-0 inset-y-0 w-full max-w-80
			bg-backgrond dark:bg-d-backgrond
			focus:outline-none data-[state=open]:animate-contentShow
            data-[state=open]:animate-sheetSwipeInFromLeft data-[state=closed]:animate-sheetSwipeInToLeft
            "
			openAutoFocus={true}
			closeAutoFocus={true}
		>

		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root> -->
