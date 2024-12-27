<script>
	import Title from "$crate/components/title.svelte";
	import { getYearsFromNow } from "$crate/utils";

	const myBirthday = new Date("07/17/2005");
	const myAge = getYearsFromNow(myBirthday);

	const startedStudyingAt = new Date("01/01/2022");
	const yearsStudying = getYearsFromNow(startedStudyingAt);
</script>

<svelte:head>
	<Title title="Sobre mim" />
</svelte:head>

<main
	class="flex-1 w-[calc(100%_-_24px)] max-w-screen-md mx-auto flex flex-col items-center justify-center"
>
	<h1
		class="
        text-5xl font-bold text-center w-full px-12 pb-6 border-b
        border-gray-300 dark:border-d-gray-300 mb-16
        "
	>
		Sobre mim
	</h1>

	<div class="prose-p:mb-6 last:prose-p:!mb-0 prose-p:text-xl text-balance text-center">
		<p>
			Tenho {myAge} anos. Hoje, sou um graduando em Ciência da Computação pela UTFPR-CM. Há {yearsStudying}
			anos, venho estudando e me aprofundando cada vez mais em ambos os polos do desenvolvimento web
			— front e back-end.
		</p>

		<p>
			Apesar de não ter experiência profissional, já fiz alguns {" "}
			<a href="/projetos" class="link">projetos</a>! Você pode conferir tudo e mais um pouco no meu {" "}
			<a href="https://github.com/KaioFelps" target="_blank"> github </a>.
		</p>
	</div>
</main>
