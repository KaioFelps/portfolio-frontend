<script lang="ts">
	import LogoDark from "$crate/assets/logo-dark-mode.svg";
	import Logo from "$crate/assets/logo-white-mode.svg";
	import { page } from "$app/state";
	import X from "phosphor-svelte/lib/X";
	import { Dialog } from "bits-ui";
	import clsx from "clsx";

	const { close }: { close: () => void } = $props();
	const currentPath = page.url.pathname;
</script>

<div>
	<header
		class="flex flex-row justify-between items-center gap-4 p-6 py-2 border-b border-gray-300 dark:border-gray-800"
	>
		<img class="dark:hidden w-[170px]" src={Logo} alt="Kaio Felps" />
		<img class="hidden dark:inline-block w-[170px]" src={LogoDark} alt="Kaio Felps" />

		<Dialog.Close
			autofocus={false}
			class={clsx(
				"cursor-default p-3 rounded-full bg-transparent dark:bg-white/5",
				"hover:bg-black/5",
				"dark:hover:bg-white/10",
				"active:brightness-95 outline-none ring-0 dark:ring-white/15 ring-black/15 focus:ring-4 transition-all",
			)}
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
		<a data-active={currentPath === "/"} href="/" onclick={close}>Home</a>
		<a data-active={currentPath === "/sobre"} href="/sobre" onclick={close}>Sobre</a>
		<a data-active={currentPath === "/blog"} href="/blog" onclick={close}>Blog</a>
		<a data-active={currentPath === "/projetos"} href="/projetos" onclick={close}>Projetos</a>
	</div>
</div>
