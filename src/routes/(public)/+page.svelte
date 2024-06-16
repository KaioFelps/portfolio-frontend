<script>
	import ArrowRight from "phosphor-svelte/lib/ArrowRight";
</script>

<main
	class="flex-1 w-[calc(100%_-_24px)] max-w-screen-main mx-auto flex flex-col items-center justify-center"
>
	<h1 class="mb-20 text-center">Kaio Felipe</h1>

	<h2 class="mb-6 font-medium text-2xl text-center">Desenvolvo layouts e sites fantásticos!</h2>

	<a class="group btn default text-lg font-semibold" href="/projetos">
		<span class="max-2xs:hidden">Conheça o meu trabalho</span>
		<span class="2xs:hidden">Projetos</span>
		<ArrowRight
			size="20"
			weight="bold"
			class="translate-x-0 group-hover:translate-x-1 transition-all duration-150 ease-in"
		/>
	</a>
</main>

<style>
	h1 {
		@apply font-bold text-7xl w-fit;

		@supports (background: -webkit-linear-gradient(180deg, #fff, #000)) {
			color: transparent;
			background: -webkit-linear-gradient(
				0deg,
				theme("colors.yellow-600"),
				theme("colors.yellow-500")
			);
			-webkit-fill-color: transparent;
			-webkit-background-clip: text;
		}
	}
</style>
