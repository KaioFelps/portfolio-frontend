<script>
	import GithubLogo from "phosphor-svelte/lib/GithubLogo";
	import BehanceLogo from "phosphor-svelte/lib/BehanceLogo";
	import LinkedinLogo from "phosphor-svelte/lib/LinkedinLogo";
	import { socialMedias } from "$crate/config/socialMedias";
</script>

<footer class="w-full h-[109px] px-16 flex items-center justify-center mt-20 shrink-0">
	<div
		class="
        flex flex-row gap-2
        prose-a:leading-none prose-a:p-2 prose-a:rounded-lg prose-a:transition-all prose-a:flex prose-a:gap-1 prose-a:items-center
		prose-a:font-medium prose-a:text-black/80 dark:prose-a:text-white/80
		hover:prose-a:text-tangerine-600 dark:hover:prose-a:text-yellow-700 hover:prose-a:bg-gray-200 dark:hover:prose-a:bg-d-gray-200
        "
	>
		<a href={socialMedias.linkedin} target="_blank">
			<LinkedinLogo size="24" weight="fill" /> Linkedin</a
		>
		<a href={socialMedias.github} target="_blank"><GithubLogo size="24" weight="fill" /> Github</a>
		<a href={socialMedias.behance} target="_blank">
			<BehanceLogo size="24" weight="fill" /> Behance</a
		>
	</div>
</footer>
